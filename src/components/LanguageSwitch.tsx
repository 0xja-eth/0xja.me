'use client';

import { useLanguage } from '@/i18n/context';
import { Globe } from '@phosphor-icons/react';

export default function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
      className="fixed top-4 right-4 z-50 pixel-button flex items-center gap-2 bg-gray-900/50 backdrop-blur-sm"
      aria-label="Switch Language"
    >
      <Globe size={20} />
      <span>{language.toUpperCase()}</span>
    </button>
  );
}
