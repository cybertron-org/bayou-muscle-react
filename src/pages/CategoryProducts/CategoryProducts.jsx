import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import '../Supplements/Supplements.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Posts from '../../components/Posts';
import Marquee from '../../components/Marquee';
import useCategories from '../../hooks/useCategories';
import useProducts from '../../hooks/useProducts';
import useCart from '../../hooks/useCart';

const imgStarFull = '/supplements/star.png';
const imgStarHalf = '/supplements/star.png';
const imgStarFull2 = '/supplements/star.png';
const imgStarEmpty = '/supplements/star.png';

const filterTabs = [
  'New Arrivals',
  'Best Sellers',
  'Health & Vitamins',
  'Featured',
  'Clearance',
];

const PRODUCTS_PER_PAGE = 8;

const formatTitleFromSlug = (slug = '') =>
  slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const formatPrice = (value) => {
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) {
    return `$${value}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numberValue);
};

function StarRating({ rating = 0 }) {
  const roundedRating = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div className="supp-stars">
      <img src={imgStarFull} alt="star" className="supp-star-img" />
      <img src={roundedRating > 1 ? imgStarFull2 : imgStarHalf} alt="star" className="supp-star-img" />
      <img src={roundedRating > 2 ? imgStarFull2 : imgStarEmpty} alt="star" className="supp-star-img" />
      <img src={roundedRating > 3 ? imgStarFull : imgStarEmpty} alt="star" className="supp-star-img" />
      <img src={roundedRating > 4 ? imgStarFull : imgStarEmpty} alt="star" className="supp-star-img" />
    </div>
  );
}

function ProductCard({ product, onAddToCart, onOpenProduct }) {
  const productRating = Number(product?.rating?.average ?? product?.rating?.stars ?? 0);
  const productRatingCount = Number(product?.rating?.count ?? 0);
  const productImage = product?.image || product?.images?.[0]?.image || '';
  const displayPrice = formatPrice(product?.price ?? product?.discountedPrice ?? '0');
  const displayOldPrice = product?.originalPrice ? formatPrice(product.originalPrice) : '';

  return (
    <div
      className="supp-card"
      role="button"
      tabIndex={0}
      onClick={() => onOpenProduct(product)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpenProduct(product);
        }
      }}
    >
      <div className="supp-card__inner">
        <div className="supp-card__header">
          <h3 className="supp-card__name">{product?.name || 'Untitled'}</h3>
          <p className="supp-card__cat">{product?.categoryTitle || 'Category'}</p>
          <div className="supp-card__rating-row">
            <StarRating rating={productRating} />
            <span className="supp-card__rating-text">
              <span className="supp-card__rating-num">{productRating.toFixed(1)}</span>
              <span className="supp-card__rating-count"> ({productRatingCount})</span>
            </span>
          </div>
        </div>

        <div className="supp-card__img-wrap">
          <img
            src={productImage || '/supplements/p1.png'}
            alt={product?.name || 'Product'}
            className="supp-card__img"
            loading="lazy"
          />
        </div>

        <div className="supp-card__footer">
          <div className="supp-card__price-col">
            <span className="supp-card__price">{displayPrice}</span>
            {displayOldPrice && (
              <span className="supp-card__old-price">{displayOldPrice}</span>
            )}
          </div>
          <div className="supp-card__badges">
            {product?.discountPercentage ? (
              <span className="supp-badge" style={{ borderColor: '#ee440e', color: '#ee440e' }}>
                Sale {product.discountPercentage}%
              </span>
            ) : null}
          </div>
        </div>

        <button
          className="supp-card__add-btn"
          aria-label="Add to cart"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onAddToCart(product);
          }}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}

export default function CategoryProducts() {
  const navigate = useNavigate();
  const { categorySlug = '' } = useParams();
  const { categories } = useCategories();
  const { products, isLoading, loadProductsByCategory } = useProducts({ autoLoad: false });
  const { addItemToCart } = useCart({ autoLoad: false });
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState('New Arrivals');
  const [viewMode, setViewMode] = useState('grid');

  const handleAddToCart = async (product) => {
    try {
      const result = await addItemToCart(product?.id, 1);
      if (result) {
        toast.success('Added to cart.');
      }
    } catch (err) {
      toast.error(err?.message || 'Unable to add item to cart.');
    }
  };

  const handleOpenProduct = (product) => {
    const target = product?.slug || product?.id;
    if (target) {
      navigate(`/product/${target}`);
    }
  };

  useEffect(() => {
    if (categorySlug) {
      setCurrentPage(1);
      loadProductsByCategory(categorySlug);
    }
  }, [categorySlug, loadProductsByCategory]);

  const categoryTitle =
    categories.find((category) => category.slug === categorySlug)?.title ||
    formatTitleFromSlug(categorySlug);

  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i += 1) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 4; i += 1) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 3; i <= totalPages; i += 1) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i += 1) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Header />

      <div className="supp-page">
        <section className="supp-hero">
          <div className="supp-hero__bg">
            <div className="supp-hero__title-wrap">
              <h1 className="supp-hero__title">{categoryTitle || 'Products'}</h1>
              <nav className="supp-hero__breadcrumb">
                <span
                  className="supp-hero__breadcrumb-link"
                  onClick={() => window.__navigate && window.__navigate('home')}
                >
                  Home Page
                </span>
                <span className="supp-hero__breadcrumb-sep">•</span>
                <span className="supp-hero__breadcrumb-current">{categoryTitle || 'Products'}</span>
              </nav>
            </div>
          </div>

          <div className="supp-hero__desc-wrap">
            <p className="supp-hero__desc">
              Browse products for {categoryTitle || 'this category'}.
            </p>
          </div>

          <div className="supp-hero__filters">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                className={`supp-filter-btn ${activeFilter === tab ? 'supp-filter-btn--active' : ''}`}
                onClick={() => handleFilterChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        <section className="supp-main">
          <div className="supp-toolbar">
            <div className="supp-toolbar__view">
              <button
                className={`supp-view-btn ${viewMode === 'grid' ? 'supp-view-btn--active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="0" y="0" width="7" height="7" rx="1" />
                  <rect x="9" y="0" width="7" height="7" rx="1" />
                  <rect x="0" y="9" width="7" height="7" rx="1" />
                  <rect x="9" y="9" width="7" height="7" rx="1" />
                </svg>
              </button>
              <button
                className={`supp-view-btn ${viewMode === 'list' ? 'supp-view-btn--active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="0" y="0" width="16" height="3" rx="1" />
                  <rect x="0" y="6" width="16" height="3" rx="1" />
                  <rect x="0" y="12" width="16" height="3" rx="1" />
                </svg>
              </button>
            </div>

            <p className="supp-toolbar__count">
              Showing {totalProducts === 0 ? 0 : startIndex + 1}–{Math.min(endIndex, totalProducts)} of {totalProducts} results
            </p>

            <div className="supp-toolbar__right">
              <div className="supp-select-wrap">
                <span className="supp-select-label">Default sorting</span>
                <svg className="supp-select-arrow" width="6" height="4" viewBox="0 0 6 4" fill="currentColor">
                  <path d="M0 0l3 4 3-4z" />
                </svg>
              </div>
              <div className="supp-select-wrap">
                <span className="supp-select-label supp-select-label--muted">Show</span>
                <span className="supp-select-val">{PRODUCTS_PER_PAGE}</span>
                <svg className="supp-select-arrow" width="6" height="4" viewBox="0 0 6 4" fill="currentColor">
                  <path d="M0 0l3 4 3-4z" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`supp-grid ${viewMode === 'list' ? 'supp-grid--list' : ''}`}>
            {!isLoading && currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onOpenProduct={handleOpenProduct}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="supp-pagination">
              <button
                className={`supp-page-btn supp-page-btn--prev ${currentPage === 1 ? 'disabled' : ''}`}
                onClick={prevPage}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <svg width="15" height="10" viewBox="0 0 15 10" fill="currentColor" style={{ transform: 'rotate(180deg)' }}>
                  <path d="M0 5h13M9 1l4 4-4 4" />
                </svg>
                <span />
              </button>

              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  className={`supp-page-btn ${page === currentPage ? 'supp-page-btn--active' : ''} ${page === '...' ? 'supp-page-btn--dots' : ''}`}
                  onClick={() => typeof page === 'number' && goToPage(page)}
                  disabled={page === '...'}
                >
                  {page}
                </button>
              ))}

              <button
                className={`supp-page-btn supp-page-btn--next ${currentPage === totalPages ? 'disabled' : ''}`}
                onClick={nextPage}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <span />
                <svg width="15" height="10" viewBox="0 0 15 10" fill="currentColor">
                  <path d="M0 5h13M9 1l4 4-4 4" />
                </svg>
              </button>
            </nav>
          )}
        </section>

        <Marquee />
        <Posts />
      </div>

      <Footer />
    </>
  );
}