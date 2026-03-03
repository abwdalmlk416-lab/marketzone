import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Language } from './i18n';

// Language Context
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'rtl' | 'ltr';
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Storage key
const LANGUAGE_KEY = 'marketzone_language';

// Language Provider Component
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Try to get from localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LANGUAGE_KEY);
      if (stored === 'ar' || stored === 'en') {
        return stored;
      }
      // Check browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'ar') return 'ar';
    }
    return 'ar'; // Default to Arabic
  });

  // Update document direction based on language
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    // Set document direction
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    
    // Save to localStorage
    localStorage.setItem(LANGUAGE_KEY, language);
    
    // Update body class for styling
    document.body.classList.remove('rtl', 'ltr');
    document.body.classList.add(dir);
  }, [language, dir]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState(prev => prev === 'ar' ? 'en' : 'ar');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// SEO Meta tags updater hook
export function useSeoMeta(title: string, description: string, canonicalUrl?: string) {
  const { language } = useLanguage();

  useEffect(() => {
    // Update title
    document.title = title;

    // Update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Update canonical URL
    if (canonicalUrl) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute('href', canonicalUrl);
    }

    // Update Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    // Update hreflang
    const hreflangAr = document.querySelector('link[hreflang="ar"]');
    const hreflangEn = document.querySelector('link[hreflang="en"]');
    
    if (hreflangAr) {
      hreflangAr.setAttribute('href', canonicalUrl?.replace('/en', '/ar') || 'https://www.marketzone.com/ar');
    }
    if (hreflangEn) {
      hreflangEn.setAttribute('href', canonicalUrl?.replace('/ar', '/en') || 'https://www.marketzone.com/en');
    }

  }, [title, description, canonicalUrl, language]);
}

