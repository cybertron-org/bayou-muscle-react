import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./Product-Detail.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Posts from "../../components/Posts";
import Marquee from "../../components/Marquee";

const imgLinkProduct41Jpg = "/products/bp.png";
const imgProduct41Jpg = "/products/p1.png";
const imgLinkProduct42Jpg = "/products/p2.png";
const imgProduct43Jpg = "/products/p3.png";
const imgProduct41150 = "/products/p4.png";
// const imgProduct41Jpg =
//   "https://www.figma.com/api/mcp/asset/0c85e0e2-54bf-43cf-8a77-571797f322b4";
// const imgLinkProduct42Jpg =
//   "https://www.figma.com/api/mcp/asset/2e6c628c-25c0-41a7-8919-8abad65784dd";
// const imgProduct43Jpg =
//   "https://www.figma.com/api/mcp/asset/974fc515-94fa-4cfb-b33f-8e6b12fce7d2";
// const imgProduct41150 =
//   "https://www.figma.com/api/mcp/asset/3e9aa5ac-f695-409c-8d2d-599980bce40a";
const imgPayPng = "/products/pay.png";
const imgProduct28 =
  "/products/horse-power.png";
const imgProduct27 =
  "/products/muscleblaze.png";
const imgProduct26 =
  "/products/nutrex.png";
// const imgInsta1 =
//   "https://www.figma.com/api/mcp/asset/5e695952-b379-4174-9af1-57e6d154ed13";
// const imgInsta2 =
//   "https://www.figma.com/api/mcp/asset/df87bc45-5ad2-4150-a62f-8594a15b7568";
// const imgInsta3 =
//   "https://www.figma.com/api/mcp/asset/31e6ce41-8386-466d-839e-e2e0dfecc1c4";
// const imgInsta4 =
//   "https://www.figma.com/api/mcp/asset/b5bdceec-66f8-4069-9da4-835e212dfe87";
// const imgInsta5 =
//   "https://www.figma.com/api/mcp/asset/20d5ab9a-5d3b-41e6-a855-27b322c41f32";
// const imgRelated1 =
//   "https://www.figma.com/api/mcp/asset/de8c7b2c-4a0f-4138-adb3-03bdee8106fc";
// const imgRelated2 =
//   "https://www.figma.com/api/mcp/asset/73cb6ebe-b4bb-4b47-bd61-72e84de49905";
// const imgRelated3 =
//   "https://www.figma.com/api/mcp/asset/82891385-b020-4456-8914-8e4d4eb0c42b";
// const imgRelated4 =
//   "https://www.figma.com/api/mcp/asset/de8c7b2c-4a0f-4138-adb3-03bdee8106fc";

const latestReleases = [
  {
    id: 1,
    name: "Ultra Ripped: A Thermogenic Fat Burner",
    cat: "Home Accessories",
    price: "$11.90",
    stars: 5,
    img: "/images/p15.png",
  },
  {
    id: 2,
    name: "Denzour micronised creatine - 100 g",
    cat: "Art",
    price: "$29.00",
    stars: 4,
    img: "/images/p14.png",
  },
  {
    id: 3,
    name: "CLA: Conjugated Linoleic Acid Supplement",
    cat: "Home Accessories",
    price: "$10.12",
    oldPrice: "$11.90",
    badge: "-15%",
    stars: 4,
    img: "/images/p14.png",
  },
  {
    id: 4,
    name: "Ultra Ripped: A Thermogenic Fat Burner",
    cat: "Home Accessories",
    price: "$11.90",
    stars: 5,
    img: "/images/p13.png",
  },
];

const thumbs = [
  { id: 1, img: imgProduct41Jpg },
  { id: 2, img: imgLinkProduct42Jpg },
  { id: 3, img: imgProduct43Jpg },
  { id: 4, img: imgProduct41150 },
];

const mainImages = [
  imgLinkProduct41Jpg,
  imgLinkProduct42Jpg,
  imgProduct43Jpg,
  imgProduct41150,
];

const popularProducts = [
  {
    id: 1,
    name: "HORSE POWER® X",
    cat: "Digestion",
    price: "$144.99",
    img: imgProduct28,
  },
  {
    id: 2,
    name: "MuscleBlaze BCAA Gold",
    cat: "Health Support",
    price: "$310.39",
    img: imgProduct27,
  },
  {
    id: 3,
    name: "Nutrex HMB 1000",
    cat: "Health Support",
    price: "$293.84",
    img: imgProduct26,
  },
];

// const relatedProducts = [
//   {
//     id: 1,
//     name: "Ultra Ripped: A Thermogenic Fat Burner",
//     cat: "Home Accessories",
//     price: "$11.90",
//     img: imgRelated1,
//   },
//   {
//     id: 2,
//     name: "Denzour micronised creatine - 100 g",
//     cat: "Art",
//     price: "$29.00",
//     img: imgRelated2,
//   },
//   {
//     id: 3,
//     name: "CLA: Conjugated Linoleic Acid Supplement",
//     cat: "Home Accessories",
//     price: "$10.12",
//     img: imgRelated3,
//   },
//   {
//     id: 4,
//     name: "Ultra Ripped: A Thermogenic Fat Burner",
//     cat: "Home Accessories",
//     price: "$11.90",
//     img: imgRelated4,
//   },
// ];

const flavors = [
  "Chocolate Fudge",
  "Vanilla Ice Cream",
  "Double Rich Chocolate",
  "Strawberry",
];
const sizes = ["2.27 kg", "909 g", "4.54 kg"];

export default function ProductDetail() {
  const [activeThumb, setActiveThumb] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [qty, setQty] = useState(1);
  const [activeFlavor, setActiveFlavor] = useState("Chocolate Fudge");
  const [activeSize, setActiveSize] = useState("2.27 kg");

  const nav = (page, e) => {
    if (e) e.preventDefault();
    if (window.__navigate) window.__navigate(page);
  };

  return (
    <>
      <Header />

      <div className="pd-page">
        {/* ── BREADCRUMB ── bg #f4f4f4, px 30 py 20 */}
        <div className="pd-breadcrumb">
          <div className="pd-breadcrumb__inner">
            <span className="pd-bc-link" onClick={(e) => nav("home", e)}>
              Home Page
            </span>
            <span className="pd-bc-sep">•</span>
            <span className="pd-bc-link" onClick={(e) => nav("supplements", e)}>
              Supplements
            </span>
            <span className="pd-bc-sep">•</span>
            <span className="pd-bc-current">Denziso Whey Matrix Protein</span>
          </div>
        </div>

        {/* ── MAIN PRODUCT AREA ── */}
        <div className="pd-main">
          {/* LEFT: Gallery — thumbnails 80×80 + main 699.5×699.5 */}
          <div className="pd-gallery">
            <div className="pd-thumbs">
              {thumbs.map((t, i) => (
                <button
                  key={t.id}
                  className={`pd-thumb${activeThumb === i ? " pd-thumb--active" : ""}`}
                  onClick={() => setActiveThumb(i)}
                >
                  <img src={t.img} alt={`View ${i + 1}`} />
                </button>
              ))}
            </div>
            <div className="pd-main-img">
              <img
                src={mainImages[activeThumb]}
                alt="Denziso Whey Matrix Protein"
              />
            </div>
          </div>

          {/* RIGHT: Product info panel */}
          <div className="pd-info">
            {/* Sale badge — border #ee440e, Instrument Sans SemiBold 14px */}
            <div className="pd-sale-badge">Sale 15%</div>

            {/* Title — Sofia Sans Condensed Black 64px, tracking -1px, uppercase */}
            <h1 className="pd-title">
              Denziso Whey Matrix
              <br />
              Protein
            </h1>

            {/* Meta row — brands + in stock */}
            <div className="pd-meta">
              <div className="pd-brands">
                <span className="pd-brands__label">Brands:</span>
                <a href="#" className="pd-brands__link">
                  Energy Gym
                </a>
                <a href="#" className="pd-brands__link">
                  Gym Sports
                </a>
                <a href="#" className="pd-brands__link">
                  Healthy
                </a>
              </div>
              <div className="pd-stock">
                <span className="pd-stock__dot" />
                <span className="pd-stock__text">In stock</span>
              </div>
            </div>

            {/* Price — Instrument Sans SemiBold 24px / 16px */}
            <div className="pd-price-row">
              <span className="pd-price">$809.75</span>
              <span className="pd-price-old">$955.30</span>
            </div>

            {/* Short description */}
            <p className="pd-short-desc">
              Distinctio et eius dolores corporis velit officia. Dolor quis quis
              voluptatibus consequatur. Hic dolore consequatur hic voluptate
              voluptas aperiam inventore.
            </p>

            {/* Flavor selector */}
            {/* <div className="pd-option-group">
              <p className="pd-option-label">
                Flavor: <strong>{activeFlavor}</strong>
              </p>
              <div className="pd-pills">
                {flavors.map((f) => (
                  <button
                    key={f}
                    className={`pd-pill${activeFlavor === f ? " pd-pill--active" : ""}`}
                    onClick={() => setActiveFlavor(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div> */}

            {/* Size selector */}
            {/* <div className="pd-option-group">
              <p className="pd-option-label">
                Size: <strong>{activeSize}</strong>
              </p>
              <div className="pd-pills">
                {sizes.map((s) => (
                  <button
                    key={s}
                    className={`pd-pill${activeSize === s ? " pd-pill--active" : ""}`}
                    onClick={() => setActiveSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div> */}

            {/* Cart row — qty + Add to cart + wishlist + compare */}
            <div className="pd-cart-row">
              {/* Qty stepper */}
              <div className="pd-qty">
                <button
                  className="pd-qty__btn"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span className="pd-qty__val">{qty}</span>
                <button
                  className="pd-qty__btn"
                  onClick={() => setQty((q) => q + 1)}
                >
                  +
                </button>
              </div>

              {/* Add to cart — bg #000, Sofia Sans Condensed Black 16px uppercase */}
              <button className="pd-add-btn">Add to cart</button>

              {/* Wishlist */}
              <button className="pd-icon-btn" aria-label="Add to wishlist">
                <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
                  <path
                    d="M8 13S1 8.5 1 4.5a3.5 3.5 0 0 1 7-0C8.5 3.667 9 3 10.5 3a3.5 3.5 0 0 1 4.5 1.5C15 8.5 8 13 8 13z"
                    stroke="#000"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>

              {/* Compare */}
              <button className="pd-icon-btn" aria-label="Compare">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 20L20 4M4 4h6M4 4v6M20 20h-6M20 20v-6"
                    stroke="#000"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Buy It Now — border #000, Sofia Sans Condensed Black 16px uppercase */}
            <button className="pd-buy-btn">Buy It Now</button>

            {/* Benefits list */}
            <div className="pd-benefits">
              <div className="pd-benefit-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="18"
                  viewBox="0 0 17 18"
                  fill="none"
                >
                  <path
                    d="M12.7376 1.58245H8.94341V5.16087H15.1112L13.8525 2.30173C13.6247 1.84618 13.2651 1.60642 12.7736 1.58245H12.7376ZM15.4889 6.34768H1.19316V14.6913C1.19316 15.039 1.30705 15.3237 1.53482 15.5455C1.76259 15.7673 2.04431 15.8782 2.37997 15.8782H14.3021C14.6497 15.8782 14.9344 15.7673 15.1562 15.5455C15.378 15.3237 15.4889 15.039 15.4889 14.6913V6.34768ZM1.57078 5.16087H7.7566V1.58245H3.94441C3.42893 1.60642 3.0573 1.84618 2.82952 2.30173L1.57078 5.16087ZM12.7376 0.395636C13.7566 0.443586 14.4879 0.917112 14.9314 1.81621L16.4959 5.30473C16.6157 5.60443 16.6757 5.9281 16.6757 6.27575V14.6913C16.6517 15.3627 16.4179 15.9201 15.9744 16.3637C15.5308 16.8072 14.9734 17.047 14.3021 17.0829H2.39796C1.72663 17.047 1.16619 16.8072 0.716637 16.3637C0.267087 15.9201 0.0303237 15.3627 0.00634766 14.6913V6.27575C0.00634766 5.9281 0.0782757 5.60443 0.222132 5.30473L1.7506 1.81621C2.20615 0.917112 2.93742 0.443586 3.94441 0.395636H12.7376Z"
                    fill="#A8A8A8"
                  />
                </svg>
                <span>
                  <strong>Free Shipping</strong> &amp; Exchanges
                </span>
              </div>
              <div className="pd-benefit-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M16.3998 2.94905L9.65652 0.125875C9.45272 0.0419579 9.23394 0 9.00017 0C8.76641 0 8.54763 0.0419579 8.34383 0.125875H8.36181L1.60057 2.94905C1.28889 3.06893 1.03714 3.27273 0.845329 3.56044C0.653521 3.84815 0.557617 4.15984 0.557617 4.49551C0.557617 6.71329 0.953222 8.78721 1.74443 10.7173C2.45172 12.4555 3.42275 13.966 4.65752 15.2488C5.79638 16.4476 7.02515 17.3227 8.34383 17.8741C8.55962 17.958 8.7784 18 9.00017 18C9.22195 18 9.43474 17.958 9.63854 17.8741C10.4777 17.5265 11.3109 17.017 12.138 16.3457C13.0851 15.5784 13.9302 14.6733 14.6735 13.6304C15.5246 12.4316 16.184 11.1189 16.6515 9.69231C17.179 8.07393 17.4427 6.34166 17.4427 4.49551C17.4427 4.15984 17.3468 3.85115 17.155 3.56943C16.9632 3.28771 16.7115 3.08092 16.3998 2.94905ZM9.22495 16.8312C9.06911 16.8911 8.92525 16.8911 8.79338 16.8312C7.60657 16.3636 6.47969 15.5544 5.41276 14.4036C4.29788 13.1928 3.41676 11.7722 2.76941 10.1419C2.05012 8.34366 1.69048 6.46154 1.69048 4.49551C1.69048 4.38761 1.72045 4.28572 1.78039 4.18981C1.84033 4.09391 1.92425 4.02198 2.03214 3.97403L8.7754 1.16883C8.91926 1.10889 9.06311 1.10889 9.20697 1.16883L15.9682 3.97403C16.0761 4.02198 16.16 4.09391 16.22 4.18981C16.2799 4.28572 16.3099 4.38761 16.3099 4.49551C16.3099 6.46154 15.9502 8.34366 15.2309 10.1419C14.5836 11.7722 13.7025 13.1928 12.5876 14.4036C11.5207 15.5544 10.3998 16.3636 9.22495 16.8312ZM14.0082 5.41259C13.9242 5.32867 13.8253 5.28671 13.7115 5.28671C13.5976 5.28671 13.4987 5.32867 13.4148 5.41259L7.66051 11.0949L5.23294 8.66733C5.14903 8.58342 5.05012 8.54146 4.93624 8.54146C4.82235 8.54146 4.72345 8.57742 4.63953 8.64935L4.33384 8.95505C4.26191 9.03896 4.22295 9.13786 4.21696 9.25175C4.21096 9.36563 4.24992 9.46454 4.33384 9.54845L7.35482 12.6054C7.43874 12.6773 7.53764 12.7163 7.65152 12.7223C7.76541 12.7283 7.86431 12.6893 7.94823 12.6054L14.2959 6.31169C14.3798 6.22777 14.4218 6.12587 14.4218 6.00599C14.4218 5.88611 14.3798 5.79021 14.2959 5.71828L14.0082 5.41259Z"
                    fill="#A8A8A8"
                  />
                </svg>
                <span className="pd-muted">
                  Flexible and <strong>secure payment</strong>, pay on delivery
                </span>
              </div>
              <div className="pd-benefit-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="18"
                  viewBox="0 0 15 18"
                  fill="none"
                >
                  <path
                    d="M6.50877 0.468729C7.06014 0.157084 7.6235 0.157084 8.19885 0.468729L8.73823 0.810341C8.83412 0.870272 8.93601 0.900238 9.04388 0.900238L9.67317 0.864279C10.3324 0.888252 10.8299 1.18192 11.1655 1.74528L11.4711 2.30264C11.5191 2.38655 11.597 2.45247 11.7049 2.50042L12.2442 2.84203C12.8196 3.15367 13.1073 3.63912 13.1073 4.29837L13.0713 4.92766C13.0713 5.04752 13.1013 5.1494 13.1612 5.23331L13.5028 5.80865C13.8145 6.36003 13.8145 6.92338 13.5028 7.49873L13.1612 8.03812C13.1013 8.12202 13.0713 8.21791 13.0713 8.32579L13.1073 8.99103C13.1073 9.63829 12.8196 10.1297 12.2442 10.4654L11.7049 10.753C11.597 10.801 11.5191 10.8789 11.4711 10.9868L11.1655 11.5621C10.8418 12.1135 10.3444 12.3892 9.67317 12.3892H9.04388C8.92402 12.3652 8.82214 12.3892 8.73823 12.4611L8.19885 12.7847C7.6235 13.0964 7.06014 13.0964 6.50877 12.7847L5.93342 12.4611C5.84952 12.3892 5.75363 12.3652 5.64575 12.3892H5.01647C4.34523 12.3892 3.8418 12.1135 3.50619 11.5621L3.21851 10.9868C3.17057 10.8789 3.09266 10.801 2.98478 10.753L2.44539 10.4654C1.87005 10.1297 1.58238 9.63829 1.58238 8.99103L1.61833 8.32579C1.61833 8.21791 1.58238 8.12202 1.51046 8.03812L1.18683 7.49873C0.87518 6.92338 0.87518 6.36003 1.18683 5.80865L1.51046 5.23331C1.58238 5.1494 1.61833 5.04752 1.61833 4.92766L1.58238 4.29837C1.58238 3.63912 1.87005 3.15367 2.44539 2.84203L2.98478 2.50042C3.09266 2.45247 3.17057 2.38655 3.21851 2.30264L3.50619 1.74528C3.8418 1.18192 4.34523 0.888252 5.01647 0.864279L5.64575 0.900238C5.75363 0.900238 5.84952 0.870272 5.93342 0.810341L6.50877 0.468729ZM7.64148 1.40367C7.43771 1.29579 7.23994 1.29579 7.04816 1.40367L6.50877 1.74528C6.2211 1.88911 5.92144 1.96103 5.60979 1.96103L4.98051 1.94305C4.75277 1.94305 4.58496 2.03894 4.47708 2.23072L4.15345 2.80607C3.99763 3.06977 3.78187 3.27953 3.50619 3.43535L2.94882 3.75899C2.74505 3.87885 2.64317 4.04666 2.64317 4.26241L2.67913 4.8917C2.67913 5.20334 2.60122 5.503 2.44539 5.79067L2.12176 6.33006C2.0019 6.53383 2.0019 6.7316 2.12176 6.92338L2.44539 7.46277C2.60122 7.75044 2.67913 8.0501 2.67913 8.36175L2.64317 8.99103C2.64317 9.21877 2.74505 9.38658 2.94882 9.49446L3.50619 9.83607C3.78187 9.99189 3.99763 10.2017 4.15345 10.4654L4.47708 11.0227C4.58496 11.2265 4.75277 11.3284 4.98051 11.3284L5.60979 11.2924C5.92144 11.2924 6.2211 11.3703 6.50877 11.5261L7.04816 11.8678C7.23994 11.9756 7.43771 11.9756 7.64148 11.8678L8.18087 11.5261C8.44457 11.3703 8.74423 11.2924 9.07984 11.2924L9.70913 11.3284C9.92488 11.3284 10.0927 11.2265 10.2126 11.0227L10.5362 10.4654C10.692 10.2017 10.9018 9.99189 11.1655 9.83607L11.7408 9.49446C11.9326 9.38658 12.0285 9.21877 12.0285 8.99103L12.0105 8.36175C12.0105 8.0501 12.0884 7.75044 12.2442 7.46277L12.5679 6.92338C12.6758 6.7316 12.6758 6.53383 12.5679 6.33006L12.2442 5.79067C12.0884 5.503 12.0105 5.20334 12.0105 4.8917L12.0285 4.26241C12.0285 4.04666 11.9326 3.87885 11.7408 3.75899L11.1655 3.43535C10.9018 3.27953 10.692 3.06977 10.5362 2.80607L10.2126 2.23072C10.0927 2.03894 9.92488 1.94305 9.70913 1.94305L9.07984 1.96103C8.7682 1.96103 8.46854 1.88911 8.18087 1.74528L7.64148 1.40367ZM7.33583 4.76584C6.62863 4.78981 6.09824 5.10745 5.74464 5.71875C5.39104 6.33006 5.39104 6.94136 5.74464 7.55267C6.09824 8.16397 6.62863 8.48161 7.33583 8.50558C8.05501 8.48161 8.5914 8.16397 8.945 7.55267C9.29859 6.94136 9.29859 6.33006 8.945 5.71875C8.5914 5.10745 8.05501 4.78981 7.33583 4.76584ZM10.2665 6.63571C10.2305 7.73846 9.74509 8.58349 8.81015 9.17083C7.82727 9.69823 6.85038 9.69823 5.87949 9.17083C4.94455 8.58349 4.45311 7.73846 4.40516 6.63571C4.45311 5.52098 4.94455 4.67594 5.87949 4.1006C6.85038 3.5732 7.82727 3.5732 8.81015 4.1006C9.74509 4.67594 10.2305 5.52098 10.2665 6.63571ZM0.989051 14.9602L2.37348 11.688C2.42142 11.7359 2.48735 11.8618 2.57125 12.0655C2.71509 12.3053 2.8829 12.515 3.07468 12.6948L2.33752 14.4928L3.61406 14.295C3.82982 14.271 4.00362 14.3489 4.13547 14.5287L4.83667 15.6255L5.69969 13.5578C5.77161 13.6058 5.84952 13.6477 5.93342 13.6837C6.16116 13.8395 6.40689 13.9414 6.67059 13.9893L5.44798 16.956C5.35209 17.1597 5.19626 17.2676 4.98051 17.2796C4.77674 17.2796 4.62092 17.2077 4.51304 17.0638L3.41629 15.4277L1.54642 15.6974C1.34265 15.7094 1.17484 15.6375 1.04299 15.4816C0.935112 15.3138 0.911139 15.14 0.971071 14.9602H0.989051ZM9.24166 16.956L8.00107 14.0253C8.26477 13.9534 8.51049 13.8395 8.73823 13.6837C8.83412 13.6477 8.91203 13.6058 8.97197 13.5578L9.83498 15.6255L10.5362 14.5647C10.668 14.3609 10.8478 14.271 11.0756 14.295L12.3341 14.4928L11.597 12.6948C11.8007 12.515 11.9686 12.3053 12.1004 12.0655C12.1963 11.8618 12.2622 11.7359 12.2982 11.688L13.7006 14.9602C13.7725 15.14 13.7485 15.3138 13.6287 15.4816C13.4968 15.6375 13.335 15.7094 13.1432 15.6974L11.2374 15.4277L10.1766 17.0638C10.0567 17.2317 9.89192 17.3066 9.68216 17.2886C9.4724 17.2706 9.32556 17.1597 9.24166 16.956Z"
                    fill="#A8A8A8"
                  />
                </svg>
                <span className="pd-muted">
                  600,000 <strong>happy customers</strong>
                </span>
              </div>
            </div>

            {/* Guarantee + payment icons */}
            <div className="pd-guarantee">
              <p className="pd-guarantee__label">
                Guarantee Safe &amp; Secure Checkout
              </p>
              <div className="pd-pay-img">
                <img
                  src={imgPayPng}
                  alt="Accepted payment methods"
                  width="350"
                  height="35"
                />
              </div>
            </div>

            {/* SKU / Category */}
            <div className="pd-meta-footer">
              <p className="pd-meta-line">
                <span className="pd-muted-label">SKU: </span>
                <strong>NT27</strong>
              </p>
              <p className="pd-meta-line">
                <span className="pd-muted-label">Category: </span>
                <strong>Protein</strong>
              </p>
              <p className="pd-meta-line">
                <span className="pd-muted-label">Tags: </span>
                <a href="#" className="pd-tag">
                  Gym
                </a>
                ,
                <a href="#" className="pd-tag">
                  Protein
                </a>
                ,
                <a href="#" className="pd-tag">
                  Whey
                </a>
              </p>
            </div>
          </div>
        </div>
        {/* end pd-main */}

        {/* ── TABS + POPULAR PRODUCTS ── */}
        <div className="pd-lower">
          {/* LEFT: Tabs */}
          <div className="pd-tabs-area">
            {/* Tab bar */}
            <div className="pd-tabs-bar">
              {[
                { key: "description", label: "Description" },
                { key: "additional", label: "Additional information" },
                { key: "reviews", label: "Reviews (0)" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  className={`pd-tab-btn${activeTab === tab.key ? " pd-tab-btn--active" : ""}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="pd-tab-content">
              {activeTab === "description" && (
                <div className="pd-tab-description">
                  <h3 className="pd-tab-h3">Up Your Game!</h3>
                  <p className="pd-tab-p">
                    Optimum Nutrition 100% Whey Gold Standard Protein features
                    the purest and most expensive form of protein in an
                    exclusive, delicious blend.
                  </p>
                  <p className="pd-tab-p">
                    Well, look no further! Optimum Nutrition Gold Standard 100%
                    Whey protein is a cult-classic in the fitness world for damn
                    good reason. Optimum Nutrition Gold Standard is a world
                    best-selling whey protein. This exclusive blend includes
                    whey protein isolates, whey protein concentrate and 5.5
                    grams of naturally occurring BCAAs (branched-chain amino
                    acids).
                  </p>
                  <h3 className="pd-tab-h3">Key benefits</h3>
                  <ul className="pd-key-benefits">
                    <li>
                      <span className="pd-dot-bullet" />
                      <span>
                        <strong>
                          24 grams of rapidly digesting whey proteins per
                          serving
                        </strong>{" "}
                        (including whey protein isolate)
                      </span>
                    </li>
                    <li>
                      <span className="pd-dot-bullet" />
                      <strong>
                        5.5 grams of naturally occurring BCAAs per serving for
                        muscle recovery
                      </strong>
                    </li>
                    <li>
                      <span className="pd-dot-bullet" />
                      <span>
                        <strong>Low-lactose levels</strong> (great for those who
                        are sensitive to dairy products)
                      </span>
                    </li>
                    <li>
                      <span className="pd-dot-bullet" />
                      <span>
                        <strong>4 grams of glutamine</strong> (essential for
                        recovery)
                      </span>
                    </li>
                    <li>
                      <span className="pd-dot-bullet" />
                      <span className="pd-muted-text">
                        Macro-friendly with only 2 grams of fat, 4 grams of
                        carbohydrates &amp;{" "}
                        <strong>2 grams of sugar per serving.</strong>
                      </span>
                    </li>
                  </ul>
                  <p className="pd-tab-p">
                    Optimum Nutrition Gold Standard 100% Whey is ideal for
                    athletes who have a favourite flavour and want to stock up
                    on whey protein powder without the hassle of making frequent
                    orders online.
                  </p>
                </div>
              )}
              {activeTab === "additional" && (
                <div className="pd-tab-additional">
                  <table className="pd-info-table">
                    <tbody>
                      <tr>
                        <td className="pd-info-label">Weight</td>
                        <td>2.27 kg</td>
                      </tr>
                      <tr>
                        <td className="pd-info-label">Dimensions</td>
                        <td>20 × 20 × 30 cm</td>
                      </tr>
                      <tr>
                        <td className="pd-info-label">Flavor</td>
                        <td>
                          Chocolate Fudge, Vanilla Ice Cream, Double Rich
                          Chocolate, Strawberry
                        </td>
                      </tr>
                      <tr>
                        <td className="pd-info-label">Size</td>
                        <td>2.27 kg, 909 g, 4.54 kg</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="pd-tab-reviews">
                  <p className="pd-tab-p">
                    No reviews yet. Be the first to review this product.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Popular Products sidebar */}
          <div className="pd-popular">
            <div className="pd-popular__head">
              <h3 className="pd-popular__title">
                <span>Popular </span>
                <span className="pd-popular__title--muted">Products</span>
              </h3>
            </div>
            <div className="pd-popular__list">
              {popularProducts.map((p) => (
                <div key={p.id} className="pd-popular-item">
                  <div className="pd-popular-item__img">
                    <img src={p.img} alt={p.name} />
                  </div>
                  <div className="pd-popular-item__info">
                    <p className="pd-popular-item__name">{p.name}</p>
                    <p className="pd-popular-item__cat">{p.cat}</p>
                  </div>
                  <div className="pd-popular-item__price">{p.price}</div>
                </div>
              ))}
            </div>
            <button className="pd-popular__add-btn">Add to cart</button>
          </div>
        </div>
        {/* end pd-lower */}

        {/* ── RELATED PRODUCTS ── Swiper slider, 3.2 slides visible, left aligned */}
        {/* LATEST RELEASES */}
        <section className="hm-section hm-latest">
          <div className="hm-section__head">
            <h2 className="hm-section__heading">Latest Releases</h2>
            {/* <a
              href="#"
              className="hm-view-all"
              onClick={(e) => nav("shop", null, e)}
            >
              <span>view all products</span>
              <span className="hm-view-all__box">
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </a> */}
          </div>
          <div className="hm-slider-wrap">
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={4}
              navigation={false}
              className="hm-swiper"
              breakpoints={{
                0: { slidesPerView: 1.2, spaceBetween: 12 },
                576: { slidesPerView: 2.1, spaceBetween: 14 },
                768: { slidesPerView: 3.1, spaceBetween: 16 },
                1200: { slidesPerView: 4, spaceBetween: 20 },
              }}
            >
              {latestReleases.map((p) => (
                <SwiperSlide key={p.id}>
                  <div
                    className="hm-latest-card"
                    onClick={(e) => nav("product", p.id, e)}
                  >
                    {/* {p.badge && <span className="hm-badge">{p.badge}</span>} */}
                    <div className="hm-latest-card__body">
                      <p className="hm-latest-card__name">{p.name}</p>
                      <p className="hm-latest-card__cat">{p.cat}</p>
                      <div className="hm-latest-card__img">
                        <img src={p.img} alt={p.name} loading="lazy" />
                      </div>
                      <div className="hm-latest-card__footer">
                        <span className="hm-latest-card__price">{p.price}</span>
                        {p.oldPrice && (
                          <span className="hm-feat-card__old">
                            {p.oldPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* ── MARQUEE ── "Fitness trainings supplements merchandise", Sofia Sans Condensed Bold 183px, #ddca8a, opacity 50% */}

        {/* ── INSTAGRAM ── */}
        <Marquee />
        <Posts />
      </div>
      {/* end pd-page */}

      <Footer />
    </>
  );
}
