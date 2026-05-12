import { useEffect, useMemo } from 'react';
import DOMPurify from 'dompurify';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import useBlogs from '../../hooks/useBlogs';
import AdminLayout from '../layouts/AdminLayout';
import '../styles/admin-blog-details.css';

const formatDateTime = (value) => {
	if (!value) {
		return '--';
	}

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return '--';
	}

	return date.toLocaleString();
};

const resolveImageSrc = (path) => {
	const value = String(path || '').trim();
	if (!value) {
		return '';
	}

	if (value.startsWith('http://') || value.startsWith('https://')) {
		return value;
	}

	const normalized = value.startsWith('/') ? value.slice(1) : value;
	const apiBase = String(import.meta.env.VITE_APP_URL || '').replace(/\/api\/v\d+\/?$/, '');
	if (apiBase) {
		return `${apiBase}/${normalized}`;
	}

	return `/${normalized}`;
};

const getStatusMeta = (statusValue) => {
	const status = String(statusValue || '0');
	if (status === '1') {
		return { label: 'Published', className: 'admin-status--success' };
	}

	return { label: 'Draft', className: 'admin-status--neutral' };
};

const hasHtml = (value) => /<[^>]+>/.test(String(value || ''));

export default function AdminBlogDetails() {
	const navigate = useNavigate();
	const { blogId } = useParams();
	const { blogs, isLoading, error } = useBlogs();

	const blog = useMemo(
		() => blogs.find((item) => item.id === String(blogId || '')) || null,
		[blogs, blogId],
	);

	const safeDescriptionHtml = useMemo(() => {
		if (!blog?.description) {
			return '';
		}

		if (hasHtml(blog.description)) {
			return DOMPurify.sanitize(String(blog.description), {
				USE_PROFILES: { html: true },
			});
		}

		return '';
	}, [blog?.description]);

	const imageSrc = resolveImageSrc(blog?.image);
	const statusMeta = getStatusMeta(blog?.status);

	useEffect(() => {
		if (!error) {
			return;
		}

		toast.error(error);
	}, [error]);

	if (isLoading) {
		return (
			<AdminLayout title="Blog Details" subtitle="Complete blog content and metadata.">
				<section className="admin-card">
					<div className="admin-form-section-title">Blog Details</div>
					<div className="admin-preview-copy">Loading blog details...</div>
				</section>
			</AdminLayout>
		);
	}

	if (!blog) {
		return (
			<AdminLayout title="Blog Details" subtitle="Complete blog content and metadata.">
				<section className="admin-card">
					<div className="admin-placeholder admin-placeholder--compact">
						<div>
							<strong>Blog not found</strong>
							<div className="admin-preview-copy">The requested blog is unavailable or no longer exists.</div>
							<div className="admin-actions-row" style={{ marginTop: '14px', justifyContent: 'center' }}>
								<button className="admin-action-btn" type="button" onClick={() => navigate('/admin/blogs')}>
									Back to Blogs
								</button>
							</div>
						</div>
					</div>
				</section>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout title="Blog Details" subtitle="Complete blog content and metadata.">
			<section className="admin-card admin-blog-detail-card admin-blog-detail-card--polished">
				<div className="admin-card-head admin-blog-detail-head">
					<div className="admin-blog-heading">
						<div className="admin-card-kicker">Blog</div>
						<div className="admin-card-title admin-blog-title">{blog.title}</div>
						<div className="admin-card-subtitle admin-blog-subtitle">Slug: {blog.slug || '--'}</div>
					</div>
					<div className="admin-actions-row admin-blog-actions-row">
						<span className={`admin-status ${statusMeta.className}`}>{statusMeta.label}</span>
						<button className="admin-action-btn admin-action-btn--ghost" type="button" onClick={() => navigate(`/admin/blogs/${blog.id}/edit`)}>
							Edit Blog
						</button>
						<button className="admin-action-btn admin-action-btn--ghost" type="button" onClick={() => navigate('/admin/blogs')}>
							Back to List
						</button>
					</div>
				</div>

				<div className="admin-blog-detail-layout">
					<div className="admin-blog-main">
						{imageSrc ? (
							<div className="admin-blog-media-wrap">
								<img className="admin-blog-media" src={imageSrc} alt={blog.title} loading="lazy" />
							</div>
						) : (
							<div className="admin-placeholder admin-placeholder--compact">
								<div>
									<strong>No image</strong>
									<div className="admin-preview-copy">This blog does not have a featured image yet.</div>
								</div>
							</div>
						)}

						<article className="admin-blog-content">
							<section className="admin-blog-section">
								<h3 className="admin-form-section-title">Summary</h3>
								<p className="admin-blog-summary-copy">{blog.summary || '--'}</p>
							</section>

							<section className="admin-blog-section admin-blog-section--description">
								<h3 className="admin-form-section-title">Description</h3>
								{safeDescriptionHtml ? (
									<div className="admin-rich-content admin-blog-rich-content" dangerouslySetInnerHTML={{ __html: safeDescriptionHtml }} />
								) : (
									<div className="admin-blog-long-text">{blog.description || '--'}</div>
								)}
							</section>
						</article>
					</div>

					<aside className="admin-blog-meta-panel">
						<div className="admin-blog-meta-title">Meta</div>
						<div className="admin-blog-meta-item">
							<div className="admin-card-kicker">Blog ID</div>
							<div className="admin-list-title">#{blog.id}</div>
						</div>
						<div className="admin-blog-meta-item">
							<div className="admin-card-kicker">Category ID</div>
							<div className="admin-list-title">{blog.categoryId || '--'}</div>
						</div>
						<div className="admin-blog-meta-item">
							<div className="admin-card-kicker">Created At</div>
							<div className="admin-list-subtitle">{formatDateTime(blog.createdAt)}</div>
						</div>
						<div className="admin-blog-meta-item">
							<div className="admin-card-kicker">Updated At</div>
							<div className="admin-list-subtitle">{formatDateTime(blog.updatedAt)}</div>
						</div>
					</aside>
				</div>
			</section>
		</AdminLayout>
	);
}
