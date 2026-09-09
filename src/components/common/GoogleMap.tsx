import React, { useEffect, useRef, useState, useCallback } from 'react'
import { MapPin, Navigation, Compass, AlertCircle, ExternalLink, Search } from 'lucide-react'

interface GoogleMapProps {
  latitude?: number | null
  longitude?: number | null
  address?: string | null
  restaurantName?: string
  interactive?: boolean
  onLocationChange?: (location: {
    latitude: number
    longitude: number
    address?: string
    google_place_id?: string
  }) => void
}

declare global {
  interface Window {
    google?: any
    initGoogleMapCallback?: () => void
  }
}

export const GoogleMap: React.FC<GoogleMapProps> = ({
  latitude,
  longitude,
  address,
  restaurantName = 'Restaurant',
  interactive = false,
  onLocationChange,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [markerInstance, setMarkerInstance] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [, setUserCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [distanceKm, setDistanceKm] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [geocodingError, setGeocodingError] = useState<string | null>(null)

  // Position par défaut : Abidjan, Côte d'Ivoire (si non définie)
  const defaultLat = latitude ?? 5.3599517
  const defaultLng = longitude ?? -4.0082563
  const hasCoordinates = latitude !== null && latitude !== undefined && longitude !== null && longitude !== undefined

  // Calcul de la distance réelle par la formule de Haversine
  const calculateHaversine = useCallback((lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Rayon de la Terre en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return parseFloat((R * c).toFixed(1))
  }, [])

  // Obtenir la position actuelle du navigateur
  const getUserLocation = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          setUserCoords(coords)
          if (hasCoordinates) {
            const dist = calculateHaversine(coords.lat, coords.lng, latitude!, longitude!)
            setDistanceKm(dist)
          }
          if (interactive && mapInstance) {
            mapInstance.panTo(coords)
            mapInstance.setZoom(15)
            if (markerInstance) {
              markerInstance.setPosition(coords)
            }
            if (onLocationChange) {
              onLocationChange({ latitude: coords.lat, longitude: coords.lng })
            }
          }
        },
        () => {
          setGeocodingError("Géolocalisation du navigateur refusée ou non disponible.")
        }
      )
    }
  }, [calculateHaversine, hasCoordinates, interactive, latitude, longitude, mapInstance, markerInstance, onLocationChange])

  // Injection du script Google Maps API
  useEffect(() => {
    if (!apiKey) return

    if (window.google?.maps) {
      setIsLoaded(true)
      return
    }

    const scriptId = 'google-maps-script'
    let existingScript = document.getElementById(scriptId) as HTMLScriptElement

    if (!existingScript) {
      existingScript = document.createElement('script')
      existingScript.id = scriptId
      existingScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
      existingScript.async = true
      existingScript.defer = true
      document.head.appendChild(existingScript)
    }

    const checkLoaded = setInterval(() => {
      if (window.google?.maps) {
        setIsLoaded(true)
        clearInterval(checkLoaded)
      }
    }, 200)

    return () => clearInterval(checkLoaded)
  }, [apiKey])

  // Initialisation de la carte
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google?.maps) return

    const pos = { lat: defaultLat, lng: defaultLng }
    const map = new window.google.maps.Map(mapRef.current, {
      center: pos,
      zoom: hasCoordinates ? 16 : 13,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
    })

    const marker = new window.google.maps.Marker({
      position: pos,
      map,
      title: restaurantName,
      draggable: interactive,
      animation: window.google.maps.Animation.DROP,
    })

    if (interactive && onLocationChange) {
      // Déplacement du marker par drag
      marker.addListener('dragend', () => {
        const newPos = marker.getPosition()
        if (newPos) {
          onLocationChange({
            latitude: newPos.lat(),
            longitude: newPos.lng(),
          })
        }
      })

      // Déplacement du marker par clic sur la carte
      map.addListener('click', (e: any) => {
        if (e.latLng) {
          marker.setPosition(e.latLng)
          onLocationChange({
            latitude: e.latLng.lat(),
            longitude: e.latLng.lng(),
          })
        }
      })
    }

    setMapInstance(map)
    setMarkerInstance(marker)
  }, [isLoaded, interactive, hasCoordinates])

  // Mise à jour de la position du marker si les props changent
  useEffect(() => {
    if (markerInstance && mapInstance && hasCoordinates) {
      const pos = { lat: latitude!, lng: longitude! }
      markerInstance.setPosition(pos)
      mapInstance.panTo(pos)
    }
  }, [latitude, longitude, hasCoordinates, markerInstance, mapInstance])

  // Générer l'URL Google Maps officielle d'itinéraire
  const getDirectionsUrl = () => {
    if (hasCoordinates) {
      return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
    }
    if (address) {
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurantName)}`
  }

  // Recherche d'adresse manuelle (Géocodage via Google Places/Geocoder si clé disponible)
  const handleSearchAddress = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim() || !window.google?.maps?.Geocoder) return

    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ address: searchQuery }, (results: any[], status: string) => {
      if (status === 'OK' && results[0]) {
        const loc = results[0].geometry.location
        const newLat = loc.lat()
        const newLng = loc.lng()
        const formatted = results[0].formatted_address
        const placeId = results[0].place_id

        if (mapInstance && markerInstance) {
          mapInstance.panTo({ lat: newLat, lng: newLng })
          mapInstance.setZoom(16)
          markerInstance.setPosition({ lat: newLat, lng: newLng })
        }

        if (onLocationChange) {
          onLocationChange({
            latitude: newLat,
            longitude: newLng,
            address: formatted,
            google_place_id: placeId,
          })
        }
        setGeocodingError(null)
      } else {
        setGeocodingError('Adresse introuvable. Veuillez essayer avec une adresse plus précise.')
      }
    })
  }

  // Si la clé API Google Maps n'est pas encore configurée dans .env
  if (!apiKey) {
    return (
      <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4 shadow-md border border-slate-800">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/30 font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-extrabold text-white text-sm">
              Localisation & Carte Google Maps
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {address ? `Adresse : ${address}` : 'Adresse enregistrée pour le restaurant'}
            </p>
          </div>
        </div>

        {/* Info configuration */}
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Intégration Google Maps Platform prête. Configurez <code className="text-orange-400 bg-slate-950 px-1.5 py-0.5 rounded font-mono">VITE_GOOGLE_MAPS_API_KEY</code> dans Vercel/.env pour afficher la carte interactive en direct.
          </span>
        </div>

        {/* Bouton d'itinéraire externe toujours fonctionnel */}
        <div className="pt-1">
          <a
            href={getDirectionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-xs shadow-md transition-all"
          >
            <Navigation className="w-4 h-4" />
            Voir l'itinéraire sur Google Maps
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Barre de recherche d'adresse si mode interactif */}
      {interactive && (
        <form onSubmit={handleSearchAddress} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une adresse sur Google Maps..."
              className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            Chercher
          </button>
          <button
            type="button"
            onClick={getUserLocation}
            title="Utiliser ma position actuelle"
            className="p-2 rounded-xl bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors cursor-pointer shrink-0"
          >
            <Compass className="w-4 h-4" />
          </button>
        </form>
      )}

      {geocodingError && (
        <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 font-medium">
          {geocodingError}
        </div>
      )}

      {/* Conteneur de carte interactive */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs h-64 sm:h-72 bg-slate-100">
        <div ref={mapRef} className="w-full h-full" />

        {/* Overlay d'actions ou d'infos */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {distanceKm !== null && (
            <span className="pointer-events-auto px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-xs text-slate-900 text-xs font-extrabold shadow-md border border-slate-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              À {distanceKm} km de votre position
            </span>
          )}

          <a
            href={getDirectionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto ml-auto px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-900 text-white font-bold text-xs backdrop-blur-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 text-orange-400" />
            Itinéraire
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {hasCoordinates && (
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
          <span>Lat : {latitude?.toFixed(6)} | Lng : {longitude?.toFixed(6)}</span>
          {address && <span className="truncate max-w-xs">{address}</span>}
        </div>
      )}
    </div>
  )
}
