import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const allProducts = [
  { id: 1, name: 'CPT: Conjugated Linoleic Acid Supplement', category: 'Weight Management', price: '$9.00', reviews: '(4.1)', stars: 4, badge: null, img: 'https://images.unsplash.com/photo-1595348020949-87cdfbb44174?w=400&q=80' },
  { id: 2, name: 'Denzour Micronised Creatine 100g', category: 'Performance', price: '$9.95', reviews: '(3.8)', stars: 4, badge: null, img: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400&q=80' },
  { id: 3, name: 'ISOCOOL Cold Filtered Protein Isolate', category: 'Protein', price: '$29.00', oldPrice: '$31.60', reviews: '(4.7)', stars: 5, badge: '-8%', img: 'https://images.unsplash.com/photo-1609016041736-0d4413fa1b63?w=400&q=80' },
  { id: 4, name: 'L-Carnitine: An Amino Acid Supplement for Athletes', category: 'Amino Acids', price: '$9.00', reviews: '(4.2)', stars: 4, badge: null, img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80' },
  { id: 5, name: 'Ultra Ripped: A Thermogenic Fat Burner', category: 'Weight Management', price: '$11.90', reviews: '(4.5)', stars: 5, badge: null, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
  { id: 6, name: 'CLA: Conjugated Linoleic Acid Supplement', category: 'Weight Management', price: '$10.12', oldPrice: '$11.90', reviews: '(4.3)', stars: 4, badge: '-15%', img: 'https://images.unsplash.com/photo-1601465873862-4f6614d62e48?w=400&q=80' },
  { id: 7, name: 'Whey Protein Gold Standard 2lb', category: 'Protein', price: '$34.99', reviews: '(4.8)', stars: 5, badge: null, img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80' },
  { id: 8, name: 'Pre-Workout Energy Blast', category: 'Performance', price: '$24.99', reviews: '(4.4)', stars: 4, badge: 'NEW', img: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&q=80' },
  { id: 9, name: 'BCAA Recovery Complex', category: 'Amino Acids', price: '$19.99', reviews: '(4.6)', stars: 5, badge: null, img: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&q=80' },
  { id: 10, name: 'ZMA Sleep & Recovery', category: 'Vitamins', price: '$14.99', reviews: '(4.2)', stars: 4, badge: null, img: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&q=80' },
  { id: 11, name: 'Creatine Monohydrate Pure 500g', category: 'Performance', price: '$16.95', reviews: '(4.7)', stars: 5, badge: null, img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80' },
  { id: 12, name: 'Vitamin D3 + K2 Complex', category: 'Vitamins', price: '$12.99', reviews: '(4.5)', stars: 5, badge: null, img: 'https://images.unsplash.com/photo-1507398941214-572c25a4a232?w=400&q=80' },
];

const categories = ['All', 'Protein', 'Performance', 'Weight Management', 'Amino Acids', 'Vitamins'];

const reviews = [
  { name: 'Derrick W.', title: 'Great Service', date: '13 Aug 2024', text: 'Great service, great products and well priced. Only quality supplements and has such a great range. Everything in one place.', stars: 5 },
  { name: 'Bill S.', title: 'Feel The Burn!', date: '13 Aug 2024', text: "The energy level was intense without jitters. I haven't felt the tingles in a while from using pre but this definitely gave me all I needed for my workout.", stars: 5 },
  { name: 'Keith D.', title: 'Awesome Preworkout', date: '13 Aug 2024', text: 'The flavor is great, not sweet, and not bland. The flavor is there. It does make me a bit itchy but definitely helps with keeping me busy and focused.', stars: 5 },
  { name: 'Randy J.', title: 'Groovy!', date: '13 Aug 2024', text: 'Overall experience was nothing shy of great! Super clean long lasting energy, great focus, and filthy pumps! 👌', stars: 5 },
];

const whyChooseUs = [
  { icon: '🧬', title: 'Nutrition Experts', desc: 'Our formulations are developed with qualified nutritionists and sports scientists for maximum effectiveness.' },
  { icon: '⚗️', title: 'Unique Formulation', desc: 'Proprietary blends crafted from premium ingredients, tested for purity and potency at every stage.' },
  { icon: '🏆', title: 'Heritage of Quality', desc: 'Over 15 years delivering trusted supplements to athletes worldwide with consistent results.' },
  { icon: '🔬', title: 'Truth in Labeling', desc: 'Complete transparency — every ingredient listed, no proprietary blends hiding ineffective doses.' },
];

function Stars({ count = 5 }) {
  return (
    <div className="product-stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`star${i >= count ? ' half' : ''}`}>★</span>
      ))}
    </div>
  );
}

function ProductCard({ product }) {
  return (
    <div className="product-card">
      {product.badge && <span className="product-badge">{product.badge}</span>}
      <div className="product-card-img">
        <img src={product.img} alt={product.name} loading="lazy" />
      </div>
      <p className="product-category">{product.category}</p>
      <p className="product-name"><a href="#">{product.name}</a></p>
      <div className="product-footer">
        <div>
          <Stars count={product.stars} />
          {product.reviews && <span className="review-count">{product.reviews}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span className="product-price">{product.price}</span>
          {product.oldPrice && <span className="product-price-old">{product.oldPrice}</span>}
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  const filtered = activeCategory === 'All'
    ? allProducts
    : allProducts.filter(p => p.category === activeCategory);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''));
    if (sortBy === 'price-desc') return parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', ''));
    if (sortBy === 'rating') return b.stars - a.stars;
    return 0;
  });

  return (
    <>
      <Header />

      {/* Page Hero */}
      <section className="shop-hero">
        <div className="shop-hero-bg" />
        <div className="shop-hero-content">
          <p className="section-subheading">Our Products</p>
          <h1 className="shop-hero-title">Supplements</h1>
          <p className="shop-hero-breadcrumb">
            <a href="#">Home</a> / <span>Supplements</span>
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="shop-filter-bar">
        <div className="shop-filter-cats">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-cat-btn${activeCategory === cat ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="shop-filter-right">
          <span className="filter-count">{sorted.length} products</span>
          <div className="shop-sort">
            <label>Sort by:</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="sort-select">
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <section className="shop-grid-section">
        <div className="shop-layout">
          {/* Sidebar */}
          <aside className="shop-sidebar">
            <div className="sidebar-widget">
              <h4 className="sidebar-title">Categories</h4>
              <ul className="sidebar-cats">
                {categories.map(cat => (
                  <li key={cat}>
                    <button
                      className={`sidebar-cat-link${activeCategory === cat ? ' active' : ''}`}
                      onClick={() => setActiveCategory(cat)}
                    >
                      {cat}
                      <span className="cat-count">
                        ({cat === 'All' ? allProducts.length : allProducts.filter(p => p.category === cat).length})
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sidebar-widget">
              <h4 className="sidebar-title">Price Range</h4>
              <div className="price-range-slider">
                <div className="price-range-track">
                  <div className="price-range-fill" />
                </div>
                <div className="price-range-labels">
                  <span>$0</span>
                  <span>$50</span>
                </div>
              </div>
            </div>

            <div className="sidebar-widget">
              <h4 className="sidebar-title">Rating</h4>
              <ul className="rating-filter-list">
                {[5, 4, 3].map(r => (
                  <li key={r} className="rating-filter-item">
                    <label className="rating-filter-label">
                      <input type="checkbox" defaultChecked={r === 5} />
                      <span className="rf-stars">{'★'.repeat(r)}{'☆'.repeat(5 - r)}</span>
                      <span className="rf-text">& Up</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sidebar-promo">
              <p className="sidebar-promo-tag">Special Offer</p>
              <h3 className="sidebar-promo-title">Get 10% Off Your First Order</h3>
              <p className="sidebar-promo-sub">Use code: FIRST10</p>
              <a href="#" className="sidebar-promo-btn">Shop Now</a>
            </div>
          </aside>

          {/* Products */}
          <div className="shop-products">
            {sorted.length === 0 ? (
              <div className="no-products">No products found in this category.</div>
            ) : (
              <div className="shop-product-grid">
                {sorted.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}

            {/* Pagination */}
            <div className="shop-pagination">
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <button className="page-btn page-next">Next →</button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <div className="reviews-inner">
          <h2 className="section-heading" style={{ marginBottom: '8px' }}>Featured Reviews</h2>
          <p style={{ color: 'var(--color-gray-mid)', fontSize: '14px', marginBottom: '48px' }}>
            What our customers say about our products
          </p>
          <div className="reviews-grid">
            {reviews.map((r, i) => (
              <div key={i} className="review-card">
                <div className="review-header">
                  <Stars count={r.stars} />
                  <span className="review-date">{r.date}</span>
                </div>
                <h4 className="review-title">{r.title}</h4>
                <p className="review-text">{r.text}</p>
                <div className="review-author">
                  <div className="review-avatar">{r.name[0]}</div>
                  <span className="review-name">{r.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-section">
        <div className="why-inner">
          <div className="why-image">
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"
              alt="Why Choose Us"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
            />
          </div>
          <div className="why-content">
            <p className="section-subheading">Our Standards</p>
            <h2 className="section-heading" style={{ marginBottom: '40px' }}>Why Choose Us</h2>
            <div className="why-grid">
              {whyChooseUs.map((item, i) => (
                <div key={i} className="why-item">
                  <div className="why-icon">{item.icon}</div>
                  <div>
                    <h4 className="why-title">{item.title}</h4>
                    <p className="why-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="why-cta">
              <p className="why-cta-text">
                Find a product to meet your performance and training goals.
              </p>
              <a href="#" className="hero-btn" style={{ marginTop: 0 }}>Get Started</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
