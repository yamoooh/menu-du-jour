import React, { useState } from 'react'
import type { MenuPhoto } from '@/types/menu.types'
import { menuService } from '@/services/menuService'
import { Image, Upload, Trash2, AlertCircle } from 'lucide-react'

interface MenuPhotoUploaderProps {
  restaurantId: string
  menuId: string
  photos: MenuPhoto[]
  onPhotosUpdated: () => void
}

export const MenuPhotoUploader: React.FC<MenuPhotoUploaderProps> = ({
  restaurantId,
  menuId,
  photos,
  onPhotosUpdated,
}) => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [photoToDelete, setPhotoToDelete] = useState<MenuPhoto | null>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    const isImage = file.type.startsWith('image/')

    // Validation type
    if (!isPdf && !isImage) {
      setError('Veuillez sélectionner une image (JPG, PNG, WEBP) ou un document PDF valide.')
      return
    }

    // Validation taille max 10 Mo
    if (file.size > 10 * 1024 * 1024) {
      setError('La taille du fichier ne doit pas dépasser 10 Mo.')
      return
    }

    setUploading(true)
    const { error: uploadErr } = await menuService.uploadMenuPhoto(restaurantId, menuId, file)
    setUploading(false)

    if (uploadErr) {
      setError(uploadErr.message)
    } else {
      onPhotosUpdated()
    }
  }

  const handleDeletePhoto = async () => {
    if (!photoToDelete) return

    setError(null)
    const { error: delErr } = await menuService.deleteMenuPhoto(photoToDelete.id, photoToDelete.storage_path)
    setPhotoToDelete(null)

    if (delErr) {
      setError(delErr.message)
    } else {
      onPhotosUpdated()
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <Image className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Visuels et Documents du Menu (Images & PDF)</h4>
            <p className="text-xs text-slate-500">Ajoutez des photos de plats ou la carte intégrale au format PDF</p>
          </div>
        </div>

        <label className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 text-xs font-semibold cursor-pointer transition-colors shrink-0">
          <Upload className="w-3.5 h-3.5" />
          <span>{uploading ? 'Chargement...' : 'Ajouter Image ou PDF'}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf,.pdf"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {photos.length === 0 ? (
        <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400 space-y-1">
          <p>Aucun support visuel ou PDF associé à ce menu.</p>
          <p className="text-slate-500">Ajoutez vos photos ou votre fichier PDF pour captiver vos clients.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {photos.map((photo) => {
            const url = menuService.getPhotoPublicUrl(photo.storage_path)
            const isPdf = photo.storage_path.toLowerCase().endsWith('.pdf')

            return (
              <div
                key={photo.id}
                className="group relative rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100 shadow-xs flex flex-col items-center justify-center"
              >
                {isPdf ? (
                  <div className="w-full h-full p-4 flex flex-col items-center justify-center bg-slate-900 text-white space-y-2 text-center">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                      PDF
                    </div>
                    <span className="text-[11px] font-bold truncate max-w-full px-1">
                      {photo.alt_text || 'Carte PDF'}
                    </span>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-orange-400 underline font-semibold"
                    >
                      Consulter
                    </a>
                  </div>
                ) : (
                  <img
                    src={url}
                    alt={photo.alt_text || 'Photo du menu'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}

                <button
                  type="button"
                  onClick={() => setPhotoToDelete(photo)}
                  className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-red-600 text-white rounded-lg opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Supprimer ce fichier"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Confirmation de suppression */}
      {photoToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm p-6 space-y-4 text-center">
            <h4 className="font-bold text-slate-900 text-base">Supprimer cette photo ?</h4>
            <p className="text-xs text-slate-600">
              Cette action est irréversible. La photo sera supprimée du menu.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPhotoToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeletePhoto}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
