import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LanguageSelector from './components/LanguageSelector';
import I18nProvider from './components/I18nProvider';
import TopNavigationBar from './components/TopNavigationBar';
import ClientOnly from './components/ClientOnly';

function App() {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');
    
    if (lang && (lang === 'en' || lang === 'fr')) {
      console.log("Changing language to", lang);
      i18n.changeLanguage(lang);
    } else {
      // Get the browser's language
      const browserLang = navigator.language.split('-')[0];
      
      // Check if the browser language is supported (en or fr)
      const supportedLang = ['en', 'fr'].includes(browserLang) ? browserLang : 'en';
      
      console.log("Defaulting to browser language:", supportedLang);
      i18n.changeLanguage(supportedLang);
    }
  }, [i18n]);

  return (
    <Router>
      <div className="App">
        <LanguageSelector />
        <TopNavigationBar />
        <h1>{t('Welcome')}</h1>
        {/* ... rest of your app content */}
      </div>
    </Router>
  );
}

export default App;