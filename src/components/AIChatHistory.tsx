import { useTranslation } from 'react-i18next';

function AIChatHistory() {
  const { t } = useTranslation();

  return (
    <div>
      <h2>{t('chatHistory')}</h2>
      // ... existing code ...
    </div>
  );
}