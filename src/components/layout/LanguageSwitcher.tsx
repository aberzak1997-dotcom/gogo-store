import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'fr', label: 'FR', full: 'Français' },
  { code: 'ar', label: 'ع', full: 'العربية' },
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const current = i18n.language?.split('-')[0] || 'en'

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code)
    localStorage.setItem('app_language', code)
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = code
  }

  return (
    <div className="flex items-center gap-0.5">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          title={lang.full}
          className={`px-2 py-1 text-[11px] font-bold rounded-[6px] transition-all ${
            current === lang.code
              ? 'bg-[#1160CB] text-white'
              : 'text-[#0C0D10]/40 hover:text-[#1160CB] hover:bg-[#F0F2F8]'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}
