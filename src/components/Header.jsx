import { useState } from 'react';

const imgLogoVector  = '/images/logo.png';
const imgLogoVector1 = 'https://www.figma.com/api/mcp/asset/8ca15b68-2ac7-479c-a975-997586d3cace';
const imgSearchIcon  = 'https://www.figma.com/api/mcp/asset/36767264-37ef-40ad-8632-02015c05df00';
const imgLangFlag    = '/supplements/profile.png';
const imgAccountIcon = '/supplements/heart.png';
const imgCartIcon    = '/supplements/bag.png';
const imgCheckIcon   = 'https://www.figma.com/api/mcp/asset/2ce67e3d-0985-403d-a018-c7b1f1f09d6c';
const imgGiftIcon    = 'https://www.figma.com/api/mcp/asset/ea8db535-cd38-4a8b-80cf-1f8cb8363ee5';
const imgPayIcon     = 'https://www.figma.com/api/mcp/asset/73bddb70-03d1-4986-8b3b-ade849c76243';

const topbarItems = [
  { text: 'Free UK standard delivery on orders over $100', icon: imgCheckIcon },
  { text: 'Free gift when you spend over $150',            icon: imgGiftIcon  },
  { text: 'All payments accepted',                         icon: imgPayIcon   },
];
const marqueeItems = [...topbarItems, ...topbarItems, ...topbarItems];

/* ─── Desktop nav links ─── */
const NAV_LINKS = [
  { label: 'Supplements', page: 'supplements' },
  { label: 'Merchandise', page: 'Merchandise' },
  { label: 'ProductDetail',       page: 'ProductDetail'     },
  { label: 'Contact',     page: 'contact'     },
];

/* ─── Mobile drawer links ─── */
const MOBILE_LINKS = [
  { label: 'Home',         page: 'home'        },
  { label: 'Supplements',  page: 'supplements' },
  { label: 'Blog',         page: 'blog'        },
  { label: 'Contact',      page: 'contact'     },
  { label: 'Cart',         page: 'cart'        },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount]  = useState(0);

  /* ─── Navigate helper ─── */
  const go = (page, e) => {
    if (e) e.preventDefault();
    setMobileOpen(false);
    /* window.__navigate comes from App.jsx */
    if (window.__navigate) window.__navigate(page);
  };

  return (
    <header className="hdr">

      {/* ── TOP BAR ── */}
      <div className="hdr__topbar">
        <div className="hdr__topbar-track">
          <div className="hdr__topbar-inner">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="hdr__topbar-item">
                <img src={item.icon} alt="" className="hdr__topbar-icon" />
                <span className="hdr__topbar-text">{item.text}</span>
                <span className="hdr__topbar-dot" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN NAV ── */}
      <div className="hdr__main">
        <div className="hdr__main-inner">

          {/* Desktop nav */}
          <nav className="hdr__nav">
            {NAV_LINKS.map(({ label, page }) => (
              <a
                key={page}
                href={'/' + page}
                className="hdr__nav-link"
                onClick={e => go(page, e)}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Logo */}
          <a href="/home" className="hdr__logo" onClick={e => go('home', e)}>
            <div className="hdr__logo-img">
              <img src={imgLogoVector}  alt="Bayou Muscle" className="hdr__logo-vec hdr__logo-vec--main" />
              {/* <img src={imgLogoVector1} alt=""              className="hdr__logo-vec hdr__logo-vec--sub"  /> */}
            </div>
          </a>

          {/* Right controls */}
          <div className="hdr__controls">

            {/* Search */}
            <div className="hdr__search">
              <input
                type="text"
                placeholder="Search our catalog"
                className="hdr__search-input"
                aria-label="Search"
              />
              <button className="hdr__search-btn" aria-label="Search">
                <img src={imgSearchIcon} alt="" className="hdr__search-icon" />
              </button>
            </div>

            {/* Language */}
            <div className="hdr__lang">
              <img src={imgLangFlag} alt="Language" className="hdr__lang-flag" />
            </div>

            {/* Account */}
            <button
              className="hdr__icon-btn"
              aria-label="Account"
              onClick={e => go('contact', e)}
            >
              <img src={imgAccountIcon} alt="" className="hdr__icon-img" />
            </button>

            {/* Cart */}
            <button
              className="hdr__cart-btn"
              aria-label="Cart"
              onClick={e => go('cart', e)}
            >
              <img src={imgCartIcon} alt="" className="hdr__cart-icon" />
              <span className="hdr__cart-badge">{cartCount}</span>
            </button>

            {/* Hamburger */}
            <button
              className="hdr__hamburger"
              aria-label="Menu"
              onClick={() => setMobileOpen(v => !v)}
            >
              <span className={`hdr__ham-line${mobileOpen ? ' is-open' : ''}`} />
              <span className={`hdr__ham-line${mobileOpen ? ' is-open' : ''}`} />
              <span className={`hdr__ham-line${mobileOpen ? ' is-open' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE DRAWER ── */}
      {mobileOpen && (
        <div className="hdr__drawer-overlay" onClick={() => setMobileOpen(false)}>
          <nav className="hdr__drawer" onClick={e => e.stopPropagation()}>
            <div className="hdr__drawer-head">
              <span className="hdr__drawer-logo">
                BAYOU <span>MUSCLE</span>
              </span>
              <button
                className="hdr__drawer-close"
                onClick={() => setMobileOpen(false)}
              >✕</button>
            </div>
            {MOBILE_LINKS.map(({ label, page }) => (
              <a
                key={page}
                href={'/' + page}
                className="hdr__drawer-link"
                onClick={e => go(page, e)}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      )}

    </header>
  );
}
