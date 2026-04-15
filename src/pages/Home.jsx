import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Posts from "../components/Posts";
import Marquee from "../components/Marquee";

/* ── DATA ── */
const featuredProducts = [
  {
    id: 1,
    name: "CPT: Conjugated Linoleic Acid Supplement",
    cat: "CHOCOLATE MILKSHAKE",
    price: "$9.00",
    stars: 4,
    reviews: 4,
    img: "/images/p14.png",
  },
  {
    id: 2,
    name: "Denzour micronised creatine - 100 g",
    cat: "Art",
    price: "$9.95",
    stars: 4,
    reviews: 3,
    img: "/images/p12.png",
  },
  {
    id: 3,
    name: "ISOCOOL Cold Filtered Protein Isolate",
    cat: "Art",
    price: "$9.00",
    oldPrice: "$29.00",
    badge: "-8%",
    stars: 5,
    reviews: 4,
    img: "/images/p13.png",
  },
  {
    id: 4,
    name: "L-Carnitine: An Amino Acid Supplement for Athletes",
    cat: "Home Accessories",
    price: "$9.00",
    stars: 4,
    reviews: 4,
    img: "/images/p14.png",
  },
  {
    id: 5,
    name: "Denzour micronised creatine -100 g",
    cat: "Art",
    price: "$9.00",
    stars: 4,
    reviews: 3,
    img: "/images/p15.png",
  },
];

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

const goalBanners = [
  {
    title: "WEIGHT",
    accent: "MANAGEMENT",
    sub: "10%+ off today",
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80",
    wide: true,
  },
  {
    title: "BUILD",
    accent: "MUSCLE",
    sub: "With the right nutrition",
    img: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80",
    wide: false,
  },
  {
    title: "ACTIVE",
    accent: "LIFESTYLE",
    sub: "Smart, efficient energy",
    img: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&q=80",
    wide: false,
  },
  {
    title: "LEAN",
    accent: "PHYSIQUE",
    sub: "Strength & performance",
    img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=80",
    wide: true,
  },
  {
    title: "",
    accent: "ENDURANCE",
    sub: "Fuel for the podium",
    img: "https://images.unsplash.com/photo-1461773518188-b3e86f98242f?w=600&q=80",
    wide: false,
  },
];

const trustItems = [
  {
    icon: "/images/t1.png",
    title: "FAST DELIVERY",
    sub: "West & East coast dispatch",
  },
  {
    icon: "/images/t2.png",
    title: "FREE GIFT WITH ORDER $150+",
    sub: "Multiple gift options available",
  },
  {
    icon: "/images/t3.png",
    title: "CLICK & COLLECT",
    sub: "Check your local stores now",
  },
  {
    icon: "/images/t.png",
    title: "2M+ HAPPY CUSTOMERS",
    sub: "Here to support your journey",
  },
];

const merchandiseItems = [
  {
    label: "Lean Muscle",
    sub: "Build your burn.",
    img: "/images/m1.png",
  },
  {
    label: "Gain Mass",
    sub: "Get cut.",
    img: "/images/m2.png",
  },
  {
    label: "Lose Weight",
    sub: "Build your strength.",
    img: "/images/m3.png",
  },
  {
    label: "Strength    ",
    sub: "Enhance your performance.",
    img: "/images/m4.png",
  },
  {
    label: "Build Muscle",
    sub: "Get powerful.",
    img: "/images/m5.png",
  },
  {
    label: "Recovery",
    sub: "Boost your muscle recovery.",
    img: "/images/m6.png",
  },
];

const blogPosts = [
  {
    img: "/images/blog1.png",
    cat: "In Sub Category 1",
    title: "Turpis at eleifend leo mi elit Aenean porta ac sed faucibus",
    excerpt:
      "Turpis at eleifend leo mi elit Aenean porta ac sed faucibus. Nunc urna Morbi fringilla vitae orci convallis condimentum auctor sit dui.",
  },
  {
    img: "/images/blog2.png",
    cat: "In Sub Category 1",
    title: "Morbi condimentum molestie Nam enim odio sodales",
    excerpt:
      "Sed mauris Pellentesque elit Aliquam at lacus interdum nascetur elit ipsum. Enim ipsum hendrerit Suspendisse turpis laoreet fames tempus ligula.",
  },
];

const instaImgs = [
  "/images/p1.png",
  "/images/p2.png",
  "/images/p3.png",
  "/images/p4.png",
  "/images/p5.png",
];

const marqueeWords1 = ["Supplements", "", "", "", ""];
const marqueeWords2 = ["", "Merchandise", "", "", ""];

function Stars({ count }) {
  return (
    <div className="hm-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={
            n <= count ? "hm-star hm-star--on" : "hm-star hm-star--off"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function Home() {
  // Testimonial Slider Logic
  useEffect(() => {
    const testimonials = [
      {
        name: "EMERSON ANDERSON",
        role: "15th batch student",
        quote:
          "THE FACILITIES HERE ARE TOP-NOTCH AND THE STAFF IS ALWAYS FRIENDLY AND HELPFUL. I'VE NEVER FELT MORE CONFIDENT",
        stars: "★★★★★",
      },
      {
        name: "CHRIS EVANS",
        role: "12th batch student",
        quote:
          "THE TRAINING PROGRAM EXCEEDED MY EXPECTATIONS. THE INSTRUCTORS ARE HIGHLY KNOWLEDGEABLE AND SUPPORTIVE.",
        stars: "★★★★★",
      },
    ];

    let currentIndex = 0;

    const nameEl = document.getElementById("testimonial-name");
    const roleEl = document.getElementById("testimonial-role");
    const quoteEl = document.getElementById("testimonial-quote");
    const starsEl = document.getElementById("testimonial-stars");
    const prevBtn = document.getElementById("prev-testimonial");
    const nextBtn = document.getElementById("next-testimonial");

    const updateTestimonial = (index) => {
      if (nameEl && roleEl && quoteEl && starsEl) {
        nameEl.textContent = testimonials[index].name;
        roleEl.textContent = testimonials[index].role;
        quoteEl.textContent = `"${testimonials[index].quote}"`;
        starsEl.textContent = testimonials[index].stars;
      }
    };

    const nextTestimonial = () => {
      currentIndex = (currentIndex + 1) % testimonials.length;
      updateTestimonial(currentIndex);
    };

    const prevTestimonial = () => {
      currentIndex =
        (currentIndex - 1 + testimonials.length) % testimonials.length;
      updateTestimonial(currentIndex);
    };

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", prevTestimonial);
      nextBtn.addEventListener("click", nextTestimonial);
    }

    return () => {
      if (prevBtn && nextBtn) {
        prevBtn.removeEventListener("click", prevTestimonial);
        nextBtn.removeEventListener("click", nextTestimonial);
      }
    };
  }, []);

  const nav = (page, productId, e) => {
    if (e) e.preventDefault();
    // Agar productId na de (jaise shop, blog ke liye), tu e = productId hoga
    const actualProductId = typeof productId === "object" ? null : productId;
    window.__navigate && window.__navigate(page, actualProductId);
  };

  return (
    <>
      <Header />

      {/* HERO SECTION */}
      <section className="hm-hero">
        <div className="hm-hero__bg">
          <video autoPlay loop muted playsInline>
            <source src="/supplements/boxing.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="hm-hero__overlay" />
        <div className="hm-hero__content">
          <h1 className="hm-hero__title">
           <img src="/blogs/work.png" alt="" />
          </h1>
          <p className="hm-hero__label"> <img src="/blogs/smart.png" alt="" /></p>
          <a
            href="#"
            className="hm-hero__btn"
            onClick={(e) => nav("supplements", null, e)}
          >
            
            <img src="/blogs/shop.png" alt="" />
          </a>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="hm-section hm-featured">
        <div className="hm-section__head">
          <div>
            <h2 className="hm-section__heading lato">FEATURED PRODUCTS</h2>
          </div>
        </div>
        <div className="hm-slider-wrap">
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={5}
            slidesOffsetBefore={0}
            slidesOffsetAfter={0}
            navigation={false}
            className="hm-swiper"
            breakpoints={{
              0: { slidesPerView: 1.3, spaceBetween: 12 },
              576: { slidesPerView: 2.2, spaceBetween: 14 },
              768: { slidesPerView: 3.2, spaceBetween: 16 },
              1024: { slidesPerView: 4.2, spaceBetween: 18 },
              1280: { slidesPerView: 5, spaceBetween: 20 },
            }}
          >
            {featuredProducts.map((p) => (
              <SwiperSlide key={p.id}>
                <div
                  className="hm-feat-card"
                  onClick={(e) => nav("productdetail", p.id, e)}
                >
                  {p.badge && <span className="hm-badge">{p.badge}</span>}
                  <div className="hm-feat-card__body">
                    <p className="hm-feat-card__name">{p.name}</p>
                    <p className="hm-feat-card__cat">{p.cat}</p>
                    <div className="hm-feat-card__img">
                      <img src={p.img} alt={p.name} loading="lazy" />
                    </div>
                    <div className="hm-feat-card__footer">
                      <div className="hm-feat-card__rating">
                        <Stars count={p.stars} />
                        <span className="hm-feat-card__reviews">
                          ({p.reviews}.{p.stars})
                        </span>
                      </div>
                      <div className="hm-feat-card__price-wrap">
                        <span className="hm-feat-card__price">{p.price}</span>
                        {p.oldPrice && (
                          <span className="hm-feat-card__old">
                            {p.oldPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="hm-divider-wrap">
        <div className="hm-divider" />
      </div>

      {/* LATEST RELEASES */}
      <section className="hm-section hm-latest">
        <div className="hm-section__head">
          <h2 className="hm-section__heading">Latest Releases</h2>
          <a
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
          </a>
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
                        <span className="hm-feat-card__old">{p.oldPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* GOAL BANNERS */}
      <div className="container">
        <section className="hm-goals">
          <div className="hm-goals__row hm-goals__row--top">
            <div className="hm-goal-card__overlay" />
            <div className="row align-items-center">
              <div className="col-md-5 prb-10">
                <img className="w-100" src="/images/w1.png" alt="" />
              </div>
              <div className="col-md-4 prb-10">
                <img className="" src="/images/w2.png" alt="" />
              </div>
              <div className="col-md-3 ">
                <img className="w-100" src="/images/w3.png" alt="" />
              </div>
            </div>
          </div>
          <div className="row pt-4 align-items-center">
            <div className="col-md-6 prb-10">
              <img className="w-100" src="/images/w4.png" alt="" />
            </div>
            <div className="col-md-6">
              <img className="" src="/images/w5.png" alt="" />
            </div>
          </div>
        </section>
      </div>

      {/* TRUST STRIP */}
      <div className="hm-trust pb-100 pt-100">
        {trustItems.map((item, i) => (
          <div key={i} className="hm-trust__item">
            <img className="hm-trust__icon" src={item.icon} alt={item.title} />
            <div>
              <p className="hm-trust__title">{item.title}</p>
              <p className="hm-trust__sub">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TESTIMONIAL SECTION - CORRECTED */}
      <section className="hm-testimonial">
        <div className="hm-testimonial__inner">
          <div className="hm-testimonial__left">
            <div className="hm-rating-card">
              <img src="/images/review.png" alt="" />
            </div>
            <div className="hm-testimonial__product">
              <img src="/images/creabeast.png" alt="Product" />
            </div>
          </div>

          <div className="hm-testimonial__right">
            <div className="hm-testimonial__stars" id="testimonial-stars">
              ★★★★★
            </div>
            <blockquote
              className="hm-testimonial__quote"
              id="testimonial-quote"
            >
              "THE FACILITIES HERE ARE TOP-NOTCH AND THE STAFF IS ALWAYS
              FRIENDLY AND HELPFUL. I'VE NEVER FELT MORE CONFIDENT"
            </blockquote>
            <div className="hm-testimonial__footer">
              <div className="hm-testimonial__author">
                <span className="hm-testimonial__quote-icon">❝</span>
                <div>
                  <p className="hm-testimonial__name" id="testimonial-name">
                    EMERSON ANDERSON
                  </p>
                  <p className="hm-testimonial__role" id="testimonial-role">
                    15th batch student
                  </p>
                </div>
              </div>
              <div className="hm-testimonial__nav">
                <button
                  className="hm-testimonial__nav-btn"
                  id="prev-testimonial"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                </button>
                <button
                  className="hm-testimonial__nav-btn hm-testimonial__nav-btn--active"
                  id="next-testimonial"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <polyline points="19 12 12 19 5 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Marquee />

      {/* MERCHANDISE */}
      <section className="hm-section hm-merch">
        <div className="hm-section__head">
          <h2 className="hm-section__heading">OUR MERCHANDISE</h2>
        </div>
        <div className="hm-merch__grid">
          {merchandiseItems.map((item, i) => (
            <div key={i} className="hm-merch__item">
              <div className="hm-merch__img">
                <img src={item.img} alt={item.label} loading="lazy" />
              </div>
              <p className="hm-merch__label">{item.label}</p>
              <p className="hm-trust__sub">{item.sub}</p>
              <a
                href="#"
                className="hm-merch__link"
                onClick={(e) => nav("shop", null, e)}
              >
                shop now
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* MARQUEE 2 */}
      {/* MARQUEE - SUPPLEMENTS & MERCHANDISE TOGETHER */}
      <div className="hm-marquee hm-marquee--dark">
        <div className="hm-marquee__track">
          <span className="hm-marquee__word hm-marquee__word--supplement">
            SUPPLEMENTS
          </span>
          <span className="hm-marquee__word hm-marquee__word--merchandise">
            MERCHANDISE
          </span>
          <span className="hm-marquee__word hm-marquee__word--supplement">
            SUPPLEMENTS
          </span>
          <span className="hm-marquee__word hm-marquee__word--merchandise">
            MERCHANDISE
          </span>
          <span className="hm-marquee__word hm-marquee__word--supplement">
            SUPPLEMENTS
          </span>
          <span className="hm-marquee__word hm-marquee__word--merchandise">
            MERCHANDISE
          </span>
          <span className="hm-marquee__word hm-marquee__word--supplement">
            SUPPLEMENTS
          </span>
          <span className="hm-marquee__word hm-marquee__word--merchandise">
            MERCHANDISE
          </span>
        </div>
      </div>

      {/* BLOG */}
      <section className="hm-section hm-blog">
        <div className="hm-section__head">
          <h2 className="hm-section__heading">READ THE LATEST</h2>
          <a
            href="#"
            className="hm-view-all"
            onClick={(e) => nav("blog", null, e)}
          >
            <span>view all posts</span>
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
          </a>
        </div>
        <div className="hm-blog__grid">
          {blogPosts.map((post, i) => (
            <div key={i} className="hm-blog__pair">
              <div className="hm-blog__img">
                <img src={post.img} alt={post.title} loading="lazy" />
              </div>
              <div className="hm-blog__text">
                <span className="hm-blog__cat">{post.cat}</span>
                <h3 className="hm-blog__title">{post.title}</h3>
                <p className="hm-blog__excerpt">{post.excerpt}</p>
                <a
                  href="#"
                  className="hm-blog__more"
                  onClick={(e) => nav("blog", null, e)}
                >
                  Read more
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Posts />

      <Footer />
    </>
  );
}
