import { supabase } from '@/lib/supabase'
import type { UserProfile } from '@/types/auth.types'

export const profileService = {
  // Mettre à jour le profil de l'utilisateur connecté (nom, téléphone)
  async updateProfile(payload: {
    fullName?: string
    phone?: string
  }): Promise<{ data: UserProfile | null; error: Error | null }> {
    if (!supabase) return { data: null, error: new Error('Client Supabase non initialisé') }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: new Error('Utilisateur non authentifié') }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...(payload.fullName !== undefined && { full_name: payload.fullName.trim() }),
          phone: payload.phone !== undefined ? payload.phone?.trim() || null : undefined,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select('*')
        .single()

      if (error) return { data: null, error: new Error(error.message) }
      return { data: data as UserProfile, error: null }
    } catch (err: any) {
      return { data: null, error: new Error(err.message || 'Erreur lors de la mise à jour du profil') }
    }
  },

  // Télécharger une photo d'avatar de profil dans Supabase Storage (BLOC 3)
  async uploadAvatar(
    file: File
  ): Promise<{ url: string | null; error: Error | null }> {
    if (!supabase) return { url: null, error: new Error('Client Supabase non initialisé') }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { url: null, error: new Error('Utilisateur non authentifié') }

    // Validation de taille (max 3 Mo)
    if (file.size > 3 * 1024 * 1024) {
      return { url: null, error: new Error('La photo dépasse la taille maximale autorisée (3 Mo).') }
    }

    // Validation du type MIME
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return { url: null, error: new Error('Format d image non supporté. Veuillez utiliser JPG, PNG ou WebP.') }
    }

    try {
      const ext = file.name.split('.').pop() || 'jpg'
      const filePath = `${user.id}/avatar_${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true, contentType: file.type })

      if (uploadError) {
        return { url: null, error: new Error(uploadError.message || 'Erreur lors du téléchargement de l avatar') }
      }

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      const publicUrl = publicUrlData.publicUrl

      // Mettre à jour le profil avec la nouvelle URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      if (updateError) {
        return { url: null, error: new Error(updateError.message) }
      }

      return { url: publicUrl, error: null }
    } catch (err: any) {
      return { url: null, error: new Error(err.message || 'Erreur lors du téléchargement de l avatar') }
    }
  },

  // Supprimer la photo de profil (Avatar)
  async deleteAvatar(): Promise<{ error: Error | null }> {
    if (!supabase) return { error: new Error('Client Supabase non initialisé') }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: new Error('Utilisateur non authentifié') }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      if (error) return { error: new Error(error.message) }
      return { error: null }
    } catch (err: any) {
      return { error: new Error(err.message || 'Erreur lors de la suppression de l avatar') }
    }
  },
}
