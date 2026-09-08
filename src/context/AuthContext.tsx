import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { UserProfile, UserRole, SignUpParams, SignInParams } from '@/types/auth.types'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  signUp: (params: SignUpParams) => Promise<{ error: Error | null; needsEmailConfirmation: boolean }>
  signIn: (params: SignInParams) => Promise<{ error: Error | null }>
  signOut: () => Promise<{ error: Error | null }>
  refreshProfile: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  /**
   * Récupération robuste du profil utilisateur avec tentatives multiples et profil de secours.
   */
  const fetchProfile = useCallback(async (currUser: User): Promise<UserProfile> => {
    const userId = currUser.id
    const meta = currUser.user_metadata || {}

    const fallbackProfile: UserProfile = {
      id: userId,
      full_name: meta.full_name || currUser.email || 'Utilisateur',
      phone: meta.phone || null,
      role: (meta.role as UserRole) || 'client',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (!supabase) return fallbackProfile

    try {
      // Tentative 1
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (data) return data as UserProfile

      // Re-tentatives si le trigger PostgreSQL prend quelques millisecondes
      for (const delay of [200, 500, 1000]) {
        await new Promise((resolve) => setTimeout(resolve, delay))
        const { data: retryData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle()

        if (retryData) return retryData as UserProfile
      }

      if (error) {
        console.warn('Utilisation du profil de secours suite à une erreur RLS/BDD:', error.message)
      }

      return fallbackProfile
    } catch (err) {
      console.warn('Exception lors de la récupération du profil, utilisation du secours:', err)
      return fallbackProfile
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user) {
      const p = await fetchProfile(user)
      setProfile(p)
    }
  }, [user, fetchProfile])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let isMounted = true

    // Initialiser la session actuelle
    supabase.auth.getSession().then(async ({ data: { session: initSession } }) => {
      if (!isMounted) return

      setSession(initSession)
      setUser(initSession?.user ?? null)

      if (initSession?.user) {
        const p = await fetchProfile(initSession.user)
        if (isMounted) setProfile(p)
      }

      if (isMounted) setLoading(false)
    })

    // Écouter les changements d'état d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (!isMounted) return

      setSession(currentSession)
      setUser(currentSession?.user ?? null)

      if (currentSession?.user) {
        const p = await fetchProfile(currentSession.user)
        if (isMounted) setProfile(p)
      } else {
        if (isMounted) setProfile(null)
      }

      if (isMounted) setLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signUp = async ({
    email,
    password,
    firstName,
    lastName,
    phone,
    role,
  }: SignUpParams): Promise<{ error: Error | null; needsEmailConfirmation: boolean }> => {
    if (!supabase) return { error: new Error('Client Supabase non initialisé'), needsEmailConfirmation: false }

    // Le rôle Administrateur est strictement interdit lors de l'inscription publique
    if (role === ('admin' as string)) {
      return {
        error: new Error('Le rôle Administrateur ne peut pas être attribué lors d\'une inscription publique.'),
        needsEmailConfirmation: false,
      }
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim()
    const userPhone = phone?.trim() || null

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName,
          role,
          phone: userPhone,
        },
      },
    })

    if (error) return { error: new Error(translateAuthError(error.message)), needsEmailConfirmation: false }

    const newUser = data.user
    const needsEmailConfirmation = !data.session && !!newUser

    return { error: null, needsEmailConfirmation }
  }

  const signIn = async ({ email, password }: SignInParams): Promise<{ error: Error | null }> => {
    if (!supabase) return { error: new Error('Client Supabase non initialisé') }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) {
      return { error: new Error(translateAuthError(error.message)) }
    }

    return { error: null }
  }

  const signOut = async (): Promise<{ error: Error | null }> => {
    if (!supabase) return { error: null }

    const { error } = await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setProfile(null)

    if (error) return { error: new Error(error.message) }
    return { error: null }
  }

  const resetPassword = async (email: string): Promise<{ error: Error | null }> => {
    if (!supabase) return { error: new Error('Client Supabase non initialisé') }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/connexion`,
    })

    if (error) return { error: new Error(translateAuthError(error.message)) }
    return { error: null }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        refreshProfile,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé au sein d\'un AuthProvider')
  }
  return context
}

// Fonction de traduction des erreurs Supabase Auth vers du français clair
function translateAuthError(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('invalid login credentials') || lower.includes('invalid_credentials')) {
    return 'Adresse email ou mot de passe incorrect.'
  }
  if (lower.includes('user not found')) {
    return 'Aucun compte associé à cette adresse email.'
  }
  if (lower.includes('email already registered') || lower.includes('already exists')) {
    return 'Un compte existe déjà avec cette adresse email.'
  }
  if (lower.includes('password should be at least')) {
    return 'Le mot de passe doit contenir au moins 6 caractères.'
  }
  if (lower.includes('email rate limit exceeded')) {
    return 'Trop de tentatives en peu de temps. Veuillez réessayer dans quelques minutes.'
  }
  if (lower.includes('network') || lower.includes('fetch')) {
    return 'Problème de connexion réseau. Veuillez vérifier votre connexion internet.'
  }
  return message
}
