import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { profileService } from '@/services/profileService'
import {
  User,
  Upload,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Phone,
  Mail,
  Sparkles,
} from 'lucide-react'

export const ClientProfileSettings: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth()

  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url || null)

  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Enregistrer les modifications du profil
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    const { error } = await profileService.updateProfile({
      fullName,
      phone,
    })

    setLoading(false)

    if (error) {
      setErrorMessage(error.message)
    } else {
      setSuccessMessage('Votre profil a été mis à jour avec succès.')
      await refreshProfile()
    }
  }

  // Upload d'avatar dans Supabase Storage
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    const { url, error } = await profileService.uploadAvatar(file)
    setUploading(false)

    if (error) {
      setErrorMessage(error.message)
    } else if (url) {
      setAvatarUrl(url)
      setSuccessMessage('Photo de profil mise à jour avec succès.')
      await refreshProfile()
    }
  }

  // Supprimer l'avatar
  const handleDeleteAvatar = async () => {
    setUploading(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    const { error } = await profileService.deleteAvatar()
    setUploading(false)

    if (error) {
      setErrorMessage(error.message)
    } else {
      setAvatarUrl(null)
      setSuccessMessage('Photo de profil supprimée.')
      await refreshProfile()
    }
  }

  return (
    <div className="space-y-6">
      {/* Messages de succès et d'erreur */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Carte Aperçu Profil Gourmet */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 rounded-2xl p-6 text-white shadow-xl border border-slate-800 flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="relative group shrink-0">
          <div className="w-24 h-24 rounded-full border-4 border-orange-500/30 overflow-hidden bg-slate-800 shadow-md flex items-center justify-center">
            {avatarUrl ? (
              <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-orange-400" />
            )}
          </div>

          {avatarUrl && (
            <button
              onClick={handleDeleteAvatar}
              disabled={uploading}
              title="Supprimer la photo"
              className="absolute -bottom-1 -right-1 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md transition-transform hover:scale-110 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Détails Utilisateur */}
        <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[10px] font-extrabold uppercase tracking-wider border border-orange-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-orange-400" />
              Client Gourmet
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Compte Vérifié
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-white truncate">
            {fullName || 'Gourmet Menu du Jour'}
          </h2>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-orange-400" />
              <span>{user?.email}</span>
            </div>
            {phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-orange-400" />
                <span>{phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bouton Téléverser Avatar */}
        <div className="shrink-0">
          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Transfert...' : 'Changer la photo'}</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarUpload} disabled={uploading} className="hidden" />
          </label>
        </div>
      </div>

      {/* Formulaire de modification */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base pb-3 border-b border-slate-100">
          <User className="w-5 h-5 text-orange-600" />
          <span>Informations Personnelles</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Nom complet *</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Numéro de téléphone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+225 0700000000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">Adresse email (Non modifiable)</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm font-medium cursor-not-allowed"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Enregistrement...' : 'Enregistrer mon profil'}
          </button>
        </div>
      </form>
    </div>
  )
}
