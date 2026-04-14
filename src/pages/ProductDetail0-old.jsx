import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Posts from "../components/Posts";
import Marquee from "../components/Marquee";


const product = {
  id: 3,
  name: "ISOCOOL Cold Filtered Protein Isolate",
  category: "Protein",
  price: 29.0,
  oldPrice: 31.6,
  badge: "-8%",
  stars: 5,
  reviewCount: 247,
  sku: "ISO-CFP-001",
  img: "https://images.unsplash.com/photo-1609016041736-0d4413fa1b63?w=800&q=80",
  thumbs: [
    "https://images.unsplash.com/photo-1609016041736-0d4413fa1b63?w=200&q=80",
    "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=200&q=80",
    "https://images.unsplash.com/photo-1595348020949-87cdfbb44174?w=200&q=80",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&q=80",
  ],
  description: `ISOCOOL Cold Filtered Protein Isolate delivers 27g of ultra-pure whey protein isolate per serving. Using our exclusive cold filtration process, we preserve the natural bioactive fractions that make whey protein so effective for muscle recovery and growth.`,
  features: [
    "27g Pure Whey Protein Isolate per serving",
    "Cold Filtered — no heat damage to protein integrity",
    "Less than 1g fat, 0g sugar per serving",
    "Instantised for smooth, easy mixing",
    "Available in 5 delicious flavours",
  ],
  flavours: [
    "Chocolate Fudge",
    "Vanilla Ice Cream",
    "Strawberry",
    "Salted Caramel",
    "Unflavoured",
  ],
  sizes: ["500g (17 servings)", "1kg (34 servings)", "2kg (68 servings)"],
  tabs: ["Description", "Nutrition", "Reviews"],
  nutrition: [
    { label: "Serving Size", value: "30g" },
    { label: "Protein", value: "27g" },
    { label: "Carbohydrates", value: "1.8g" },
    { label: "Fat", value: "0.5g" },
    { label: "Sugar", value: "< 0.5g" },
    { label: "Sodium", value: "120mg" },
    { label: "Calories", value: "118kcal" },
  ],
};

const relatedProducts = [
  {
    id: 1,
    name: "CPT: Conjugated Linoleic Acid Supplement",
    price: "$9.00",
    stars: 4,
    img: "https://images.unsplash.com/photo-1595348020949-87cdfbb44174?w=400&q=80",
    category: "Weight Management",
  },
  {
    id: 2,
    name: "Denzour Micronised Creatine 100g",
    price: "$9.95",
    stars: 4,
    img: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400&q=80",
    category: "Performance",
  },
  {
    id: 4,
    name: "L-Carnitine: Amino Acid Supplement",
    price: "$9.00",
    stars: 4,
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
    category: "Amino Acids",
  },
  {
    id: 5,
    name: "Ultra Ripped: Thermogenic Fat Burner",
    price: "$11.90",
    stars: 5,
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    category: "Weight Management",
  },
];

const reviews = [
  {
    name: "Sarah M.",
    date: "March 2025",
    rating: 5,
    title: "Best protein I've tried",
    text: "Mixes perfectly with no clumps, tastes amazing and I've noticed real improvements in my recovery time. Will definitely re-order.",
  },
  {
    name: "James K.",
    date: "February 2025",
    rating: 5,
    title: "Clean and effective",
    text: "I'm picky about macros and this hits the mark. Low fat, low carb, high protein. The chocolate flavour is indulgent without being too sweet.",
  },
  {
    name: "Priya T.",
    date: "January 2025",
    rating: 4,
    title: "Great quality protein",
    text: "Really impressed with the quality. Slightly pricey but you get what you pay for. Packaging is sturdy and the scoop is proper-sized.",
  },
];

function Stars({ count = 5, size = 14 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          style={{
            color: i < count ? "var(--color-primary)" : "#ddd",
            fontSize: size,
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function ProductDetail({ onNavigate, productId }) {
  const [activeThumb, setActiveThumb] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedFlavour, setSelectedFlavour] = useState(0);
  const [selectedSize, setSelectedSize] = useState(1);
  const [activeTab, setActiveTab] = useState("Description");
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <>
      <Header />

      {/* Breadcrumb */}
      <div className="pd-breadcrumb">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("home");
          }}
        >
          Home
        </a>
        <span className="pd-bc-sep">›</span>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("shop");
          }}
        >
          Supplements
        </a>
        <span className="pd-bc-sep">›</span>
        <span>{product.name}</span>
      </div>

      {/* Main Product Section */}
      <section className="pd-main">
        {/* Gallery */}
        <div className="pd-gallery">
          <div className="pd-thumbs">
            {product.thumbs.map((t, i) => (
              <button
                key={i}
                className={`pd-thumb${activeThumb === i ? " active" : ""}`}
                onClick={() => setActiveThumb(i)}
              >
                <img src={t} alt={`View ${i + 1}`} />
              </button>
            ))}
          </div>
          <div className="pd-main-img">
            {product.badge && (
              <span className="product-badge pd-badge">{product.badge}</span>
            )}
            <img
              src={product.thumbs[activeThumb].replace("w=200", "w=800")}
              alt={product.name}
            />
          </div>
        </div>

        {/* Info */}
        <div className="pd-info">
          <p className="pd-category-tag">{product.category}</p>
          <h1 className="pd-title">{product.name}</h1>

          <div className="pd-meta-row">
            <Stars count={product.stars} size={16} />
            <span className="pd-review-count">
              {product.reviewCount} reviews
            </span>
            <span className="pd-sku">SKU: {product.sku}</span>
          </div>

          <div className="pd-price-row">
            <span className="pd-price">${product.price.toFixed(2)}</span>
            {product.oldPrice && (
              <span className="pd-old-price">
                ${product.oldPrice.toFixed(2)}
              </span>
            )}
            {product.badge && (
              <span className="pd-save-badge">Save {product.badge}</span>
            )}
          </div>

          <p className="pd-description">{product.description}</p>

          {/* Flavour selector */}
          <div className="pd-option-group">
            <p className="pd-option-label">
              Flavour: <strong>{product.flavours[selectedFlavour]}</strong>
            </p>
            <div className="pd-option-pills">
              {product.flavours.map((f, i) => (
                <button
                  key={i}
                  className={`pd-pill${selectedFlavour === i ? " active" : ""}`}
                  onClick={() => setSelectedFlavour(i)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Size selector */}
          <div className="pd-option-group">
            <p className="pd-option-label">
              Size: <strong>{product.sizes[selectedSize]}</strong>
            </p>
            <div className="pd-option-pills">
              {product.sizes.map((s, i) => (
                <button
                  key={i}
                  className={`pd-pill${selectedSize === i ? " active" : ""}`}
                  onClick={() => setSelectedSize(i)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Qty + Add to Cart */}
          <div className="pd-cart-row">
            <div className="pd-qty-control">
              <button
                className="pd-qty-btn"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="pd-qty-val">{qty}</span>
              <button
                className="pd-qty-btn"
                onClick={() => setQty((q) => q + 1)}
              >
                +
              </button>
            </div>
            <button
              className={`pd-add-btn${addedToCart ? " added" : ""}`}
              onClick={handleAddToCart}
            >
              {addedToCart ? "✓ Added to Cart" : "Add to Cart"}
            </button>
          </div>

          {/* Buy Now */}
          <button className="pd-buy-btn">
            Buy Now — ${(product.price * qty).toFixed(2)}
          </button>

          {/* Features list */}
          <ul className="pd-features">
            {product.features.map((f, i) => (
              <li key={i} className="pd-feature-item">
                <span className="pd-feature-check">✓</span>
                {f}
              </li>
            ))}
          </ul>

          {/* Trust */}
          <div className="pd-trust-strip">
            {[
              { icon: "🚚", text: "Free delivery over $100" },
              { icon: "↩", text: "30-day returns" },
              { icon: "🔒", text: "Secure checkout" },
            ].map((t, i) => (
              <div key={i} className="pd-trust-item">
                <span>{t.icon}</span>
                <span>{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="pd-tabs-section">
        <div className="pd-tabs-bar">
          {product.tabs.map((tab) => (
            <button
              key={tab}
              className={`pd-tab-btn${activeTab === tab ? " active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab} {tab === "Reviews" && `(${reviews.length})`}
            </button>
          ))}
        </div>

        <div className="pd-tab-content">
          {activeTab === "Description" && (
            <div className="pd-tab-desc">
              <div className="pd-tab-desc-text">
                <h3>Product Description</h3>
                <p>{product.description}</p>
                <p>
                  Our cold-filtration technology removes lactose, fat and
                  denatured proteins while retaining the native protein
                  structure. The result is a cleaner, purer protein that your
                  body can absorb rapidly post-workout.
                </p>
                <h4>Directions</h4>
                <p>
                  Mix 1 scoop (30g) with 250-300ml cold water or milk. Consume
                  within 30 minutes of training. Can also be used as a
                  high-protein snack between meals.
                </p>
                <h4>Allergen Information</h4>
                <p>
                  Contains milk (whey). Manufactured in a facility that also
                  processes soy, eggs, and tree nuts. Suitable for vegetarians.
                  Not suitable for vegans.
                </p>
              </div>
              <div className="pd-tab-desc-img">
                <img
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80"
                  alt="Protein supplement in use"
                />
              </div>
            </div>
          )}

          {activeTab === "Nutrition" && (
            <div className="pd-tab-nutrition">
              <h3>Nutritional Information</h3>
              <p className="pd-nutrition-sub">Per 30g serving (1 scoop)</p>
              <table className="nutrition-table">
                <thead>
                  <tr>
                    <th>Nutrient</th>
                    <th>Per Serving</th>
                    <th>% Daily Value*</th>
                  </tr>
                </thead>
                <tbody>
                  {product.nutrition.map((n, i) => (
                    <tr key={i}>
                      <td>{n.label}</td>
                      <td>{n.value}</td>
                      <td>—</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="pd-nutrition-note">
                *Percent Daily Values are based on a 2,000 calorie diet.
              </p>
            </div>
          )}

          {activeTab === "Reviews" && (
            <div className="pd-tab-reviews">
              <div className="pd-reviews-summary">
                <div className="pd-reviews-score">
                  <span className="pd-score-num">{product.stars}.0</span>
                  <Stars count={product.stars} size={22} />
                  <span className="pd-score-sub">
                    {product.reviewCount} verified reviews
                  </span>
                </div>
                <div className="pd-reviews-bars">
                  {[5, 4, 3, 2, 1].map((n) => (
                    <div key={n} className="pd-rating-bar-row">
                      <span className="pd-bar-label">{n}★</span>
                      <div className="pd-rating-bar">
                        <div
                          className="pd-rating-fill"
                          style={{
                            width:
                              n === 5
                                ? "72%"
                                : n === 4
                                  ? "20%"
                                  : n === 3
                                    ? "6%"
                                    : "2%",
                          }}
                        />
                      </div>
                      <span className="pd-bar-pct">
                        {n === 5
                          ? "72%"
                          : n === 4
                            ? "20%"
                            : n === 3
                              ? "6%"
                              : n === 2
                                ? "1%"
                                : "1%"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pd-reviews-list">
                {reviews.map((r, i) => (
                  <div key={i} className="pd-review-item">
                    <div className="pd-review-top">
                      <div className="pd-review-avatar">{r.name[0]}</div>
                      <div>
                        <p className="pd-review-name">{r.name}</p>
                        <Stars count={r.rating} size={13} />
                      </div>
                      <span className="pd-review-date">{r.date}</span>
                    </div>
                    <h4 className="pd-review-title">{r.title}</h4>
                    <p className="pd-review-text">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
       <Marquee />
     <Posts />

      <Footer />
    </>
  );
}
