import "../Supplements/Supplements.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Posts from "../../components/Posts";
import Marquee from "../../components/Marquee";

const imgProduct1 = "/supplements/p1.png";
const imgProduct2 = "/supplements/p2.png";
const imgProduct3 = "/supplements/p3.png";
const imgProduct4 = "/supplements/p5.png";
const imgProduct6 = "/supplements/p7.png";
const imgProduct7 = "/supplements/p8.png";
const imgProductIso =
  "https://www.figma.com/api/mcp/asset/6251020d-3f48-4774-af7d-f4f598fbddda";
const imgStarFull =
  "/supplements/star.png";
const imgStarHalf =
  "https://www.figma.com/api/mcp/asset/05b8ed64-2375-4fb2-b5ac-cc10075097e1";
const imgStarFull2 =
  "https://www.figma.com/api/mcp/asset/4985bb64-dba4-414a-9b69-196a7a450280";
const imgStarEmpty =
  "https://www.figma.com/api/mcp/asset/a56683f2-936a-4bd1-8919-99f20531318c";

const filterTabs = [
  "New Arrivals",
  "Best Sellers",
  "Health & Vitamins",
  "Featured",
  "Clearance",
];

const products = [
  {
    id: 1,
    name: "ATOM Creatine Monohydrate",
    cat: "Digestion",
    price: "$723.15",
    badge: "Best Seller",
    badgeColor: "#61d7ba",
    img: imgProduct1,
  },
  {
    id: 2,
    name: "ATOM Creatine Monohydrate",
    cat: "Digestion",
    price: "$723.15",
    badge: "Best Seller",
    badgeColor: "#61d7ba",
    img: imgProduct2,
  },
  {
    id: 3,
    name: "ATOM Creatine Monohydrate",
    cat: "Digestion",
    price: "$723.15",
    badge: "Best Seller",
    badgeColor: "#61d7ba",
    img: imgProduct3,
  },
  {
    id: 4,
    name: "ATOM Creatine Monohydrate",
    cat: "Digestion",
    price: "$723.15",
    badge: "Best Seller",
    badgeColor: "#61d7ba",
    img: imgProduct2,
  },
  {
    id: 5,
    name: "ATOM Creatine Monohydrate",
    cat: "Digestion",
    price: "$723.15",
    badge: "Best Seller",
    badgeColor: "#61d7ba",
    img: imgProduct4,
  },
  {
    id: 6,
    name: "IsoFit GOLD STANDARD",
    cat: "Health Support",
    price: "$734.52",
    oldPrice: "$898.02",
    badges: [
      { text: "Sale 18%", color: "#ee440e" },
      { text: "New", color: "#8aa9d8" },
    ],
    img: imgProductIso,
    isofit: true,
  },
  {
    id: 7,
    name: "ATOM Creatine Monohydrate",
    cat: "Digestion",
    price: "$723.15",
    badge: "Best Seller",
    badgeColor: "#61d7ba",
    img: imgProduct1,
  },
  {
    id: 8,
    name: "ATOM Creatine Monohydrate",
    cat: "Digestion",
    price: "$723.15",
    badge: "Best Seller",
    badgeColor: "#61d7ba",
    img: imgProduct2,
  },
];

const instaImgs = [
  imgProduct1,
  imgProduct2,
  imgProduct3,
  imgProduct4,
  imgProductIso,
];

function StarRating() {
  return (
    <div className="supp-stars">
      <img src={imgStarFull} alt="star" className="supp-star-img" />
      <img src={imgStarHalf} alt="star" className="supp-star-img" />
      <img src={imgStarFull2} alt="star" className="supp-star-img" />
      <img src={imgStarFull} alt="star" className="supp-star-img" />
      <img src={imgStarEmpty} alt="star" className="supp-star-img" />
    </div>
  );
}

function ProductCard({ product }) {
  return (
    <div className="supp-card">
      <div className="supp-card__inner">
        <div className="supp-card__header">
          <h3 className="supp-card__name">{product.name}</h3>
          <p className="supp-card__cat">{product.cat}</p>
          <div className="supp-card__rating-row">
            <StarRating />
            <span className="supp-card__rating-text">
              <span className="supp-card__rating-num">4.7</span>
              <span className="supp-card__rating-count"> (2113)</span>
            </span>
          </div>
        </div>

        <div
          className={`supp-card__img-wrap${product.isofit ? " supp-card__img-wrap--grey" : ""}`}
        >
          <img
            src={product.img}
            alt={product.name}
            className="supp-card__img"
            loading="lazy"
          />
        </div>

        <div className="supp-card__footer">
          <div className="supp-card__price-col">
            <span className="supp-card__price">{product.price}</span>
            {product.oldPrice && (
              <span className="supp-card__old-price">{product.oldPrice}</span>
            )}
          </div>
          <div className="supp-card__badges">
            {product.badge && (
              <span
                className="supp-badge"
                style={{
                  borderColor: product.badgeColor,
                  color: product.badgeColor,
                }}
              >
                {product.badge}
              </span>
            )}
            {product.badges &&
              product.badges.map((b, i) => (
                <span
                  key={i}
                  className="supp-badge"
                  style={{ borderColor: b.color, color: b.color }}
                >
                  {b.text}
                </span>
              ))}
          </div>
        </div>

        <button className="supp-card__add-btn" aria-label="Add to cart">
          Add to cart
        </button>
      </div>
    </div>
  );
}

export default function Supplements() {
  return (
    <>
      <Header />

      <div className="supp-page">
        <section className="supp-hero">
          <div className="supp-hero__bg">
            <div className="supp-hero__title-wrap">
              <h1 className="supp-hero__title">Supplements</h1>
              <nav className="supp-hero__breadcrumb">
                <span
                  className="supp-hero__breadcrumb-link"
                  onClick={() => window.__navigate && window.__navigate("home")}
                >
                  Home Page
                </span>
                <span className="supp-hero__breadcrumb-sep">•</span>
                <span className="supp-hero__breadcrumb-current">
                  Supplements
                </span>
              </nav>
            </div>
          </div>

          <div className="supp-hero__desc-wrap">
            <p className="supp-hero__desc">
              All your supplement needs to enhance your athletic endeavours –
              supporting muscle growth to fat loss, focus &amp; recovery
              enhancement, fatigue, stress and anxiety management.
            </p>
          </div>

          <div className="supp-hero__filters">
            {filterTabs.map((tab) => (
              <button key={tab} className="supp-filter-btn">
                {tab}
              </button>
            ))}
          </div>
        </section>

        <section className="supp-main">
          <div className="supp-toolbar">
            <div className="supp-toolbar__view">
              <button
                className="supp-view-btn supp-view-btn--active"
                aria-label="Grid view"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <rect x="0" y="0" width="7" height="7" rx="1" />
                  <rect x="9" y="0" width="7" height="7" rx="1" />
                  <rect x="0" y="9" width="7" height="7" rx="1" />
                  <rect x="9" y="9" width="7" height="7" rx="1" />
                </svg>
              </button>
              <button className="supp-view-btn" aria-label="List view">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <rect x="0" y="0" width="16" height="3" rx="1" />
                  <rect x="0" y="6" width="16" height="3" rx="1" />
                  <rect x="0" y="12" width="16" height="3" rx="1" />
                </svg>
              </button>
            </div>

            <p className="supp-toolbar__count">Showing 1–12 of 28 results</p>

            <div className="supp-toolbar__right">
              <div className="supp-select-wrap">
                <span className="supp-select-label">Default sorting</span>
                <svg
                  className="supp-select-arrow"
                  width="6"
                  height="4"
                  viewBox="0 0 6 4"
                  fill="currentColor"
                >
                  <path d="M0 0l3 4 3-4z" />
                </svg>
              </div>
              <div className="supp-select-wrap">
                <span className="supp-select-label supp-select-label--muted">
                  Show
                </span>
                <span className="supp-select-val">12</span>
                <svg
                  className="supp-select-arrow"
                  width="6"
                  height="4"
                  viewBox="0 0 6 4"
                  fill="currentColor"
                >
                  <path d="M0 0l3 4 3-4z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="supp-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <nav className="supp-pagination">
            <button className="supp-page-btn supp-page-btn--active">1</button>
            <button className="supp-page-btn">2</button>
            <button className="supp-page-btn">3</button>
            <button
              className="supp-page-btn supp-page-btn--next"
              aria-label="Next"
            >
              <svg
                width="15"
                height="10"
                viewBox="0 0 15 10"
                fill="currentColor"
              >
                <path d="M0 5h13M9 1l4 4-4 4" />
              </svg>
            </button>
          </nav>
        </section>

        <Marquee />

        <Posts />
      </div>

      <Footer />
    </>
  );
}
