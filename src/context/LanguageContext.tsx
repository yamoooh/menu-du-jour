import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations, type Language, type Translations } from '@/i18n/translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('menu_du_jour_lang')
    if (saved === 'en' || saved === 'fr') return saved
    // Détection navigateur par défaut
    const navLang = navigator.language.slice(0, 2).toLowerCase()
    return navLang === 'en' ? 'en' : 'fr'
  })

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('menu_du_jour_lang', lang)
    document.documentElement.lang = lang
  }

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const t = translations[language]

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage doit être utilisé au sein d\'un LanguageProvider')
  }
  return context
}
