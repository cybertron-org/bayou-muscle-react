import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "../Blog/blog.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Marquee from "../../components/Marquee";
import useUserBlogs from "../../hooks/useUserBlogs";

const formatDate = (dateString) => {
  if (!dateString) {
    return "--";
  }

  const parsed = new Date(dateString.replace(" ", "T"));
  if (Number.isNaN(parsed.getTime())) {
    return dateString;
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function BlogDetails() {
  const { slug } = useParams();
  const { getUserBlogDetails, isLoading, error } = useUserBlogs();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadDetails = async () => {
      if (!slug) {
        setBlog(null);
        return;
      }

      const details = await getUserBlogDetails(slug);
      if (isMounted) {
        setBlog(details);
      }
    };

    loadDetails();

    return () => {
      isMounted = false;
    };
  }, [getUserBlogDetails, slug]);

  const go = (page, detailSlug, e) => {
    if (e) e.preventDefault();
    const actualSlug = typeof detailSlug === "object" ? null : detailSlug;
    if (window.__navigate) window.__navigate(page, actualSlug);
  };

  const descriptionHtml = useMemo(() => {
    if (blog?.description) {
      return blog.description;
    }
    return "<p>No content available.</p>";
  }, [blog]);

  return (
    <>
      <Header />
      <div className="blog-page">
        {/* ── BREADCRUMB ── bg #f4f4f4 */}
        <section className="blog-hero blog-hero--detail">
          <div className="blog-hero__inner">
            <nav className="blog-hero__breadcrumb">
              <span className="blog-bc-link" onClick={(e) => go("home", null, e)}>
                Home Page
              </span>
              <span className="blog-bc-sep"></span>
              <span className="blog-bc-link" onClick={(e) => go("blog", null, e)}>
                Blogs
              </span>
              <span className="blog-bc-sep"></span>
              <span className="blog-bc-current">{blog?.title || "Blog Details"}</span>
            </nav>
          </div>
        </section>

        {/* ── ARTICLE HEADER ── */}
        <div className="container">
          <div className="bd-header">
            <div className="bd-header__sidebar">
              <span className="bd-cat-badge">{blog?.category || "All Post"}</span>
            </div>
            <div className="bd-header__main">
              <h1 className="bd-title">{blog?.title || "Blog Details"}</h1>
              <div className="bd-meta">
                <span className="bd-meta__date">{formatDate(blog?.createdAt)}</span>
                <span className="bd-meta__divider" />
                <span className="bd-meta__by">
                  By <strong>admin</strong>
                </span>
              </div>
            </div>
          </div>

          {/* ── BANNER IMAGE ── */}
          <div className="bd-banner">
            <img
              src={blog?.image || "/blogs/D1.png"}
              alt={blog?.title || "Blog banner"}
              className="bd-banner__img"
            />
          </div>

          {/* ── ARTICLE CONTENT ── */}
          <div className="bd-content">
            {isLoading ? (
              <p className="bd-text">Loading blog details...</p>
            ) : error ? (
              <p className="bd-text">{error}</p>
            ) : (
              <>
                <p className="bd-text">{blog?.summary || ""}</p>
                <div className="bd-text" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
              </>
            )}

            {/* Tags */}
            <div className="bd-tags">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
              >
                <path
                  d="M6.38739 1.00708C6.80297 1.00708 7.15462 1.15094 7.44233 1.43865L12.8609 6.84125C13.2339 7.23552 13.4204 7.69905 13.4204 8.23185C13.4204 8.76466 13.2339 9.23885 12.8609 9.65443L8.6731 13.8422C8.26817 14.2152 7.80197 14.4017 7.2745 14.4017C6.74703 14.4017 6.2755 14.2152 5.85992 13.8422L0.441334 8.43965C0.153622 8.15194 0.00976562 7.79496 0.00976562 7.36872V2.49359C0.0310776 2.07801 0.174934 1.72636 0.441334 1.43865C0.739702 1.17225 1.09668 1.02839 1.51226 1.00708H6.38739ZM1.16061 7.72037L6.54723 13.123C6.74969 13.3148 6.98679 13.4107 7.25852 13.4107C7.53024 13.4107 7.77267 13.3148 7.98579 13.123L12.1416 8.96712C12.3228 8.76466 12.4134 8.52756 12.4134 8.25583C12.4134 7.9841 12.3228 7.74168 12.1416 7.52856L6.72305 2.15793C6.64846 2.05137 6.53657 1.99809 6.38739 1.99809H1.51226C1.20324 2.0194 1.03807 2.18457 1.01676 2.49359V7.36872C1.01676 7.5179 1.06471 7.63512 1.16061 7.72037ZM9.63214 1.15094C9.86658 0.948472 10.1063 0.937816 10.3514 1.11897L14.763 5.33875C15.5942 6.18057 16.0098 7.15293 16.0098 8.25583C16.0098 9.35873 15.5942 10.3258 14.763 11.1569L10.8789 14.8812C10.6338 15.0624 10.394 15.0517 10.1596 14.8492C9.97846 14.5935 9.98912 14.3537 10.1916 14.13L14.0757 10.4057C14.6937 9.77698 15.0028 9.0577 15.0028 8.24784C15.0028 7.43798 14.6937 6.7187 14.0757 6.09L9.66411 1.87022C9.46165 1.64644 9.45099 1.40668 9.63214 1.15094ZM3.25452 3.50059C3.71273 3.54321 3.96315 3.79363 4.00577 4.25183C3.96315 4.71004 3.71273 4.96046 3.25452 5.00308C2.79631 4.96046 2.5459 4.71004 2.50327 4.25183C2.5459 3.79363 2.79631 3.54321 3.25452 3.50059Z"
                  fill="black"
                />
              </svg>
              <span className="bd-tags__list">{blog?.category || "General"}</span>
            </div>

            {/* Post navigation */}
            {/* <div className="bd-post-nav">
              <div className="bd-post-nav__item">
                <img
                  src={imgAuthorThumb}
                  alt="Previous post"
                  className="bd-post-nav__img"
                />
                <div className="bd-post-nav__info">
                  <span className="bd-post-nav__label">
                    <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
                      <path
                        d="M15 7H1M7 1L1 7l6 6"
                        stroke="#a8a8a8"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    Previous Post
                  </span>
                  <span className="bd-post-nav__title">
                    The Importance of Vitamin D: Food Sources vs. Supplements
                  </span>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* ── MARQUEE ── */}
        <Marquee />
      </div>
      <Footer />
    </>
  );
}
