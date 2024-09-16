import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('lang', lng);
    navigate({ search: searchParams.toString() });
  };

  return (
    <div>
      <span>{t('Language')}: </span>
      <button onClick={() => changeLanguage('en')}>{t('English')}</button>
      <button onClick={() => changeLanguage('fr')}>{t('French')}</button>
    </div>
  );
};

export default LanguageSelector;