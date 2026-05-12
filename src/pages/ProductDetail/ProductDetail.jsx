import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from 'react-hot-toast';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./Product-Detail.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Posts from "../../components/Posts";
import Marquee from "../../components/Marquee";
import useUserProducts from "../../hooks/useUserProducts";
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';

const imgPayPng = "/products/pay.png";
const fallbackProductImage = "/products/bp.png";

const fallbackRelatedProducts = [
  {
    id: 1,
    slug: null,
    name: "HORSE POWER X",
    cat: "Digestion",
    price: "$144.99",
    img: "/products/horse-power.png",
    oldPrice: null,
    badge: null,
  },
  {
    id: 2,
    slug: null,
    name: "MuscleBlaze BCAA Gold",
    cat: "Health Support",
    price: "$310.39",
    img: "/products/muscleblaze.png",
    oldPrice: null,
    badge: null,
  },
  {
    id: 3,
    slug: null,
    name: "Nutrex HMB 1000",
    cat: "Health Support",
    price: "$293.84",
    img: "/products/nutrex.png",
    oldPrice: null,
    badge: null,
  },
];

export default function ProductDetail() {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const { getProduct, addReview, fetchReviews, addToWishlist } = useUserProducts();
  const { isAuthenticated } = useAuth();
  const { addItemToCart } = useCart({ autoLoad: false });

  const [activeThumb, setActiveThumb] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [reviewPage, setReviewPage] = useState(1);
  const REVIEWS_PER_PAGE = 5;

  const productSlug = slug || id || "";

  const galleryImages = useMemo(() => {
    if (product?.img) {
      return [product.img];
    }
    return [fallbackProductImage];
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (Array.isArray(product?.relatedProducts) && product.relatedProducts.length > 0) {
      return product.relatedProducts;
    }
    return fallbackRelatedProducts;
  }, [product]);

  const reviewsList = reviews;

  const ratingStats = useMemo(() => {
    const total = reviewsList.length;
    const avg = total > 0 ? reviewsList.reduce((s, r) => s + r.rating, 0) / total : 0;
    const counts = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviewsList.filter((r) => r.rating === star).length,
      pct: total > 0 ? (reviewsList.filter((r) => r.rating === star).length / total) * 100 : 0,
    }));
    return { total, avg, counts };
  }, [reviewsList]);

  const totalReviewPages = Math.ceil(reviewsList.length / REVIEWS_PER_PAGE);
  const paginatedReviews = useMemo(() => {
    const start = (reviewPage - 1) * REVIEWS_PER_PAGE;
    return reviewsList.slice(start, start + REVIEWS_PER_PAGE);
  }, [reviewsList, reviewPage, REVIEWS_PER_PAGE]);

  const descriptionHtml = product?.description || "<p>No description available.</p>";
  const additionalInfoHtml =
    product?.additionalInfo || "<p>No additional info available.</p>";

  const loadProductReviews = async (productId) => {
    if (!productId) {
      setReviews([]);
      return;
    }

    setIsReviewsLoading(true);
    try {
      const items = await fetchReviews(productId);
      const normalized = Array.isArray(items)
        ? items
            .filter((review) => review?.status === 'approved' || !review?.status)
            .map((review) => ({
              id: String(review?.id || ''),
              reviewerName: review?.user?.full_name || 'Verified user',
              rating: Number(review?.rating ?? 0),
              review: review?.review || 'No comment',
              createdAt: review?.created_at || null,
            }))
        : [];
      setReviews(normalized);
      setReviewPage(1);
    } catch {
      setReviews([]);
    } finally {
      setIsReviewsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadProductDetails = async () => {
      if (!productSlug) {
        setErrorMessage("Product slug is missing.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const details = await getProduct(productSlug);
        if (isMounted) {
          setProduct(details);
          setActiveThumb(0);
          setActiveTab("description");
          await loadProductReviews(details?.id);
        }
      } catch {
        if (isMounted) {
          setProduct(null);
          setErrorMessage("We could not load this product right now.");
          setReviews([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProductDetails();

    return () => {
      isMounted = false;
    };
  }, [getProduct, productSlug]);

  const goToPage = (path) => {
    navigate(path);
  };

  const goToProduct = (targetSlug) => {
    if (!targetSlug) {
      return;
    }
    navigate(`/product/${targetSlug}`);
  };

  const handleAddToCart = async () => {
    try {
      const result = await addItemToCart(product?.id, qty);
      if (result) {
        toast.success('Added to cart.');
      }
    } catch (err) {
      toast.error(err?.message || 'Unable to add item to cart.');
    }
  };

  const handleBuyNow = () => {
    addItemToCart(product?.id, qty).catch(() => {});
    navigate('/my-cart');
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!product?.id || isAddingToWishlist) return;

    setIsAddingToWishlist(true);
    try {
      await addToWishlist(product.id);
      setIsWishlisted(true);
      toast.success('Added to wishlist.');
    } catch (err) {
      toast.error(err?.message || 'Unable to add to wishlist.');
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const nextReview = reviewText.trim();
    if (!product?.id) {
      toast.error('Product information is not available.');
      return;
    }
    if (!nextReview) {
      toast.error('Please write a review before submitting.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      await addReview({
        product_id: Number(product.id),
        review: nextReview,
        rating: Number(reviewRating),
      });
      toast.success('Review submitted successfully.');
      setReviewText('');
      setReviewRating(5);
      await loadProductReviews(product.id);
    } catch (err) {
      toast.error(err?.message || 'Unable to submit review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <>
      <Header />

      <div className="pd-page">
        <div className="pd-breadcrumb">
          <div className="pd-breadcrumb__inner">
            <span className="pd-bc-link" onClick={() => goToPage("/home")}>
              Home Page
            </span>
            <span className="pd-bc-sep">�</span>
            <span className="pd-bc-link" onClick={() => goToPage("/supplements")}>
              Supplements
            </span>
            <span className="pd-bc-sep">�</span>
            <span className="pd-bc-current">{product?.name || "Product Details"}</span>
          </div>
        </div>

        {isLoading ? (
          <div className="pd-main">
            <p className="pd-tab-p">Loading product details...</p>
          </div>
        ) : errorMessage ? (
          <div className="pd-main">
            <div className="pd-info">
              <p className="pd-tab-p">{errorMessage}</p>
              <button className="pd-buy-btn" onClick={() => goToPage("/shop")}>
                Back to Shop
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="pd-main">
              <div className="pd-gallery">
                <div className="pd-thumbs">
                  {galleryImages.map((img, i) => (
                    <button
                      key={`thumb-${i}`}
                      className={`pd-thumb${activeThumb === i ? " pd-thumb--active" : ""}`}
                      onClick={() => setActiveThumb(i)}
                    >
                      <img src={img} alt={`View ${i + 1}`} />
                    </button>
                  ))}
                </div>
                <div className="pd-main-img">
                  <img
                    src={galleryImages[activeThumb] || fallbackProductImage}
                    alt={product?.name || "Product"}
                  />
                </div>
              </div>

              <div className="pd-info">
                {product?.badge && (
                  <div className="pd-sale-badge">Sale {product.badge.replace("-", "")}</div>
                )}

                <h1 className="pd-title">{product?.name || "Untitled Product"}</h1>

                <div className="pd-meta">
                  <div className="pd-brands">
                    <span className="pd-brands__label">Category:</span>
                    <span className="pd-brands__link">{product?.cat || "General"}</span>
                  </div>
                  <div className="pd-stock">
                    <span className="pd-stock__dot" />
                    <span className="pd-stock__text">In stock</span>
                  </div>
                </div>

                <div className="pd-price-row">
                  <span className="pd-price">{product?.price || "$0.00"}</span>
                  {product?.oldPrice && <span className="pd-price-old">{product.oldPrice}</span>}
                </div>

                <p className="pd-short-desc">
                  {product?.summary || product?.description || "No summary available."}
                </p>

                <div className="pd-cart-row">
                  <div className="pd-qty">
                    <button
                      className="pd-qty__btn"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                    >
                      -
                    </button>
                    <span className="pd-qty__val">{qty}</span>
                    <button className="pd-qty__btn" onClick={() => setQty((q) => q + 1)}>
                      +
                    </button>
                  </div>

                  <button className="pd-add-btn" type="button" onClick={handleAddToCart}>Add to cart</button>
                  <button className="pd-icon-btn" aria-label="Add to wishlist" onClick={handleAddToWishlist} disabled={isAddingToWishlist}>
                    <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
                      <path
                        d="M8 13S1 8.5 1 4.5a3.5 3.5 0 0 1 7-0C8.5 3.667 9 3 10.5 3a3.5 3.5 0 0 1 4.5 1.5C15 8.5 8 13 8 13z"
                        stroke={isWishlisted ? "#ee440e" : "#000"}
                        fill={isWishlisted ? "#ee440e" : "none"}
                        strokeWidth="1.5"
                      />
                    </svg>
                  </button>
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

                <button className="pd-buy-btn" onClick={handleBuyNow}>Buy It Now</button>

                <div className="pd-guarantee">
                  <p className="pd-guarantee__label">Guarantee Safe &amp; Secure Checkout</p>
                  <div className="pd-pay-img">
                    <img
                      src={imgPayPng}
                      alt="Accepted payment methods"
                      width="350"
                      height="35"
                    />
                  </div>
                </div>

                <div className="pd-meta-footer">
                  <p className="pd-meta-line">
                    <span className="pd-muted-label">SKU: </span>
                    <strong>PRD-{product?.id || "NA"}</strong>
                  </p>
                  <p className="pd-meta-line">
                    <span className="pd-muted-label">Category: </span>
                    <strong>{product?.cat || "General"}</strong>
                  </p>
                  <p className="pd-meta-line">
                    <span className="pd-muted-label">Tags: </span>
                    <span className="pd-tag">{product?.categorySlug || "product"}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="pd-lower">
              <div className="pd-tabs-area">
                <div className="pd-tabs-bar">
                  {[
                    { key: "description", label: "Description" },
                    { key: "additional", label: "Additional information" },
                    { key: "reviews", label: `Reviews (${reviewsList.length})` },
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

                <div className="pd-tab-content">
                  {activeTab === "description" && (
                    <div className="pd-tab-description">
                      <h3 className="pd-tab-h3">Product Description</h3>
                      <div
                        className="pd-tab-p"
                        dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                      />
                    </div>
                  )}

                  {activeTab === "additional" && (
                    <div className="pd-tab-additional">
                      <table className="pd-info-table">
                        <tbody>
                          <tr>
                            <td className="pd-info-label">Category</td>
                            <td>{product?.cat || "General"}</td>
                          </tr>
                          <tr>
                            <td className="pd-info-label">Product URL</td>
                            <td>{product?.url || "N/A"}</td>
                          </tr>
                          <tr>
                            <td className="pd-info-label">Additional Info</td>
                            <td>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: additionalInfoHtml,
                                }}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeTab === "reviews" && (
                    <div className="">
                      {/* ── Write a review form ── */}
                      <form className="pd-review-form" onSubmit={handleSubmitReview}>
                        <h4 className="pd-review-form__title">Write a Review</h4>
                        <div className="pd-review-form__row">
                          <label className="pd-review-form__label">Your Rating</label>
                          <div className="pd-star-picker">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                className={`pd-star-pick${(hoverRating || reviewRating) >= star ? " pd-star-pick--on" : ""}`}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setReviewRating(star)}
                                disabled={isSubmittingReview}
                                aria-label={`Rate ${star} out of 5`}
                              >
                                ★
                              </button>
                            ))}
                            <span className="pd-star-pick__label">
                              {(hoverRating || reviewRating)}/5
                            </span>
                          </div>
                        </div>
                        <div className="pd-review-form__row">
                          <label htmlFor="pd-review" className="pd-review-form__label">Your Review</label>
                          <textarea
                            id="pd-review"
                            className="pd-review-form__textarea"
                            placeholder="Share your experience with this product…"
                            value={reviewText}
                            onChange={(event) => setReviewText(event.target.value)}
                            disabled={isSubmittingReview}
                            rows={4}
                          />
                        </div>
                        <button type="submit" className="pd-review-form__submit" disabled={isSubmittingReview}>
                          {isSubmittingReview ? 'Submitting…' : 'Submit Review'}
                        </button>
                      </form>

                      {/* ── Reviews summary + list ── */}
                      {isReviewsLoading ? (
                        <p className="pd-tab-p">Loading reviews…</p>
                      ) : reviewsList.length > 0 ? (
                        <>
                          {/* Summary bar */}
                          <div className="pd-reviews-summary">
                            <div className="pd-reviews-summary__score">
                              <span className="pd-reviews-summary__avg">{ratingStats.avg.toFixed(1)}</span>
                              <div className="pd-reviews-summary__stars">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <span
                                    key={s}
                                    className={`pd-star-display${ratingStats.avg >= s ? " pd-star-display--full" : ratingStats.avg >= s - 0.5 ? " pd-star-display--half" : ""}`}
                                  >★</span>
                                ))}
                              </div>
                              <span className="pd-reviews-summary__count">{ratingStats.total} review{ratingStats.total !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="pd-reviews-summary__bars">
                              {ratingStats.counts.map(({ star, count, pct }) => (
                                <div key={star} className="pd-rating-bar-row">
                                  <span className="pd-rating-bar-row__label">{star} ★</span>
                                  <div className="pd-rating-bar-row__track">
                                    <div className="pd-rating-bar-row__fill" style={{ width: `${pct}%` }} />
                                  </div>
                                  <span className="pd-rating-bar-row__count">{count}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Review cards */}
                          <div className="pd-reviews-list">
                            {paginatedReviews.map((review) => (
                              <div key={review.id} className="pd-review-card">
                                <div className="pd-review-card__header">
                                  <div className="pd-review-card__avatar">
                                    {review.reviewerName.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="pd-review-card__meta">
                                    <span className="pd-review-card__name">{review.reviewerName}</span>
                                    {review.createdAt && (
                                      <span className="pd-review-card__date">
                                        {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                      </span>
                                    )}
                                  </div>
                                  <div className="pd-review-card__stars">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                      <span key={s} className={`pd-star-display${review.rating >= s ? " pd-star-display--full" : ""}`}>★</span>
                                    ))}
                                  </div>
                                </div>
                                <p className="pd-review-card__text">{review.review}</p>
                              </div>
                            ))}
                          </div>

                          {/* Pagination */}
                          {totalReviewPages > 1 && (
                            <div className="pd-reviews-pagination">
                              <button
                                className="pd-reviews-pagination__btn"
                                onClick={() => setReviewPage((p) => Math.max(1, p - 1))}
                                disabled={reviewPage === 1}
                              >
                                ← Prev
                              </button>
                              {Array.from({ length: totalReviewPages }, (_, i) => i + 1).map((pg) => (
                                <button
                                  key={pg}
                                  className={`pd-reviews-pagination__btn${reviewPage === pg ? " pd-reviews-pagination__btn--active" : ""}`}
                                  onClick={() => setReviewPage(pg)}
                                >
                                  {pg}
                                </button>
                              ))}
                              <button
                                className="pd-reviews-pagination__btn"
                                onClick={() => setReviewPage((p) => Math.min(totalReviewPages, p + 1))}
                                disabled={reviewPage === totalReviewPages}
                              >
                                Next →
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="pd-reviews-empty">
                          <span className="pd-reviews-empty__icon">★</span>
                          <p className="pd-reviews-empty__text">No reviews yet. Be the first to share your experience!</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="pd-popular">
                <div className="pd-popular__head">
                  <h3 className="pd-popular__title">
                    <span>Popular </span>
                    <span className="pd-popular__title--muted">Products</span>
                  </h3>
                </div>
                <div className="pd-popular__list">
                  {relatedProducts.slice(0, 3).map((p) => (
                    <div
                      key={`${p.id}-${p.slug || "fallback"}`}
                      className="pd-popular-item"
                      onClick={() => goToProduct(p.slug)}
                      role="button"
                      tabIndex={p.slug ? 0 : -1}
                      onKeyDown={(event) => {
                        if (p.slug && (event.key === "Enter" || event.key === " ")) {
                          event.preventDefault();
                          goToProduct(p.slug);
                        }
                      }}
                    >
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
                </div>              </div>
            </div>

            <section className="hm-section hm-latest">
              <div className="hm-section__head">
                <h2 className="hm-section__heading">Related Products</h2>
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
                  {relatedProducts.map((p) => (
                    <SwiperSlide key={`related-slide-${p.id}-${p.slug || "x"}`}>
                      <div className="hm-latest-card" onClick={() => goToProduct(p.slug)}>
                        {p.badge && <span className="hm-badge">{p.badge}</span>}
                        <div className="hm-latest-card__body">
                          <p className="hm-latest-card__name">{p.name}</p>
                          <p className="hm-latest-card__cat">{p.cat}</p>
                          <div className="hm-latest-card__img">
                            <img src={p.img} alt={p.name} loading="lazy" />
                          </div>
                          <div className="hm-latest-card__footer">
                            <span className="hm-latest-card__price">{p.price}</span>
                            {p.oldPrice && <span className="hm-feat-card__old">{p.oldPrice}</span>}
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </section>
          </>
        )}

        <Marquee />
        <Posts />
      </div>

      <Footer />
    </>
  );
}
