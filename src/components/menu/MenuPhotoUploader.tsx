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

    // Validation type
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner un fichier image valide (JPG, PNG, WEBP).')
      return
    }

    // Validation taille max 5 Mo
    if (file.size > 5 * 1024 * 1024) {
      setError('La taille de l\'image ne doit pas dépasser 5 Mo.')
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
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <Image className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Photos de présentation du menu</h4>
            <p className="text-xs text-slate-500">Ajoutez des visuels de vos plats du jour</p>
          </div>
        </div>

        <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 text-xs font-semibold cursor-pointer transition-colors">
          <Upload className="w-3.5 h-3.5" />
          <span>{uploading ? 'Chargement...' : 'Ajouter une photo'}</span>
          <input
            type="file"
            accept="image/*"
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
          <p>Aucune photo associée à ce menu.</p>
          <p className="text-slate-500">Ajoutez une photo pour illustrer vos plats auprès des clients.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {photos.map((photo) => {
            const url = menuService.getPhotoPublicUrl(photo.storage_path)
            return (
              <div
                key={photo.id}
                className="group relative rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100 shadow-xs"
              >
                <img
                  src={url}
                  alt={photo.alt_text || 'Photo du menu'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  type="button"
                  onClick={() => setPhotoToDelete(photo)}
                  className="absolute top-2 right-2 p-1.5 bg-slate-900/70 hover:bg-red-600 text-white rounded-lg opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Supprimer la photo"
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
