import { Lang } from '@/lib/i18n'

interface Props {
  t: (key: string) => string
  lang: Lang
  onLangChange: (l: Lang) => void
}

export function Nav({ t, lang, onLangChange }: Props) {
  return (
    <nav className="nav">
      <div className="wrap nav-inner">
        <div className="nav-left">
          <a href="#top" className="nav-logo">
            <svg className="nav-logo-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect width="32" height="32" rx="7" fill="#0D9488"/>
              <circle cx="7" cy="25" r="3.5" fill="white"/>
              <circle cx="25" cy="7" r="3.5" fill="white"/>
              <circle cx="25" cy="25" r="3.5" fill="white"/>
              <circle cx="7" cy="7" r="3.5" fill="white"/>
              <line x1="7" y1="25" x2="7" y2="7" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="7" y1="7" x2="25" y2="25" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="25" y1="7" x2="25" y2="25" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span className="nav-logo-name">Networker</span>
          </a>
          <div className="nav-links">
            <a href="#solution" className="nav-link">{t('nav_product')}</a>
            <a href="#compare" className="nav-link">{t('nav_compare')}</a>
            <a href="#pricing" className="nav-link">{t('nav_pricing')}</a>
            <a href="#team" className="nav-link">{t('nav_team')}</a>
          </div>
        </div>
        <div className="nav-right">
          <div className="lang-switch" role="group" aria-label="Language">
            {(['en', 'ka'] as Lang[]).map((l) => (
              <button
                key={l}
                className={`lang-btn${lang === l ? ' active' : ''}`}
                type="button"
                onClick={() => onLangChange(l)}
              >
                {l === 'en' ? 'EN' : 'ქარ'}
              </button>
            ))}
          </div>
          <a href="#waitlist" className="nav-cta">
            <span className="cta-label">{t('nav_cta')}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
        </div>
      </div>
    </nav>
  )
}
