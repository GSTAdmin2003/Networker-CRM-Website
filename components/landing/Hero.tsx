import { EditableText } from '@/components/cms/EditableText'
import { Lang } from '@/lib/i18n'

interface Props {
  t: (key: string) => string
  lang: Lang
  editMode: boolean
}

export function Hero({ t, lang, editMode }: Props) {
  return (
    <section className="hero" id="top">
      <div className="hero-grid" />
      <div className="wrap hero-inner">
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          {editMode
            ? <EditableText cmsKey={`hero_eyebrow_${lang}`} html={t('hero_eyebrow')} />
            : <span dangerouslySetInnerHTML={{ __html: t('hero_eyebrow') }} />}
        </div>
        <h1 className="hero-headline">
          {editMode
            ? <EditableText cmsKey={`hero_h1_${lang}`} html={t('hero_h1')} />
            : <span dangerouslySetInnerHTML={{ __html: t('hero_h1') }} />}
        </h1>
        <p className="hero-sub">
          {editMode
            ? <EditableText cmsKey={`hero_sub_${lang}`} html={t('hero_sub')} />
            : <span dangerouslySetInnerHTML={{ __html: t('hero_sub') }} />}
        </p>
        <div className="hero-actions">
          <a href="#waitlist" className="btn btn-primary">
            <span dangerouslySetInnerHTML={{ __html: t('hero_cta_primary') }} />
            <svg className="btn-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
          <a href="#solution" className="btn btn-secondary">
            <span dangerouslySetInnerHTML={{ __html: t('hero_cta_secondary') }} />
          </a>
        </div>
        <div className="hero-meta">
          {(['hero_meta_1','hero_meta_2','hero_meta_3'] as const).map((k) => (
            <div key={k} className="hero-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              <span dangerouslySetInnerHTML={{ __html: t(k) }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
