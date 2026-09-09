import React, { useState, useEffect } from 'react'
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight, ExternalLink, FileText, Download } from 'lucide-react'

export interface MediaItem {
  url: string
  title?: string
  type?: 'image' | 'pdf'
}

interface MediaViewerModalProps {
  isOpen: boolean
  onClose: () => void
  items: MediaItem[]
  initialIndex?: number
}

export const MediaViewerModal: React.FC<MediaViewerModalProps> = ({
  isOpen,
  onClose,
  items,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [zoomLevel, setZoomLevel] = useState(1)

  useEffect(() => {
    setCurrentIndex(initialIndex)
    setZoomLevel(1)
  }, [initialIndex, isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && items.length > 1) handleNext()
      if (e.key === 'ArrowLeft' && items.length > 1) handlePrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, items.length, currentIndex])

  if (!isOpen || items.length === 0) return null

  const currentItem = items[currentIndex] || items[0]
  const isPdf = currentItem.type === 'pdf' || currentItem.url.toLowerCase().includes('.pdf')

  const handleNext = () => {
    setZoomLevel(1)
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  const handlePrev = () => {
    setZoomLevel(1)
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.5, 3))
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.5, 0.5))
  const handleResetZoom = () => setZoomLevel(1)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 sm:p-6 animate-fadeIn">
      {/* Header Modal Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 text-white">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-slate-800/80 backdrop-blur-xs text-xs font-bold border border-slate-700">
            {currentIndex + 1} / {items.length}
          </span>
          {currentItem.title && (
            <span className="text-sm font-semibold truncate max-w-xs sm:max-w-md">
              {currentItem.title}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {!isPdf && (
            <>
              <button
                onClick={handleZoomOut}
                title="Zoom arrière"
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white transition-colors cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                title="Réinitialiser le zoom"
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomIn}
                title="Zoom avant"
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white transition-colors cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </>
          )}

          <a
            href={currentItem.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Ouvrir dans un nouvel onglet"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold px-3"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Plein écran</span>
          </a>

          <button
            onClick={onClose}
            title="Fermer"
            className="p-2 rounded-xl bg-red-600/90 hover:bg-red-600 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full h-full max-w-5xl max-h-[85vh] flex items-center justify-center overflow-hidden relative mt-12">
        {isPdf ? (
          <div className="w-full h-full flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
            <div className="p-3 bg-slate-800 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-2 text-orange-400 font-bold text-xs">
                <FileText className="w-4 h-4" />
                <span>Document PDF</span>
              </div>
              <a
                href={currentItem.url}
                download
                className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Télécharger
              </a>
            </div>
            <iframe
              src={currentItem.url}
              className="w-full h-full border-none"
              title="Lecteur PDF Menu du Jour"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center overflow-auto p-2">
            <img
              src={currentItem.url}
              alt={currentItem.title || 'Image de menu'}
              style={{ transform: `scale(${zoomLevel})` }}
              className="max-w-full max-h-full object-contain transition-transform duration-200 ease-out rounded-lg shadow-2xl"
            />
          </div>
        )}

        {/* Navigation Flèches si plusieurs éléments */}
        {items.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              title="Précédent"
              className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white transition-all shadow-lg border border-slate-700 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              title="Suivant"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white transition-all shadow-lg border border-slate-700 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
