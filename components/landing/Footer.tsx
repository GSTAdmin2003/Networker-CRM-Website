interface Props { t: (key: string) => string; onContactClick: () => void }

export function Footer({ t, onContactClick }: Props) {
  return (
    <footer>
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="7" fill="#0D9488"/>
            <circle cx="7" cy="25" r="3.5" fill="white"/>
            <circle cx="25" cy="7" r="3.5" fill="white"/>
            <circle cx="25" cy="25" r="3.5" fill="white"/>
            <circle cx="7" cy="7" r="3.5" fill="white"/>
            <line x1="7" y1="25" x2="7" y2="7" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="7" y1="7" x2="25" y2="25" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="25" y1="7" x2="25" y2="25" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <div>
            <div className="footer-brand-name">Networker</div>
            <div className="footer-brand-sub" dangerouslySetInnerHTML={{ __html: t('footer_tagline') }} />
          </div>
        </div>
        <div className="footer-meta">
          <a href="#solution" dangerouslySetInnerHTML={{ __html: t('nav_product') }} />
          <a href="#pricing" dangerouslySetInnerHTML={{ __html: t('nav_pricing') }} />
          <a href="#team" dangerouslySetInnerHTML={{ __html: t('nav_team') }} />
          <a href="#" onClick={(e) => { e.preventDefault(); onContactClick() }} dangerouslySetInnerHTML={{ __html: t('footer_contact') }} />
        </div>
      </div>
      <div className="wrap footer-copy" dangerouslySetInnerHTML={{ __html: t('footer_copy') }} />
    </footer>
  )
}
