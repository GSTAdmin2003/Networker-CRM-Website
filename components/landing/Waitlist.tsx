'use client'
import { EditableText } from '@/components/cms/EditableText'
import { Lang } from '@/lib/i18n'

interface Props { t: (key: string) => string; lang: Lang; onContactClick: () => void }

export function Waitlist({ t, lang, onContactClick }: Props) {
  return (
    <section className="waitlist section" id="waitlist">
      <div className="wrap waitlist-inner">
        <div className="waitlist-eyebrow">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6"/></svg>
          <EditableText cmsKey={`wl_eyebrow_${lang}`} html={t('wl_eyebrow')} />
        </div>
        <h2><EditableText cmsKey={`wl_title_${lang}`} html={t('wl_title')} /></h2>
        <p className="waitlist-sub"><EditableText cmsKey={`wl_sub_${lang}`} html={t('wl_sub')} /></p>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
          <button className="wl-submit" type="button" onClick={onContactClick}>
            <span dangerouslySetInnerHTML={{ __html: t('wl_submit') }} />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </button>
        </div>

        <div className="wl-foot">
          {(['wl_foot_1','wl_foot_2','wl_foot_3'] as const).map((k) => (
            <span key={k} dangerouslySetInnerHTML={{ __html: t(k) }} />
          ))}
        </div>
      </div>
    </section>
  )
}
