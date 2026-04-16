/* Figma asset URLs — node 67:1983 */
const imgLogo = '/images/logo.png';
    const imgPhoneIcon = '/images/number.png';
    const imgEmailIcon = '/images/mail.png';
const imgChatIcon = '/images/livechat.png';
/* Figma payment cards — Component variants 11-30 rendered as images */
const imgVisa = '/images/cards.png';
const imgMC = 'https://www.figma.com/api/mcp/asset/7b5774aa-4a17-43da-947b-c4b84879e4cc';
const imgAmex = 'https://www.figma.com/api/mcp/asset/6b7a0ee2-5475-4d37-a112-e364ba0b7d8e';

export default function Footer() {
  return (
    <footer className="ftr">
      {/* ── CAP ── Figma: Section y=0 h=30, bg white, border-radius 0 0 40px 40px */}
      <div className="ftr__cap" />

      {/* ── CONTACT BAR ── Figma: Section y=30 h=144, bg #202020 */}
      <div className="ftr__contact-bar">
        <div className="ftr__contact-inner ">
          {/* Logo — Figma: Clip path group x=145 y=30, w=130 h=79 */}
          <div className="ftr__logo">
            <img src={imgLogo} alt="Bayou Muscle" className="ftr__logo-img" />
          </div>

          {/* Contact items — Figma: Section x=517.67, Instrument Sans SemiBold 18px #fff */}
          <div className="ftr__contact-items">
            <div className="ftr__contact-item">
              <img src={imgPhoneIcon} alt="" className="ftr__contact-icon" />
              <span className="ftr__contact-text">(000) 123 - 456 78</span>
            </div>
            <div className="ftr__contact-item">
              <img src={imgEmailIcon} alt="" className="ftr__contact-icon" />
              <span className="ftr__contact-text">demo@demo.com</span>
            </div>
            <div className="ftr__contact-item">
              <img src={imgChatIcon} alt="" className="ftr__contact-icon" />
              <span className="ftr__contact-text">live chat</span>
            </div>
          </div>

          {/* Social — Figma: Links right area, color #636363, border-right 1px #636363 */}
          <div className="ftr__social">
            {/* Figma: Unicode FA icons in Dove Gray #636363 */}
            {[
              { href: '#', label: 'Facebook', char: '\uF09A' },
              { href: '#', label: 'Twitter', char: '\uF2B3' },
              { href: '#', label: 'YouTube', char: '\uF167' },
              { href: '#', label: 'Instagram', char: '\uF16D' },
            ].map(s => (
              <a key={s.label} href={s.href} className="ftr__social-link" aria-label={s.label}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  {s.label === 'Facebook' && <path d="M12 2H10C8.67 2 8 2.67 8 4V6H12L11.5 9H8V16H5V9H3V6H5V4C5 1.79 6.79 0 9 0H12V2Z"/>}
                  {s.label === 'Twitter' && <path d="M16 3.04a6.56 6.56 0 0 1-1.88.52A3.28 3.28 0 0 0 15.56 1.6a6.55 6.55 0 0 1-2.08.8 3.28 3.28 0 0 0-5.58 2.99A9.3 9.3 0 0 1 1.11 1.96a3.28 3.28 0 0 0 1.01 4.37 3.26 3.26 0 0 1-1.48-.41v.04a3.28 3.28 0 0 0 2.63 3.21 3.3 3.3 0 0 1-1.48.06 3.28 3.28 0 0 0 3.06 2.28 6.58 6.58 0 0 1-4.07 1.4A6.7 6.7 0 0 1 0 12.86 9.28 9.28 0 0 0 5.03 14.3c6.04 0 9.34-5 9.34-9.34 0-.14 0-.28-.01-.42A6.67 6.67 0 0 0 16 3.04Z"/>}
                  {s.label === 'YouTube' && <path d="M15.67 4.2A2 2 0 0 0 14.27 2.8C13.02 2.5 8 2.5 8 2.5s-5.02 0-6.27.3a2 2 0 0 0-1.4 1.4A20.9 20.9 0 0 0 0 8a20.9 20.9 0 0 0 .33 3.8A2 2 0 0 0 1.73 13.2C2.98 13.5 8 13.5 8 13.5s5.02 0 6.27-.3a2 2 0 0 0 1.4-1.4C15.97 10.85 16 9 16 8s-.03-2.85-.33-3.8ZM6.5 10.5v-5L10.5 8l-4 2.5Z"/>}
                  {s.label === 'Instagram' && <path d="M8 0C5.83 0 5.56.01 4.7.05 3.85.09 3.26.22 2.74.42a4.17 4.17 0 0 0-1.51.98A4.17 4.17 0 0 0 .25 2.91C.05 3.43-.08 4.02-.12 4.87-.16 5.73 0 6 0 8c0 2.17.01 2.44.05 3.3.04.85.17 1.44.37 1.96a4.17 4.17 0 0 0 .98 1.51 4.17 4.17 0 0 0 1.51.98c.52.2 1.11.33 1.96.37C5.56 16 5.83 16 8 16s2.44-.01 3.3-.05c.85-.04 1.44-.17 1.96-.37a4.35 4.35 0 0 0 2.49-2.49c.2-.52.33-1.11.37-1.96C16 10.27 16 10 16 8s-.01-2.44-.05-3.3c-.04-.85-.17-1.44-.37-1.96a4.17 4.17 0 0 0-.98-1.51A4.17 4.17 0 0 0 13.09.25C12.57.05 11.98-.08 11.13-.12 10.27-.16 10 0 8 0Zm0 1.44c2.14 0 2.39.01 3.23.05.78.04 1.2.16 1.48.27.37.14.64.32.92.6.28.28.46.55.6.92.1.28.23.7.27 1.48.04.84.05 1.09.05 3.23s-.01 2.39-.05 3.23c-.04.78-.16 1.2-.27 1.48a2.9 2.9 0 0 1-1.52 1.52c-.28.1-.7.23-1.48.27C10.39 14.55 10.14 14.56 8 14.56s-2.39-.01-3.23-.05c-.78-.04-1.2-.16-1.48-.27a2.9 2.9 0 0 1-.92-.6 2.9 2.9 0 0 1-.6-.92c-.1-.28-.23-.7-.27-1.48C1.46 10.39 1.44 10.14 1.44 8s.01-2.39.05-3.23c.04-.78.16-1.2.27-1.48.14-.37.32-.64.6-.92.28-.28.55-.46.92-.6.28-.1.7-.23 1.48-.27C5.61 1.46 5.86 1.44 8 1.44Zm0 2.45a4.11 4.11 0 1 0 0 8.22 4.11 4.11 0 0 0 0-8.22Zm0 6.78a2.67 2.67 0 1 1 0-5.34 2.67 2.67 0 0 1 0 5.34Zm5.23-6.94a.96.96 0 1 1-1.92 0 .96.96 0 0 1 1.92 0Z"/>}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── HORIZONTAL DIVIDER ── Figma: Section y=174 h=25, border-top #363636 1px at top=12 */}
      <div className="ftr__hdivider-wrap">
        <div className="ftr__hdivider" />
      </div>

      {/* ── MAIN BODY ── Figma: Section y=199 h=377, bg #202020 */}
      <div className="ftr__body">
        <div className="ftr__body-inner">
          {/* ── LINK COLUMNS ── Figma: VerticalBorder x=135 right=616, border-right #363636 1px */}
          <div className="ftr__cols">
            {/* Col 1 — Figma: x=10, Sofia Sans Condensed Black 22px white */}
            <div className="ftr__col">
              <p className="ftr__col-title">Customer Service</p>
              <ul className="ftr__col-list">
                {['Help Center', 'My Account', 'Track My Order', 'Return Policy', 'Gift Cards'].map(l => (
                  <li key={l}><a href="#" className="ftr__col-link">{l}</a></li>
                ))}
              </ul>
            </div>
            <div className="ftr__col">
              <p className="ftr__col-title">About Us</p>
              <ul className="ftr__col-list">
                {['Press Releases', 'Careers', 'Reviews'].map(l => (
                  <li key={l}><a href="#" className="ftr__col-link">{l}</a></li>
                ))}
              </ul>
            </div>
            <div className="ftr__col">
              <p className="ftr__col-title">Quick Links</p>
              <ul className="ftr__col-list">
                {['About Us', 'Contact Us', 'Terms of Service'].map(l => (
                  <li key={l}><a href="#" className="ftr__col-link">{l}</a></li>
                ))}
              </ul>
            </div>
            <div className="ftr__col">
              <p className="ftr__col-title">Products</p>
              <ul className="ftr__col-list">
                {['Protein', 'Performance', 'Weight Management', 'Vitamins & Health'].map(l => (
                  <li key={l}><a href="#" className="ftr__col-link">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── NEWSLETTER ── Figma: right of VerticalBorder, Sofia Sans Condensed Black 32px #ddca8a */}
          <div className="ftr__newsletter">
            {/* Figma: "get 10% off your first purchase" — uppercase, #ddca8a, text-align center */}
            <p className="ftr__nl-title">get 10% off your<br />first purchase</p>
            {/* Figma: "Sign up..." Instrument Sans Regular 16px white, text-align center */}
            <p className="ftr__nl-sub">Sign up to receive our special offers .</p>
            {/* Figma: Form — Input bg #2b2b2b h=54 rounded 30px, Button bg white border #000 h=50 rounded 30px */}
            <div className="ftr__nl-form">
              <input
                type="email"
                placeholder="Your E-mail"
                className="ftr__nl-input"
              />
              <button className="ftr__nl-btn">Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BORDER ── Figma: Section y=576 h=9, border-top #363636 5px, x=135 right=135 */}
      <div className="ftr__bottom-border-wrap">
        <div className="ftr__bottom-border" />
      </div>

      {/* ── COPYRIGHT ── Figma: Section y=585 h=108, bg #202020 */}
      <div className="ftr__copyright-bar">
        <div className="ftr__copyright-inner">
          {/* Figma: Instrument Sans Regular 16px, #a8a8a8 with white brand name, left=135 */}
          <p className="ftr__copyright">
            <span className="ftr__copyright--muted">Copyright © 2026 </span>
            <span className="ftr__copyright--white">BaYou Muscle</span>
            <span className="ftr__copyright--muted">. All rights reserved</span>
          </p>
          {/* Figma: payment card images, right=145, 5 cards w=43 h=28 gap=5 */}
          <div className="ftr__payments">
            <img src={imgVisa} alt="Visa" className="ftr__payment-card" />
            {/* <img src={imgMC} alt="Mastercard" className="ftr__payment-card" />
            <img src={imgAmex} alt="Amex" className="ftr__payment-card" />
            <img src={imgVisa} alt="Discover" className="ftr__payment-card" />
            <img src={imgMC} alt="Pay" className="ftr__payment-card" /> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
