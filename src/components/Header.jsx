import { useState, useEffect } from 'react';
import CartDrawer from '../pages/CartDrawer/CartDrawer';

const imgLogoVector  = '/images/logo.png';
const imgSearchIcon  = 'https://www.figma.com/api/mcp/asset/36767264-37ef-40ad-8632-02015c05df00';
const imgLangFlag    = '/supplements/profile.png';
const imgAccountIcon = '/supplements/heart.png';
const imgCartIcon    = '/supplements/bag.png';
const imgCheckIcon   = '/supplements/ticon.png';
const imgGiftIcon    = '/supplements/gifticon.png';
const imgPayIcon     = '/supplements/payicon.png';

const topbarItems = [
  { text: 'Free UK standard delivery on orders over $100', icon: imgCheckIcon },
  { text: 'Free gift when you spend over $150',            icon: imgGiftIcon  },
  { text: 'All payments accepted',                         icon: imgPayIcon   },
];
const marqueeItems = [...topbarItems, ...topbarItems, ...topbarItems];

const NAV_LINKS = [
  { label: 'Supplements', page: 'supplements' },
  { label: 'Merchandise', page: 'merchandise' },
  { label: 'About',       page: 'about'        },
  { label: 'Contact',     page: 'contact'      },
];

const MOBILE_LINKS = [
  { label: 'Home',        page: 'home'        },
  { label: 'Supplements', page: 'supplements' },
  { label: 'Blog',        page: 'blog'        },
  { label: 'Contact',     page: 'contact'     },
  { label: 'Cart',        page: 'cart'        },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount]  = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  // Listen for route changes
  useEffect(() => {
    // Get current page from URL
    const path = window.location.pathname.replace('/', '') || 'home';
    setCurrentPage(path);
    
    // Listen for popstate (back/forward buttons)
    const handlePopState = () => {
      const newPath = window.location.pathname.replace('/', '') || 'home';
      setCurrentPage(newPath);
    };
    
    window.addEventListener('popstate', handlePopState);
    
    // Cleanup
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const go = (page, e) => {
    if (e) e.preventDefault();
    setCurrentPage(page);
    setMobileOpen(false);
    if (window.__navigate) window.__navigate(page);
  };

  return (
    <header className="hdr">

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

      <div className="hdr__main">
        <div className="hdr__main-inner">

          <nav className="hdr__nav">
            {NAV_LINKS.map(({ label, page }) => (
              <a
                key={page}
                href={'/' + page}
                className={`hdr__nav-link ${currentPage === page ? 'active' : ''}`}
                onClick={e => go(page, e)}
              >
                {label}
              </a>
            ))}
          </nav>

          <a href="/home" className="hdr__logo" onClick={e => go('home', e)}>
            <div className="hdr__logo-img">
              <img src={imgLogoVector} alt="Bayou Muscle" className="hdr__logo-vec hdr__logo-vec--main" />
            </div>
          </a>

          <div className="hdr__controls">

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

            <div className="hdr__lang">
              <img src={imgLangFlag} alt="Language" className="hdr__lang-flag" />
            </div>

            <button
              className="hdr__icon-btn"
              aria-label="Account"
              onClick={e => go('contact', e)}
            >
              <img src={imgAccountIcon} alt="" className="hdr__icon-img" />
            </button>

            <button
              className="hdr__cart-btn"
              aria-label="Cart"
              onClick={() => setCartOpen(true)}
            >
              <img src={imgCartIcon} alt="" className="hdr__cart-icon" />
              <span className="hdr__cart-badge">{cartCount}</span>
            </button>

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
                className={`hdr__drawer-link ${currentPage === page ? 'active' : ''}`}
                onClick={e => go(page, e)}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      )}

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

    </header>
  );
}