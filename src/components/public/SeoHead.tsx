import React, { useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'

interface SeoHeadProps {
  title: string
  description: string
  path?: string
  schema?: object
  noindex?: boolean
}

export const SeoHead: React.FC<SeoHeadProps> = ({ title, description, path = '', schema, noindex = false }) => {
  const { language } = useLanguage()

  useEffect(() => {
    // Robots meta tag for noindex
    let metaRobots = document.querySelector('meta[name="robots"]')
    if (noindex) {
      if (!metaRobots) {
        metaRobots = document.createElement('meta')
        metaRobots.setAttribute('name', 'robots')
        document.head.appendChild(metaRobots)
      }
      metaRobots.setAttribute('content', 'noindex, nofollow')
    } else if (metaRobots) {
      metaRobots.remove()
    }
    // Modifier le titre de la page
    document.title = title

    // Modifier la meta description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', description)

    // Meta OpenGraph
    const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta')
    ogTitle.setAttribute('property', 'og:title')
    ogTitle.setAttribute('content', title)
    document.head.appendChild(ogTitle)

    const ogDesc = document.querySelector('meta[property="og:description"]') || document.createElement('meta')
    ogDesc.setAttribute('property', 'og:description')
    ogDesc.setAttribute('content', description)
    document.head.appendChild(ogDesc)

    // URL Canonical
    const currentOrigin = window.location.origin
    const fullUrl = `${currentOrigin}${path}`

    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', fullUrl)

    // Balises hreflang
    let hreflangFr = document.querySelector('link[hreflang="fr"]')
    if (!hreflangFr) {
      hreflangFr = document.createElement('link')
      hreflangFr.setAttribute('rel', 'alternate')
      hreflangFr.setAttribute('hreflang', 'fr')
      document.head.appendChild(hreflangFr)
    }
    hreflangFr.setAttribute('href', fullUrl)

    let hreflangEn = document.querySelector('link[hreflang="en"]')
    if (!hreflangEn) {
      hreflangEn = document.createElement('link')
      hreflangEn.setAttribute('rel', 'alternate')
      hreflangEn.setAttribute('hreflang', 'en')
      document.head.appendChild(hreflangEn)
    }
    hreflangEn.setAttribute('href', fullUrl)

    // Injection Schema.org JSON-LD
    let scriptSchema = document.getElementById('json-ld-schema')
    if (schema) {
      if (!scriptSchema) {
        scriptSchema = document.createElement('script')
        scriptSchema.setAttribute('id', 'json-ld-schema')
        scriptSchema.setAttribute('type', 'application/ld+json')
        document.head.appendChild(scriptSchema)
      }
      scriptSchema.textContent = JSON.stringify(schema)
    } else if (scriptSchema) {
      scriptSchema.remove()
    }
  }, [title, description, path, language, schema, noindex])

  return null
}
