import { EditableText } from '@/components/cms/EditableText'
import { Lang } from '@/lib/i18n'

interface Props { t: (key: string) => string; lang: Lang }

const TICK = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>

export function Pricing({ t, lang }: Props) {
  const inclKeys = ['pr_incl_1','pr_incl_2','pr_incl_3','pr_incl_4','pr_incl_5','pr_incl_6','pr_incl_7','pr_incl_8'] as const
  return (
    <section className="pricing section" id="pricing">
      <div className="wrap-narrow">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="section-eyebrow" style={{ justifyContent: 'center' }}>
            <span className="section-eyebrow-num">04</span>
            <EditableText cmsKey={`pr_eyebrow_${lang}`} html={t('pr_eyebrow')} />
          </div>
          <h2 className="section-title" style={{ marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', maxWidth: '24ch' }}>
            <EditableText cmsKey={`pr_title_${lang}`} html={t('pr_title')} />
          </h2>
        </div>
        <div className="pricing-card">
          <div>
            <div className="pricing-tag">
              <EditableText cmsKey={`pr_tag_${lang}`} html={t('pr_tag')} />
            </div>
            <div className="pricing-amount">
              <span className="pricing-amount-cur">$</span>
              <span className="pricing-amount-num">60</span>
              <span className="pricing-amount-unit">
                <EditableText cmsKey={`pr_unit_${lang}`} html={t('pr_unit')} />
              </span>
            </div>
            <div className="pricing-headline">
              <EditableText cmsKey={`pr_headline_${lang}`} html={t('pr_headline')} />
            </div>
            <div className="pricing-sub">
              <EditableText cmsKey={`pr_sub_${lang}`} html={t('pr_sub')} />
            </div>
          </div>
          <div className="pricing-incl">
            {inclKeys.map((k) => (
              <div key={k} className="pricing-incl-item">
                {TICK}
                <EditableText cmsKey={`${k}_${lang}`} html={t(k)} />
              </div>
            ))}
          </div>
        </div>
        <div className="pricing-foot">
          <EditableText cmsKey={`pr_addons_${lang}`} html={t('pr_addons')} />
        </div>
      </div>
    </section>
  )
}
