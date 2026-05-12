import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Marquee from "../../components/Marquee";
import useWishlist from "../../hooks/useWishlist";
import "./MyWishlist.css";

export default function MyWishlist() {
  const navigate = useNavigate();
  const { wishlistItems: items, isLoading, error, loadWishlist, toggleWishlist, isProductPending } = useWishlist();

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const handleRemoveFromWishlist = async (productId) => {
    if (!productId || isProductPending(productId)) return;

    try {
      await toggleWishlist(productId);
      toast.success("Removed from wishlist.");
    } catch (err) {
      toast.error(err?.message || "Unable to remove from wishlist.");
    }
  };

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
              </div>
            )}
          </div>

          {isLoading && <p className="wl-header__sub">Loading wishlist...</p>}
          {!isLoading && error && <p className="wl-header__sub">{error}</p>}

          {/* Empty state */}
          {!isLoading && items.length === 0 ? (
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
                  key={item.wishlistId || item.id}
                  className={`wl-card${isProductPending(item.productId) ? " wl-card--removing" : ""}`}
                >
                  <button
                    className="wl-card__remove"
                    aria-label="Remove from wishlist"
                    onClick={() => handleRemoveFromWishlist(item.productId)}
                    disabled={isProductPending(item.productId)}
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
                    <img src={item.img || "/products/p1.png"} alt={item.name} loading="lazy" />
                    {item.quantity === 0 && (
                      <div className="wl-card__oos-overlay">Out of Stock</div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="wl-card__body">
                    <p className="wl-card__cat">Wishlist Item</p>
                    <p
                      className="wl-card__name"
                      onClick={() => navigate(`/product/${item.slug}`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && navigate(`/product/${item.slug}`)}
                    >
                      {item.name}
                    </p>

                    {!!item.summary && <p className="wl-header__sub">{item.summary}</p>}

                    <div className="wl-card__price-row">
                      <span className="wl-card__price">${Number(item.price || 0).toFixed(2)}</span>
                    </div>

                    <div className="wl-card__stock">
                      <span className={`wl-card__stock-dot${item.quantity === 0 ? " wl-card__stock-dot--oos" : ""}`} />
                      <span className={`wl-card__stock-text${item.quantity === 0 ? " wl-card__stock-text--oos" : ""}`}>
                        {item.quantity === 0 ? "Out of Stock" : "In Stock"}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="wl-card__footer">
                    <button
                      className="wl-card__cart-btn"
                      disabled={item.quantity === 0}
                      onClick={() => navigate(`/product/${item.slug}`)}
                    >
                      {item.quantity === 0 ? "Notify Me" : "Add to Cart"}
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
