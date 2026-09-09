import React, { useEffect, useRef, useState, useCallback } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Navigation, Compass, ExternalLink, Search, Loader2 } from 'lucide-react'

// Correctif des icônes de marqueur Leaflet avec Vite / Webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

export interface GoogleMapProps {
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

interface NominatimResult {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  boundingbox: string[]
  lat: string
  lon: string
  display_name: string
  class: string
  type: string
  importance: number
}

export const GoogleMap: React.FC<GoogleMapProps> = ({
  latitude,
  longitude,
  address,
  restaurantName = 'Restaurant',
  interactive = false,
  onLocationChange,
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerInstanceRef = useRef<L.Marker | null>(null)

  const [, setUserCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [distanceKm, setDistanceKm] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([])
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  // Coordonnées par défaut : Abidjan / Douala si non définies
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

  // Obtenir la position actuelle du navigateur (API W3C native)
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
          if (interactive && mapInstanceRef.current && markerInstanceRef.current) {
            mapInstanceRef.current.panTo([coords.lat, coords.lng])
            mapInstanceRef.current.setZoom(15)
            markerInstanceRef.current.setLatLng([coords.lat, coords.lng])
            if (onLocationChange) {
              onLocationChange({
                latitude: parseFloat(coords.lat.toFixed(7)),
                longitude: parseFloat(coords.lng.toFixed(7)),
              })
            }
          }
        },
        () => {
          setSearchError('Géolocalisation du navigateur refusée ou non disponible.')
        }
      )
    }
  }, [calculateHaversine, hasCoordinates, interactive, latitude, longitude, onLocationChange])

  // Recherche d'adresse via l'API publique Nominatim OpenStreetMap (Debounce 400ms)
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 3) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      setSearchError(null)
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery.trim()
        )}&format=json&addressdetails=1&limit=5`

        const res = await fetch(url, {
          headers: {
            'Accept-Language': 'fr,en',
          },
        })

        if (!res.ok) throw new Error('Erreur réseau lors de la recherche.')
        const data: NominatimResult[] = await res.json()
        setSearchResults(data || [])
        if (!data || data.length === 0) {
          setSearchError('Aucune adresse correspondante trouvée.')
        }
      } catch {
        setSearchError('Impossible d\'effectuer la recherche d\'adresse pour le moment.')
      } finally {
        setIsSearching(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Sélection d'un résultat dans la liste d'autocomplétion Nominatim
  const handleSelectResult = (item: NominatimResult) => {
    const newLat = parseFloat(parseFloat(item.lat).toFixed(7))
    const newLng = parseFloat(parseFloat(item.lon).toFixed(7))

    if (mapInstanceRef.current && markerInstanceRef.current) {
      mapInstanceRef.current.panTo([newLat, newLng])
      mapInstanceRef.current.setZoom(16)
      markerInstanceRef.current.setLatLng([newLat, newLng])
    }

    if (onLocationChange) {
      onLocationChange({
        latitude: newLat,
        longitude: newLng,
        address: item.display_name,
      })
    }

    setSearchResults([])
    setSearchQuery('')
    setSearchError(null)
  }

  // Initialisation de la carte Leaflet
  useEffect(() => {
    if (!mapRef.current) return

    const pos: [number, number] = [defaultLat, defaultLng]
    const map = L.map(mapRef.current, {
      center: pos,
      zoom: hasCoordinates ? 16 : 13,
      zoomControl: true,
      scrollWheelZoom: false,
    })

    // Tuiles OpenStreetMap officielles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map)

    // Marqueur du restaurant
    const marker = L.marker(pos, {
      draggable: interactive,
      title: restaurantName,
    }).addTo(map)

    if (interactive && onLocationChange) {
      // Déplacement du marqueur par drag
      marker.on('dragend', () => {
        const position = marker.getLatLng()
        onLocationChange({
          latitude: parseFloat(position.lat.toFixed(7)),
          longitude: parseFloat(position.lng.toFixed(7)),
        })
      })

      // Déplacement du marqueur par clic sur la carte
      map.on('click', (e: L.LeafletMouseEvent) => {
        marker.setLatLng(e.latlng)
        onLocationChange({
          latitude: parseFloat(e.latlng.lat.toFixed(7)),
          longitude: parseFloat(e.latlng.lng.toFixed(7)),
        })
      })
    }

    mapInstanceRef.current = map
    markerInstanceRef.current = marker

    // Recalcul de la taille de carte après rendu React
    const resizeTimer = setTimeout(() => {
      map.invalidateSize()
    }, 250)

    return () => {
      clearTimeout(resizeTimer)
      map.remove()
      mapInstanceRef.current = null
      markerInstanceRef.current = null
    }
  }, []) // Initialisation unique

  // Synchronisation si les coordonnées props changent
  useEffect(() => {
    if (mapInstanceRef.current && markerInstanceRef.current && hasCoordinates) {
      const pos: [number, number] = [latitude!, longitude!]
      markerInstanceRef.current.setLatLng(pos)
      mapInstanceRef.current.panTo(pos)
    }
  }, [latitude, longitude, hasCoordinates])

  // Lien d'itinéraire externe Google Maps (sans clé API)
  const getDirectionsUrl = () => {
    if (hasCoordinates) {
      return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
    }
    if (address) {
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurantName)}`
  }

  return (
    <div className="space-y-3">
      {/* Barre de recherche d'adresse Nominatim OpenStreetMap si mode interactif */}
      {interactive && (
        <div className="relative space-y-1">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une adresse sur OpenStreetMap..."
                className="w-full pl-9 pr-8 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              {isSearching && (
                <Loader2 className="w-4 h-4 text-orange-500 animate-spin absolute right-2.5 top-1/2 -translate-y-1/2" />
              )}
            </div>

            <button
              type="button"
              onClick={getUserLocation}
              title="Utiliser ma position actuelle"
              className="px-3.5 py-2 rounded-xl bg-orange-100 text-orange-700 hover:bg-orange-200 font-semibold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 text-xs"
            >
              <Compass className="w-4 h-4" />
              <span className="hidden sm:inline">Ma position</span>
            </button>
          </div>

          {/* Menu déroulant de résultats Nominatim */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden text-xs max-h-56 overflow-y-auto divide-y divide-slate-100">
              {searchResults.map((item) => (
                <button
                  key={item.place_id}
                  type="button"
                  onClick={() => handleSelectResult(item)}
                  className="w-full text-left p-3 hover:bg-orange-50/70 transition-colors flex items-start gap-2.5 cursor-pointer text-slate-700"
                >
                  <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 overflow-hidden">
                    <p className="font-medium truncate">{item.display_name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Lat: {parseFloat(item.lat).toFixed(4)} | Lon: {parseFloat(item.lon).toFixed(4)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {searchError && (
        <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 text-xs border border-amber-200 font-medium">
          {searchError}
        </div>
      )}

      {/* Conteneur de carte interactive OpenStreetMap / Leaflet */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs h-64 sm:h-72 bg-slate-100 z-10">
        <div ref={mapRef} className="w-full h-full" />

        {/* Overlay d'actions ou d'infos */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
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
