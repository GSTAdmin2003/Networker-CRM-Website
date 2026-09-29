'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { I18N, makeT, Lang } from '@/lib/i18n'
import { LANG_PATH } from '@/lib/site'
import { Nav } from '@/components/landing/Nav'
import { Hero } from '@/components/landing/Hero'
import { Problem } from '@/components/landing/Problem'
import { Features } from '@/components/landing/Features'
import { Compare } from '@/components/landing/Compare'
import { Pricing } from '@/components/landing/Pricing'
import { Team } from '@/components/landing/Team'
import { Waitlist } from '@/components/landing/Waitlist'
import { Footer } from '@/components/landing/Footer'
import { ContactModal } from '@/components/landing/ContactModal'

interface Props {
  photos: { tsotne: string | null; davit: string | null; levan: string | null }
  /** Language of the route rendering this page (`/` = ka, `/en` = en). */
  initialLang?: Lang
}

export default function LandingPage({ photos, initialLang = 'ka' }: Props) {
  const router = useRouter()
  // The language is decided by the URL (`/` = Georgian, `/en` = English), so the
  // server-rendered HTML -- the only thing most crawlers read -- always matches
  // what a visitor on that URL sees. It used to be guessed in the browser from
  // localStorage/navigator.language, which rendered a different language on the
  // client than on the server.
  const [lang, setLang] = useState<Lang>(initialLang)
  const [contactOpen, setContactOpen] = useState(false)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  // Honour an EXPLICIT earlier choice (the language switch) by moving to that
  // language's URL. Deliberately never guesses from the browser language:
  // crawlers report en-US, and redirecting them would hide the Georgian page.
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nwk-lang') as Lang | null
      if (saved && I18N[saved] && saved !== initialLang) {
        router.replace(LANG_PATH[saved], { scroll: false })
      }
    } catch {}
  }, [initialLang, router])

  function handleLangChange(l: Lang) {
    setLang(l)
    try { localStorage.setItem('nwk-lang', l) } catch {}
    router.push(LANG_PATH[l], { scroll: false })
  }

  const t = makeT(lang)

  const sections = (
    <>
      <Nav t={t} lang={lang} onLangChange={handleLangChange} />
      <Hero t={t} lang={lang} />
      <Problem t={t} lang={lang} />
      <Features t={t} lang={lang} />
      <Compare t={t} lang={lang} />
      <Pricing t={t} lang={lang} />
      <Team t={t} lang={lang} photos={photos} />
      <Waitlist t={t} lang={lang} onContactClick={() => setContactOpen(true)} />
      <Footer t={t} onContactClick={() => setContactOpen(true)} />
      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} t={t} lang={lang} />}
    </>
  )

  return sections
}
