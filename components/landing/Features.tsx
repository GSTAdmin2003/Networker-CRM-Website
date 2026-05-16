import { Lang } from '@/lib/i18n'

interface Props { t: (key: string) => string; lang: Lang }

export function Features({ t }: Props) {
  return (
    <section className="section" id="solution">
      <div className="wrap">
        <div className="features-head">
          <div className="section-eyebrow">
            <span className="section-eyebrow-num">02</span>
            <span dangerouslySetInnerHTML={{ __html: t('sol_eyebrow') }} />
          </div>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t('sol_title') }} />
          <p className="section-lede" dangerouslySetInnerHTML={{ __html: t('sol_lede') }} />
        </div>
        <div className="features-grid">
          {/* Feature 1 — Telephony */}
          <article className="feature">
            <div className="feature-num">01 / 04</div>
            <div className="feature-vis">
              <div className="vis-call">
                <div className="vis-call-num">
                  <span className="vis-call-flag" aria-hidden="true" />
                  +995 32 2 14 88 00
                </div>
                <div className="vis-call-wave" aria-hidden="true">
                  {Array.from({ length: 14 }).map((_, i) => <span key={i} />)}
                </div>
                <div className="vis-call-meta">REC · 00:02:14 · GE-STT</div>
              </div>
            </div>
            <h3 className="feature-title" dangerouslySetInnerHTML={{ __html: t('feat_1_title') }} />
            <p className="feature-desc" dangerouslySetInnerHTML={{ __html: t('feat_1_desc') }} />
          </article>
          {/* Feature 2 — AI */}
          <article className="feature">
            <div className="feature-num">02 / 04</div>
            <div className="feature-vis">
              <div className="vis-ai">
                <div className="vis-ai-line"><span className="vis-ai-spk">REP</span><span>&#x201C;გადავუგზავნი წინადადებას ხუთშაბათამდე.&#x201D;</span></div>
                <div className="vis-ai-line"><span className="vis-ai-spk">LEAD</span><span>&#x201C;კარგი, ველოდები. ბიუჯეტი დადასტურდა.&#x201D;</span></div>
                <div className="vis-ai-action">
                  <span className="vis-ai-tag">AI</span>
                  <span dangerouslySetInnerHTML={{ __html: t('feat_2_action') }} />
                </div>
              </div>
            </div>
            <h3 className="feature-title" dangerouslySetInnerHTML={{ __html: t('feat_2_title') }} />
            <p className="feature-desc" dangerouslySetInnerHTML={{ __html: t('feat_2_desc') }} />
          </article>
          {/* Feature 3 — WhatsApp */}
          <article className="feature">
            <div className="feature-num">03 / 04</div>
            <div className="feature-vis">
              <div className="vis-inbox">
                <div className="vis-msg"><div className="vis-msg-avatar">NK</div><div className="vis-msg-bubble" dangerouslySetInnerHTML={{ __html: t('feat_3_msg1') }} /></div>
                <div className="vis-msg vis-msg-mine"><div className="vis-msg-avatar">D</div><div className="vis-msg-bubble" dangerouslySetInnerHTML={{ __html: t('feat_3_msg2') }} /></div>
                <div className="vis-msg"><div className="vis-msg-avatar">NK</div><div className="vis-msg-bubble" dangerouslySetInnerHTML={{ __html: t('feat_3_msg3') }} /></div>
              </div>
            </div>
            <h3 className="feature-title" dangerouslySetInnerHTML={{ __html: t('feat_3_title') }} />
            <p className="feature-desc" dangerouslySetInnerHTML={{ __html: t('feat_3_desc') }} />
          </article>
          {/* Feature 4 — Pipeline */}
          <article className="feature">
            <div className="feature-num">04 / 04</div>
            <div className="feature-vis">
              <div className="vis-pipe">
                {[
                  { key: 'pipe_new', count: 4, cards: [{ label: t('pipe_card_1'), val: '~$2,400', isNew: true }, { label: 'Tronixer Co.', val: '~$5,100' }] },
                  { key: 'pipe_contacted', count: 9, cards: [{ label: 'Sales Assoc.', val: '~$3,800' }, { label: 'Geo Logistics', val: '~$1,900' }] },
                  { key: 'pipe_qualified', count: 6, cards: [{ label: 'Caucasus Auto', val: '~$7,200' }] },
                  { key: 'pipe_won', count: 3, cards: [{ label: 'Adjara Build', val: '~$11,000' }] },
                ].map((col) => (
                  <div key={col.key} className="vis-pipe-col">
                    <div className="vis-pipe-head"><span dangerouslySetInnerHTML={{ __html: t(col.key) }} /><span>{col.count}</span></div>
                    {col.cards.map((c, i) => (
                      <div key={i} className={`vis-pipe-card${c.isNew ? ' new' : ''}`}>
                        {c.label}<div className="vis-pipe-value">{c.val}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <h3 className="feature-title" dangerouslySetInnerHTML={{ __html: t('feat_4_title') }} />
            <p className="feature-desc" dangerouslySetInnerHTML={{ __html: t('feat_4_desc') }} />
          </article>
        </div>
      </div>
    </section>
  )
}
