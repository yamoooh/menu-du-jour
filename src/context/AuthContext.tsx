import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { UserProfile, SignUpParams, SignInParams } from '@/types/auth.types'

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

  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    if (!supabase) return null

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Erreur de récupération du profil :', error.message)
        return null
      }

      // Si le trigger de création automatique n'a pas encore fini (latence réseau)
      if (!data) {
        await new Promise((resolve) => setTimeout(resolve, 600))
        const { data: retryData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle()

        return retryData || null
      }

      return data
    } catch (err) {
      console.error('Erreur inattendue lors du chargement du profil :', err)
      return null
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      const p = await fetchProfile(user.id)
      setProfile(p)
    }
  }, [user?.id, fetchProfile])

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
        const p = await fetchProfile(initSession.user.id)
        if (isMounted) setProfile(p)
      }

      if (isMounted) setLoading(false)
    })

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        if (!isMounted) return

        setSession(currentSession)
        setUser(currentSession?.user ?? null)

        if (currentSession?.user) {
          const p = await fetchProfile(currentSession.user.id)
          if (isMounted) setProfile(p)
        } else {
          if (isMounted) setProfile(null)
        }

        if (isMounted) setLoading(false)
      }
    )

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

    // Rôle admin interdit en inscription publique
    if (role === ('admin' as string)) {
      return { error: new Error('Le rôle Administrateur ne peut pas être attribué à l\'inscription'), needsEmailConfirmation: false }
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    })

    if (error) return { error: new Error(translateAuthError(error.message)), needsEmailConfirmation: false }

    const newUser = data.user
    const needsEmailConfirmation = !data.session && !!newUser

    // Si le numéro de téléphone est renseigné, le mettre à jour sur le profil
    if (newUser && phone && phone.trim()) {
      // Laisser le temps au trigger handle_new_user de créer la ligne
      setTimeout(async () => {
        await supabase
          .from('profiles')
          .update({ phone: phone.trim() })
          .eq('id', newUser.id)
      }, 500)
    }

    return { error: null, needsEmailConfirmation }
  }

  const signIn = async ({ email, password }: SignInParams): Promise<{ error: Error | null }> => {
    if (!supabase) return { error: new Error('Client Supabase non initialisé') }

    const { error } = await supabase.auth.signInWithPassword({
      email,
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
    return 'Trop de tentatives en peu de temps. Veuillez réespayer dans quelques minutes.'
  }
  if (lower.includes('network') || lower.includes('fetch')) {
    return 'Problème de connexion réseau. Veuillez vérifier votre connexion internet.'
  }
  return message
}
