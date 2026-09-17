'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { I18N, Lang } from '@/lib/i18n'
import { LegalPage } from '@/lib/legal-content'
import { Footer } from '@/components/landing/Footer'

interface Props {
  content: Record<Lang, LegalPage>
}

const BACK: Record<Lang, string> = { en: '← Back to home', ka: '← მთავარ გვერდზე დაბრუნება' }

export function LegalPageShell({ content }: Props) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('nwk-lang') as Lang | null
      if (saved && I18N[saved]) return saved
      if (navigator.language.toLowerCase().startsWith('en')) return 'en'
    } catch {}
    return 'ka'
  })

  // Sync the <html lang> attribute to React state, rather than mutating it
  // directly inside the click handler -- keeps the DOM in sync with state
  // via an effect instead of an inline side effect in the event handler.
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  function handleLangChange(l: Lang) {
    setLang(l)
    try { localStorage.setItem('nwk-lang', l) } catch {}
  }

  const page = content[lang]

  return (
    <>
      <nav className="nav">
        <div className="wrap nav-inner">
          <div className="nav-left">
            <Link href="/" className="nav-logo">
              <svg className="nav-logo-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <rect width="32" height="32" rx="7" fill="#0D9488" />
                <circle cx="7" cy="25" r="3.5" fill="white" />
                <circle cx="25" cy="7" r="3.5" fill="white" />
                <circle cx="25" cy="25" r="3.5" fill="white" />
                <circle cx="7" cy="7" r="3.5" fill="white" />
                <line x1="7" y1="25" x2="7" y2="7" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="7" y1="7" x2="25" y2="25" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="25" y1="7" x2="25" y2="25" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <span className="nav-logo-name">Networker</span>
            </Link>
          </div>
          <div className="nav-right">
            <div className="lang-switch" role="group" aria-label="Language">
              {(['ka', 'en'] as Lang[]).map((l) => (
                <button
                  key={l}
                  className={`lang-btn${lang === l ? ' active' : ''}`}
                  type="button"
                  onClick={() => handleLangChange(l)}
                >
                  {l === 'en' ? 'EN' : 'ქარ'}
                </button>
              ))}
            </div>
            <Link href="/" className="nav-cta">
              <span className="cta-label">{BACK[lang]}</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="wrap-narrow" style={{ padding: '64px 32px 96px' }}>
        <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-3">{page.eyebrow}</p>
        <h1 className="text-navy-950 text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-head)' }}>
          {page.title}
        </h1>
        {page.updated && <p className="text-ink-500 text-sm mb-8">{page.updated}</p>}
        <p className="text-ink-700 text-lg leading-relaxed mb-10">{page.intro}</p>

        <div className="flex flex-col gap-9">
          {page.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-navy-900 text-xl font-semibold mb-3">{section.heading}</h2>
              <div className="flex flex-col gap-3">
                {section.body.map((paragraph, j) => (
                  <p key={j} className="text-ink-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer
        t={(key: string) => I18N[lang][key] ?? key}
        onContactClick={() => { window.location.href = '/#waitlist' }}
      />
    </>
  )
}
