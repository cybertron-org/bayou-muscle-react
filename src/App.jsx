import { useState, useEffect } from 'react';
import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home        from './pages/Home';
import Supplements from './pages/Supplements/Supplements';
import Shop        from './pages/Shop';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Contact     from './pages/Contact';
import Cart        from './pages/Cart';
import Blog        from './pages/Blog';
import About        from './pages/About/About';
import Merchandise from './pages/Merchandise/Merchandise';

/* ─────────────────────────────────────────────
   Saari valid routes ek jagah
───────────────────────────────────────────── */
const ROUTES = {
  home:          (nav) => <Home />,
  about:         (nav) => <About />,
  supplements:   (nav) => <Supplements />,
  shop:          (nav) => <Shop />,
  merchandise:   (nav) => <Merchandise />,
  product:       (nav) => <ProductDetail onNavigate={nav} productId={window.__productId} />,
  productdetail: (nav) => <ProductDetail onNavigate={nav} productId={window.__productId} />,
  contact:       (nav) => <Contact />,
  cart:          (nav) => <Cart onNavigate={nav} initialView="cart" />,
  checkout:      (nav) => <Cart onNavigate={nav} initialView="checkout" />,
  blog:          (nav) => <Blog onNavigate={nav} />,
};

/* Route name nikalna pathname se — e.g. "/supplements" → "supplements" */
function getPageFromPath() {
  const pathname = window.location.pathname;
  if (!pathname || pathname === '/') return 'home';
  const parts = pathname.replace(/^\//, '').split('/');
  const page = parts[0].toLowerCase().trim();
  const param = parts[1]; // product ID ya slug
  
  // Product ke liye param store karo
  if (page === 'product' && param) {
    window.__productId = param;
  }
  
  return ROUTES[page] ? page : 'home';
}

export default function App() {
  const [page, setPage] = useState(getPageFromPath);

  /* ── navigate function ── */
  const navigate = (pageName, productId = null) => {
    const target = ROUTES[pageName] ? pageName : 'home';
    setPage(target);
    
    let url = '/' + target;
    if (target === 'product' && productId) {
      url = '/' + target + '/' + productId;
      window.__productId = productId;
    }
    
    window.history.pushState(null, '', url);   // URL mein clean path dikhega
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ── global shortcut (window.__navigate) ── */
  window.__navigate = navigate;

  /* ── Browser back/forward button support ── */
  useEffect(() => {
    const onPopState = () => {
      setPage(getPageFromPath());
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const PageComponent = ROUTES[page] ? ROUTES[page](navigate) : <Home />;
  return PageComponent;
}
