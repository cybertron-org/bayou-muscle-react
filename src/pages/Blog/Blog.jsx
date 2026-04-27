import { useEffect, useState } from 'react';
import './blog.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Marquee from "../../components/Marquee";
import useUserBlogs from '../../hooks/useUserBlogs';

const POSTS_PER_PAGE = 6;

export default function Blog() {
  const [activeTab, setActiveTab] = useState('All post');
  const [activePage, setActivePage] = useState(1);
  const { blogs, isLoading, error, loadBlogs } = useUserBlogs();

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const go = (page, slug, e) => {
    if (e) e.preventDefault();
    const actualSlug = typeof slug === 'object' ? null : slug;
    if (window.__navigate) window.__navigate(page, actualSlug);
  };

  const apiPosts = blogs.map((item) => ({
    id: Number(item.id),
    img: item.image || '',
    cat: item.category || 'Uncategorized',
    catType: item.categorySlug || '',
    title: item.title,
    desc: item.summary,
    date: item.createdAt,
    slug: item.slug,
  }));

  const allPosts = apiPosts;

  const tabs = [
    'All post',
    ...Array.from(
      new Set(
        allPosts
          .map((post) => post.cat)
          .filter(Boolean)
      )
    ),
  ];

  const filtered = activeTab === 'All post'
    ? allPosts
    : allPosts.filter(p => p.cat === activeTab);

  const featuredPost = allPosts[0] || null;
  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const paginatedPosts = filtered.slice((activePage - 1) * POSTS_PER_PAGE, activePage * POSTS_PER_PAGE);

  useEffect(() => {
    if (activePage > totalPages) {
      setActivePage(totalPages);
    }
  }, [activePage, totalPages]);

  return (
    <>
      <Header />
      <div className="blog-page">

        {/* ── HERO TITLE ── bg #f4f4f4, Lato Black 100px */}
        <section className="blog-hero">
          <div className="blog-hero__inner">
            <h1 className="blog-hero__title">Blog</h1>
            <nav className="blog-hero__breadcrumb">
              <span className="blog-bc-link" onClick={e => go('home', null, e)}>Home Page</span>
              <span className="blog-bc-sep">•</span>
              <span className="blog-bc-current">Blog</span>
            </nav>
          </div>
        </section>

        {/* ── FEATURED POST ── large card left image + right text */}
        {featuredPost && (
          <section className="blog-featured">
            <div className="blog-featured__inner">
              {featuredPost.img ? (
                <div className="blog-featured__img-wrap">
                  <img src={featuredPost.img} alt={featuredPost.title} className="blog-featured__img" />
                </div>
              ) : null}
              <div className="blog-featured__content">
                <span className="blog-featured__cat">{featuredPost.cat}</span>
                <h2 className="blog-featured__title">{featuredPost.title}</h2>
                <p className="blog-featured__desc">{featuredPost.desc}</p>
                <button
                  className="blog-read-more"
                  onClick={e => go('blogdetails', featuredPost.slug, e)}
                  disabled={!featuredPost.slug}
                >
                  Read More
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ── TABS ── */}
        <section className="blog-tabs-section">
          <div className="blog-tabs-wrap">
            <nav className="blog-tabs" role="tablist" aria-label="Navigate using the Arrow keys.">
              {tabs.map(tab => (
                <button
                  key={tab}
                  role="tab"
                  className={`blog-tab${activeTab === tab ? ' blog-tab--active' : ''}`}
                  onClick={() => { setActiveTab(tab); setActivePage(1); }}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </section>

        {/* ── BLOG GRID ── 3-col, card h=300px image + text */}
        <section className="blog-grid-section">
          <div className="blog-grid-inner">
            <div className="blog-grid">
              {isLoading ? (
                <p className="blog-card__desc">Loading blogs...</p>
              ) : error ? (
                <p className="blog-card__desc">{error}</p>
              ) : paginatedPosts.length === 0 ? (
                <p className="blog-card__desc">Loading blogs...</p>
              ) : paginatedPosts.map(post => (
                <div className="blog-card" key={post.id}>
                  <div className="blog-card__img-wrap">
                    {post.img ? <img src={post.img} alt={post.title} className="blog-card__img" loading="lazy" /> : null}
                    <span className="blog-card__cat">{post.cat}</span>
                  </div>
                  <div className="blog-card__body">
                    <h3 className="blog-card__title">{post.title}</h3>
                    <p className="blog-card__desc">{post.desc}</p>
                    <button
                      className="blog-read-more"
                      onClick={e => go('blogdetails', post.slug, e)}
                      disabled={!post.slug}
                    >
                      Read More
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ── PAGINATION ── */}
            {!isLoading && !error && totalPages > 1 ? (
              <div className="blog-pagination">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((n) => (
                  <button
                    key={n}
                    className={`blog-pg-btn${activePage === n ? ' blog-pg-btn--active' : ''}`}
                    onClick={() => setActivePage(n)}
                  >
                    {n}
                  </button>
                ))}
                <button
                  className="blog-pg-btn blog-pg-btn--next"
                  onClick={() => setActivePage((p) => Math.min(totalPages, p + 1))}
                  disabled={activePage === totalPages}
                >
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                    <path d="M1 5h12M8 1l4 4-4 4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ) : null}
          </div>
        </section>

        {/* ── MARQUEE ── */}
       
  <Marquee />
      </div>
      <Footer />
    </>
  );
}
