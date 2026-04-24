import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Marquee from "../../components/Marquee";
import "./MyWishlist.css";

const DUMMY_WISHLIST = [
  {
    id: 1,
    slug: "isocool-protein-isolate",
    name: "ISOCOOL Cold Filtered Protein Isolate",
    cat: "Protein",
    price: 89.0,
    oldPrice: 109.0,
    badge: "-18%",
    img: "/products/p1.png",
    inStock: true,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    slug: "horse-power-x",
    name: "HORSE POWER X Pre-Workout",
    cat: "Performance",
    price: 144.99,
    oldPrice: null,
    badge: null,
    img: "/products/horse-power.png",
    inStock: true,
    rating: 4.6,
    reviews: 87,
  },
  {
    id: 3,
    slug: "muscleblaze-bcaa-gold",
    name: "MuscleBlaze BCAA Gold",
    cat: "Health Support",
    price: 310.39,
    oldPrice: 349.0,
    badge: "-11%",
    img: "/products/muscleblaze.png",
    inStock: false,
    rating: 4.5,
    reviews: 56,
  },
  {
    id: 4,
    slug: "nutrex-hmb-1000",
    name: "Nutrex HMB 1000 Capsules",
    cat: "Health Support",
    price: 293.84,
    oldPrice: null,
    badge: null,
    img: "/products/nutrex.png",
    inStock: true,
    rating: 4.3,
    reviews: 39,
  },
  {
    id: 5,
    slug: "performance-stack",
    name: "Performance Endurance Stack",
    cat: "Performance",
    price: 199.0,
    oldPrice: 240.0,
    badge: "-17%",
    img: "/products/performance.png",
    inStock: true,
    rating: 4.9,
    reviews: 201,
  },
  {
    id: 6,
    slug: "quality-whey-protein",
    name: "Quality Whey Protein 5lb",
    cat: "Protein",
    price: 74.95,
    oldPrice: null,
    badge: null,
    img: "/products/quality.png",
    inStock: false,
    rating: 4.7,
    reviews: 312,
  },
];

function StarDisplay({ rating }) {
  return (
    <span className="wl-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={`wl-star${rating >= s ? " wl-star--on" : rating >= s - 0.5 ? " wl-star--half" : ""}`}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export default function MyWishlist() {
  const navigate = useNavigate();
  const [items, setItems] = useState(DUMMY_WISHLIST);
  const [removingId, setRemovingId] = useState(null);

  const removeItem = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
      setRemovingId(null);
    }, 300);
  };

  const clearAll = () => setItems([]);

  return (
    <>
      <Header />

      <div className="wl-page">
        {/* Breadcrumb */}
        <div className="pd-breadcrumb">
          <div className="pd-breadcrumb__inner">
            <span className="pd-bc-link" onClick={() => navigate("/home")}>Home Page</span>
            <span className="pd-bc-sep" />
            <span className="pd-bc-link" onClick={() => navigate("/profile")}>My Account</span>
            <span className="pd-bc-sep" />
            <span className="pd-bc-current">Wishlist</span>
          </div>
        </div>

        <div className="wl-container">
          {/* Page header */}
          <div className="wl-header">
            <div className="wl-header__left">
              <p className="wl-header__eyebrow">My Account</p>
              <h1 className="wl-header__title">
                My <span className="wl-header__title--muted">Wishlist</span>
              </h1>
              <p className="wl-header__sub">
                {items.length > 0
                  ? `${items.length} saved item${items.length !== 1 ? "s" : ""} — ready when you are.`
                  : "Your wishlist is empty."}
              </p>
            </div>
            {items.length > 0 && (
              <div className="wl-header__actions">
                <button className="wl-btn wl-btn--outline" onClick={() => navigate("/supplements")}>
                  Continue Shopping
                </button>
                <button className="wl-btn wl-btn--ghost" onClick={clearAll}>
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Empty state */}
          {items.length === 0 ? (
            <div className="wl-empty">
              <div className="wl-empty__icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 21S3 13.5 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.5-9 13-9 13z"
                    stroke="#e9e9e9"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="wl-empty__title">Nothing saved yet</h3>
              <p className="wl-empty__text">
                Browse our supplements and hit the heart icon to save products here.
              </p>
              <button className="wl-btn wl-btn--solid" onClick={() => navigate("/supplements")}>
                Shop Now
              </button>
            </div>
          ) : (
            <div className="wl-grid">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`wl-card${removingId === item.id ? " wl-card--removing" : ""}`}
                >
                  {/* Badge */}
                  {item.badge && <span className="wl-card__badge">{item.badge}</span>}

                  {/* Remove button */}
                  <button
                    className="wl-card__remove"
                    aria-label="Remove from wishlist"
                    onClick={() => removeItem(item.id)}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>

                  {/* Image */}
                  <div
                    className="wl-card__img"
                    onClick={() => navigate(`/product/${item.slug}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && navigate(`/product/${item.slug}`)}
                  >
                    <img src={item.img} alt={item.name} loading="lazy" />
                    {!item.inStock && (
                      <div className="wl-card__oos-overlay">Out of Stock</div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="wl-card__body">
                    <p className="wl-card__cat">{item.cat}</p>
                    <p
                      className="wl-card__name"
                      onClick={() => navigate(`/product/${item.slug}`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && navigate(`/product/${item.slug}`)}
                    >
                      {item.name}
                    </p>

                    <div className="wl-card__rating">
                      <StarDisplay rating={item.rating} />
                      <span className="wl-card__rating-val">{item.rating}</span>
                      <span className="wl-card__rating-count">({item.reviews})</span>
                    </div>

                    <div className="wl-card__price-row">
                      <span className="wl-card__price">${item.price.toFixed(2)}</span>
                      {item.oldPrice && (
                        <span className="wl-card__old-price">${item.oldPrice.toFixed(2)}</span>
                      )}
                    </div>

                    <div className="wl-card__stock">
                      <span className={`wl-card__stock-dot${item.inStock ? "" : " wl-card__stock-dot--oos"}`} />
                      <span className={`wl-card__stock-text${item.inStock ? "" : " wl-card__stock-text--oos"}`}>
                        {item.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="wl-card__footer">
                    <button
                      className="wl-card__cart-btn"
                      disabled={!item.inStock}
                      onClick={() => navigate(`/product/${item.slug}`)}
                    >
                      {item.inStock ? "Add to Cart" : "Notify Me"}
                    </button>
                    <button
                      className="wl-card__view-btn"
                      onClick={() => navigate(`/product/${item.slug}`)}
                      aria-label="View product"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Marquee />
      </div>

      <Footer />
    </>
  );
}
