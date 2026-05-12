import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useBlogs from '../../hooks/useBlogs';
import AdminLayout from '../layouts/AdminLayout';

const pageSize = 10;

const formatDate = (value) => {
	if (!value) {
		return '--';
	}

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return '--';
	}

	return date.toLocaleDateString();
};

const truncate = (value, length = 90) => {
	const text = String(value || '').trim();
	if (!text) {
		return '--';
	}

	if (text.length <= length) {
		return text;
	}

	return `${text.slice(0, length)}...`;
};

const getStatusMeta = (statusValue) => {
	const status = String(statusValue || '0');
	if (status === '1') {
		return { label: 'Published', className: 'admin-status--success' };
	}

	return { label: 'Draft', className: 'admin-status--neutral' };
};

export default function AdminBlogs() {
	const navigate = useNavigate();
	const { blogs, isLoading, error, deleteExistingBlog } = useBlogs();

	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [deletingBlogId, setDeletingBlogId] = useState('');
	const [openActionMenu, setOpenActionMenu] = useState(null);

	const filteredBlogs = useMemo(() => {
		const query = searchTerm.trim().toLowerCase();
		if (!query) {
			return blogs;
		}

		return blogs.filter((blog) =>
			[blog.title, blog.summary, blog.slug]
				.some((value) => String(value || '').toLowerCase().includes(query)),
		);
	}, [blogs, searchTerm]);

	const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / pageSize));

	const paginatedBlogs = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return filteredBlogs.slice(start, start + pageSize);
	}, [filteredBlogs, currentPage]);

	useEffect(() => {
		if (!error) {
			return;
		}

		toast.error(error);
	}, [error]);

	useEffect(() => {
		if (currentPage > totalPages) {
			setCurrentPage(totalPages);
		}
	}, [currentPage, totalPages]);

	useEffect(() => {
		if (!openActionMenu) {
			return undefined;
		}

		const closeOnOutsideClick = (event) => {
			if (!event.target.closest('.admin-action-menu-wrap')) {
				setOpenActionMenu(null);
			}
		};

		const closeOnEscape = (event) => {
			if (event.key === 'Escape') {
				setOpenActionMenu(null);
			}
		};

		document.addEventListener('mousedown', closeOnOutsideClick);
		window.addEventListener('keydown', closeOnEscape);

		return () => {
			document.removeEventListener('mousedown', closeOnOutsideClick);
			window.removeEventListener('keydown', closeOnEscape);
		};
	}, [openActionMenu]);

	const toggleActionMenu = (event, blogId) => {
		event.stopPropagation();
		setOpenActionMenu((previous) => (previous === blogId ? null : blogId));
	};

	const isMenuOpen = (blogId) => openActionMenu === blogId;

	const openPreviewFromMenu = (event, blogId) => {
		event.stopPropagation();
		setOpenActionMenu(null);
		navigate(`/admin/blogs/${blogId}`);
	};

	const openEditFromMenu = (event, blogId) => {
		event.stopPropagation();
		setOpenActionMenu(null);
		navigate(`/admin/blogs/${blogId}/edit`);
	};

	const handleDeleteBlog = async (event, blog) => {
		event.stopPropagation();
		if (!blog?.id || deletingBlogId) {
			return;
		}

		const confirmed = window.confirm(`Delete "${blog.title}"? This action cannot be undone.`);
		if (!confirmed) {
			return;
		}

		setDeletingBlogId(String(blog.id));
		try {
			await deleteExistingBlog(blog.id);
			setOpenActionMenu(null);
			toast.success('Blog deleted successfully.');
		} catch (err) {
			toast.error(err?.message || 'Failed to delete blog.');
		} finally {
			setDeletingBlogId('');
		}
	};

	if (isLoading) {
		return (
			<AdminLayout title="Blogs" subtitle="Editorial content, summaries, and publish status.">
				<section className="admin-card">
					<div className="admin-form-section-title">Blogs</div>
					<div className="admin-preview-copy">Loading blogs...</div>
				</section>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout title="Blogs" subtitle="Editorial content, summaries, and publish status.">
			<section className="admin-card">
				<div className="admin-card-head admin-card-head--categories">
					<div>
						<div className="admin-card-kicker">Content</div>
						<div className="admin-card-title">Blogs workspace</div>
						<div className="admin-card-subtitle">
							Essential list view for quick browsing. Click a blog row to open full details.
						</div>
					</div>

					<div className="admin-category-toolbar">
						<input
							className="admin-field admin-category-search"
							type="search"
							value={searchTerm}
							onChange={(event) => {
								setSearchTerm(event.target.value);
								setCurrentPage(1);
							}}
							placeholder="Search by title, summary, slug"
						/>
						<div className="admin-category-toolbar-actions">
							<button className="admin-action-btn admin-action-btn--ghost" type="button" onClick={() => navigate('/admin/blog-categories')}>
								Blog Categories
							</button>
							<button className="admin-action-btn" type="button" onClick={() => navigate('/admin/blogs/add')}>
								+ Add Blog
							</button>
							<div className="admin-chip">{filteredBlogs.length} blogs</div>
						</div>
					</div>
				</div>

				<div className="admin-table-wrap">
					<table className="admin-table">
						<thead>
							<tr>
								<th><strong>Title</strong></th>
								<th><strong>Summary</strong></th>
								<th><strong>Status</strong></th>
								<th><strong>Updated At</strong></th>
								<th><strong>Actions</strong></th>
							</tr>
						</thead>
						<tbody>
							{paginatedBlogs.length ? (
								paginatedBlogs.map((blog) => {
									const statusMeta = getStatusMeta(blog.status);
									return (
										<tr
											key={blog.id}
											className="admin-table-row--clickable"
											onClick={() => navigate(`/admin/blogs/${blog.id}`)}
										>
											<td data-label="Title">
												<strong>{blog.title}</strong>
											</td>
											<td data-label="Summary">{truncate(blog.summary, 120)}</td>
											<td data-label="Status">
												<span className={`admin-status ${statusMeta.className}`}>{statusMeta.label}</span>
											</td>
											<td data-label="Updated At">{formatDate(blog.updatedAt)}</td>
											<td data-label="Actions">
												<div className="admin-action-menu-wrap">
													<button
														className="admin-icon-btn admin-icon-btn--compact admin-icon-btn--ghost admin-kebab-btn"
														type="button"
														onClick={(event) => toggleActionMenu(event, blog.id)}
														aria-label={`Actions for ${blog.title}`}
														title={`Actions for ${blog.title}`}
													>
														<span className="admin-kebab-dots" aria-hidden="true">
															<span />
															<span />
															<span />
														</span>
													</button>
													{isMenuOpen(blog.id) ? (
														<div className="admin-action-menu">
															<button className="admin-action-menu-item" type="button" onClick={(event) => openPreviewFromMenu(event, blog.id)}>
																Preview
															</button>
															<button className="admin-action-menu-item" type="button" onClick={(event) => openEditFromMenu(event, blog.id)}>
																Edit
															</button>
															<button
																className="admin-action-menu-item admin-action-menu-item--danger"
																type="button"
																onClick={(event) => handleDeleteBlog(event, blog)}
																disabled={deletingBlogId === String(blog.id)}
															>
																{deletingBlogId === String(blog.id) ? 'Deleting...' : 'Delete'}
															</button>
														</div>
													) : null}
												</div>
											</td>
										</tr>
									);
								})
							) : (
								<tr>
									<td colSpan={5}>
										<div className="admin-preview-copy">No blogs matched your search.</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				<div className="admin-pagination-row">
					<div className="admin-preview-copy">
						Showing {paginatedBlogs.length ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, filteredBlogs.length)} of {filteredBlogs.length}
					</div>
					<div className="admin-pagination-controls">
						<button
							className="admin-action-btn admin-action-btn--ghost"
							type="button"
							onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
							disabled={currentPage === 1}
						>
							Prev
						</button>
						<span className="admin-status admin-status--neutral">Page {currentPage} / {totalPages}</span>
						<button
							className="admin-action-btn admin-action-btn--ghost"
							type="button"
							onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
							disabled={currentPage >= totalPages}
						>
							Next
						</button>
					</div>
				</div>
			</section>
		</AdminLayout>
	);
}
