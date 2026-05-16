'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { I18N, makeT, Lang } from '@/lib/i18n'
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
import type { CMSContent } from '@/lib/cms'

const CMSLayer = dynamic(() => import('@/components/cms/CMSLayer'), { ssr: false })

interface Props {
  cmsContent: CMSContent
  cmsMode: boolean
  photos: { tsotne: string | null; davit: string | null; levan: string | null }
}

export default function LandingPage({ cmsContent, cmsMode, photos }: Props) {
  const [lang, setLang] = useState<Lang>('en')
  const [contactOpen, setContactOpen] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nwk-lang') as Lang | null
      if (saved && I18N[saved]) setLang(saved)
      else if (navigator.language.toLowerCase().startsWith('ka')) setLang('ka')
    } catch {}
  }, [])

  function handleLangChange(l: Lang) {
    setLang(l)
    try { localStorage.setItem('nwk-lang', l) } catch {}
    document.documentElement.lang = l
  }

  const t = makeT(lang, cmsContent)

  const sections = (
    <>
      <Nav t={t} lang={lang} onLangChange={handleLangChange} />
      <Hero t={t} lang={lang} editMode={cmsMode} />
      <Problem t={t} lang={lang} />
      <Features t={t} lang={lang} />
      <Compare t={t} lang={lang} />
      <Pricing t={t} lang={lang} />
      <Team t={t} lang={lang} photos={photos} />
      <Waitlist t={t} lang={lang} />
      <Footer t={t} onContactClick={() => setContactOpen(true)} />
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} t={t} lang={lang} />
    </>
  )

  if (!cmsMode) return <>{sections}</>

  return <CMSLayer>{sections}</CMSLayer>
}
