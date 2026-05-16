interface Props { t: (key: string) => string }

const TICK = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>

export function Pricing({ t }: Props) {
  const inclKeys = ['pr_incl_1','pr_incl_2','pr_incl_3','pr_incl_4','pr_incl_5','pr_incl_6','pr_incl_7','pr_incl_8'] as const
  return (
    <section className="pricing section" id="pricing">
      <div className="wrap-narrow">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="section-eyebrow" style={{ justifyContent: 'center' }}>
            <span className="section-eyebrow-num">04</span>
            <span dangerouslySetInnerHTML={{ __html: t('pr_eyebrow') }} />
          </div>
          <h2 className="section-title" style={{ marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', maxWidth: '24ch' }} dangerouslySetInnerHTML={{ __html: t('pr_title') }} />
        </div>
        <div className="pricing-card">
          <div>
            <div className="pricing-tag" dangerouslySetInnerHTML={{ __html: t('pr_tag') }} />
            <div className="pricing-amount">
              <span className="pricing-amount-cur">$</span>
              <span className="pricing-amount-num">60</span>
              <span className="pricing-amount-unit" dangerouslySetInnerHTML={{ __html: t('pr_unit') }} />
            </div>
            <div className="pricing-headline" dangerouslySetInnerHTML={{ __html: t('pr_headline') }} />
            <div className="pricing-sub" dangerouslySetInnerHTML={{ __html: t('pr_sub') }} />
          </div>
          <div className="pricing-incl">
            {inclKeys.map((k) => (
              <div key={k} className="pricing-incl-item">
                {TICK}
                <span dangerouslySetInnerHTML={{ __html: t(k) }} />
              </div>
            ))}
          </div>
        </div>
        <div className="pricing-foot">
          <div dangerouslySetInnerHTML={{ __html: t('pr_addons') }} />
        </div>
      </div>
    </section>
  )
}
