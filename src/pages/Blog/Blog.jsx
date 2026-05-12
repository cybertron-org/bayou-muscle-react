import { useEffect, useState } from 'react';
import './blog.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Marquee from "../../components/Marquee";
import useUserBlogs from '../../hooks/useUserBlogs';

const imgBlog18 = '/blogs/bh.png';
const imgBlog17 = '/blogs/b2.png';
const imgBlog16 = '/blogs/b3.png';
const imgBlog15 = '/blogs/b4.png';
const imgBlog14 = '/blogs/b5.png';
const imgBlog13 = '/blogs/b6.png';
const imgBlog12 = '/blogs/b7.png';
const imgBlog11 = '/blogs/b8.png';

const ALL_POSTS = [
  { id: 1, img: imgBlog18, cat: 'All Post',     catType: 'all',       title: 'Can Supplements Help You Lose Weight? What Science Says',     desc: 'Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum.', date: 'September 14, 2024' },
  { id: 2, img: imgBlog17, cat: 'Fitness',       catType: 'fitness',   title: 'The Importance of Vitamin D: Food Sources vs. Supplements',     desc: 'Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum.', date: 'September 14, 2024' },
  { id: 3, img: imgBlog16, cat: 'Nutrition',     catType: 'nutrition', title: 'Essential Supplements for Vegans and Vegetarians',             desc: 'Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum.', date: 'September 14, 2024' },
  { id: 4, img: imgBlog15, cat: 'Tips & Tricks', catType: 'all',       title: 'How to Optimize Nutrient Absorption from Supplements',        desc: 'Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum.', date: 'September 14, 2024' },
  { id: 5, img: imgBlog14, cat: 'All Post',      catType: 'all',       title: 'Superfoods in Supplement Form: Are They Worth It?',           desc: 'Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum.', date: 'September 14, 2024' },
  { id: 6, img: imgBlog13, cat: 'Fitness',       catType: 'fitness',   title: 'The Impact of Nutrition on Mental Health: Supplements That Help', desc: 'Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum.', date: 'September 14, 2024' },
  { id: 7, img: imgBlog12, cat: 'Nutrition',     catType: 'nutrition', title: 'Natural Supplements for Boosting Energy and Reducing Fatigue', desc: 'Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum.', date: 'September 14, 2024' },
  { id: 8, img: imgBlog11, cat: 'Fitness',       catType: 'fitness',   title: 'Supplements for Athletes: Boosting Performance and Recovery', desc: 'Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum.', date: 'September 14, 2024' },
];

const TABS = ['All post', 'Nutrition', 'Fitness', 'Tips & Tricks', 'Supplement'];

export default function Blog() {
  const [activeTab, setActiveTab] = useState('All post');
  const [activePage, setActivePage] = useState(1);
  const { blogs, loadBlogs } = useUserBlogs();

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
    img: item.image || '/images/blog1.png',
    cat: item.category || 'All Post',
    catType: item.categorySlug || 'all',
    title: item.title,
    desc: item.summary,
    date: item.createdAt,
    slug: item.slug,
  }));

  const allPosts = apiPosts.length > 0 ? apiPosts : ALL_POSTS;

  const filtered = activeTab === 'All post'
    ? allPosts
    : allPosts.filter(p => p.cat === activeTab);

  const featuredPost = allPosts[0] || ALL_POSTS[0];

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
        <section className="blog-featured">
          <div className="blog-featured__inner">
            <div className="blog-featured__img-wrap">
             
              <img src={featuredPost.img} alt={featuredPost.title} className="blog-featured__img" />
              {/* <span className="blog-featured__cat">{featuredPost.cat}</span> */}
            </div>
            <div className="blog-featured__content">
               <span className="blog-featured__cat">{featuredPost.cat}</span>
              <h2 className="blog-featured__title">{featuredPost.title}</h2>
              <p className="blog-featured__desc">{featuredPost.desc}</p>
              <button
                className="blog-read-more"
                onClick={e => go('blogdetails', featuredPost.slug, e)}
              >
                Read More
              </button>
            </div>
          </div>
        </section>

        {/* ── TABS ── */}
        <section className="blog-tabs-section">
          <div className="blog-tabs-wrap">
            <nav className="blog-tabs" role="tablist" aria-label="Navigate using the Arrow keys.">
              {TABS.map(tab => (
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
              {filtered.map(post => (
                <div className="blog-card" key={post.id}>
                  <div className="blog-card__img-wrap">
                    <img src={post.img} alt={post.title} className="blog-card__img" loading="lazy" />
                    <span className="blog-card__cat">{post.cat}</span>
                  </div>
                  <div className="blog-card__body">
                    <h3 className="blog-card__title">{post.title}</h3>
                    <p className="blog-card__desc">{post.desc}</p>
                    <button
                      className="blog-read-more"
                      onClick={e => go('blogdetails', post.slug, e)}
                    >
                      Read More
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ── PAGINATION ── */}
            <div className="blog-pagination">
              {[1, 2, 3].map(n => (
                <button
                  key={n}
                  className={`blog-pg-btn${activePage === n ? ' blog-pg-btn--active' : ''}`}
                  onClick={() => setActivePage(n)}
                >
                  {n}
                </button>
              ))}
              <button className="blog-pg-btn blog-pg-btn--next" onClick={() => setActivePage(p => Math.min(3, p + 1))}>
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                  <path d="M1 5h12M8 1l4 4-4 4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* ── MARQUEE ── */}
       
  <Marquee />
      </div>
      <Footer />
    </>
  );
}
