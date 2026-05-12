import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import useBlogs from '../../hooks/useBlogs';
import AdminLayout from '../layouts/AdminLayout';

const pageSize = 10;

const emptyForm = {
	title: '',
	status: '1',
};

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

const getStatusMeta = (statusValue) => {
	const normalized = String(statusValue || '0');
	if (normalized === '1') {
		return { label: 'Active', className: 'admin-status--success' };
	}

	return { label: 'Inactive', className: 'admin-status--neutral' };
};

export default function AdminBlogCategory() {
	const { error, fetchCategories, addCategory, editCategory, deleteExistingCategory } = useBlogs();
	const [categories, setCategories] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMode, setModalMode] = useState('add');
	const [form, setForm] = useState(emptyForm);
	const [editingCategory, setEditingCategory] = useState(null);
	const [formError, setFormError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [openActionMenu, setOpenActionMenu] = useState(null);
	const [deletingCategoryId, setDeletingCategoryId] = useState('');
    
	useEffect(() => {
		let active = true;

		const loadCategories = async () => {
			setIsLoading(true);
			try {
				const items = await fetchCategories();
				if (active) {
					setCategories(Array.isArray(items) ? items : []);
				}
			} finally {
				if (active) {
					setIsLoading(false);
				}
			}
		};

		loadCategories();

		return () => {
			active = false;
		};
	}, [fetchCategories]);

	useEffect(() => {
		if (!error) {
			return;
		}

		toast.error(error);
	}, [error]);



	useEffect(() => {
		if (!isModalOpen) {
			return undefined;
		}

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		const onKeyDown = (event) => {
			if (event.key === 'Escape') {
				setIsModalOpen(false);
				setEditingCategory(null);
				setForm(emptyForm);
				setFormError('');
			}
		};

		window.addEventListener('keydown', onKeyDown);
		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener('keydown', onKeyDown);
		};
	}, [isModalOpen]);

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

	const reloadCategories = async () => {
		const items = await fetchCategories();
		setCategories(Array.isArray(items) ? items : []);
	};

	const openAddModal = () => {
		setModalMode('add');
		setEditingCategory(null);
		setForm(emptyForm);
		setFormError('');
		setIsModalOpen(true);
	};

	const openEditModal = (category) => {
		setOpenActionMenu(null);
		setModalMode('edit');
		setEditingCategory(category);
		setForm({
			title: category.title || '',
			status: String(category.status || '1'),
		});
		setFormError('');
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setModalMode('add');
		setEditingCategory(null);
		setForm(emptyForm);
		setFormError('');
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const title = form.title.trim();
		if (!title) {
			setFormError('Enter a category title.');
			toast.error('Enter a category title.');
			return;
		}

		setIsSubmitting(true);
		try {
			if (modalMode === 'add') {
				await addCategory({ title, status: form.status });
				toast.success('Blog category created successfully.');
			} else if (editingCategory?.id) {
				await editCategory(editingCategory.id, { title, status: form.status });
				toast.success('Blog category updated successfully.');
			}

			await reloadCategories();
			closeModal();
		} catch (err) {
			const message = err?.message || 'Failed to save blog category.';
			setFormError(message);
			toast.error(message);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async (event, category) => {
		event.stopPropagation();
		if (!category?.id || deletingCategoryId) {
			return;
		}

		const confirmed = window.confirm(`Delete "${category.title}"? This cannot be undone.`);
		if (!confirmed) {
			return;
		}

		setDeletingCategoryId(category.id);
		try {
			await deleteExistingCategory(category.id);
			await reloadCategories();
			setOpenActionMenu(null);
			toast.success('Blog category deleted successfully.');
		} catch (err) {
			toast.error(err?.message || 'Failed to delete blog category.');
		} finally {
			setDeletingCategoryId('');
		}
	};

	const toggleActionMenu = (event, categoryId) => {
		event.stopPropagation();
		setOpenActionMenu((previous) => (previous === categoryId ? null : categoryId));
	};

	const isMenuOpen = (categoryId) => openActionMenu === categoryId;

	const filteredCategories = useMemo(() => {
		const query = searchTerm.trim().toLowerCase();
		if (!query) {
			return categories;
		}

		return categories.filter((category) =>
			[category.title, category.slug, category.status].some((value) => String(value || '').toLowerCase().includes(query)),
		);
	}, [categories, searchTerm]);
    

	const totalPages = Math.max(1, Math.ceil(filteredCategories.length / pageSize));
	const paginatedCategories = useMemo(() => {
		const startIndex = (currentPage - 1) * pageSize;
		return filteredCategories.slice(startIndex, startIndex + pageSize);
	}, [filteredCategories, currentPage]);

    	useEffect(() => {
		if (currentPage > totalPages) {
			setCurrentPage(totalPages);
		}
	}, [currentPage, totalPages]);

	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm]);

	if (isLoading) {
		return (
			<AdminLayout title="Blog Categories" subtitle="Manage blog category titles and status.">
				<section className="admin-card">
					<div className="admin-form-section-title">Blog Categories</div>
					<div className="admin-preview-copy">Loading blog categories...</div>
				</section>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout title="Blog Categories" subtitle="Manage blog category titles and status.">
			<section className="admin-card">
				<div className="admin-card-head admin-card-head--categories">
					<div>
						<div className="admin-card-kicker">Content</div>
						<div className="admin-card-title">Blog categories</div>
						<div className="admin-card-subtitle">
							Create, edit, and delete blog categories from a single modal-driven table.
						</div>
					</div>

					<div className="admin-category-toolbar">
						<input
							className="admin-field admin-category-search"
							type="search"
							value={searchTerm}
							onChange={(event) => setSearchTerm(event.target.value)}
							placeholder="Search by title, slug, or status"
						/>
						<div className="admin-category-toolbar-actions">
							<button className="admin-action-btn" type="button" onClick={openAddModal}>
								+ Add Category
							</button>
							<div className="admin-chip">{filteredCategories.length} categories</div>
						</div>
					</div>
				</div>

				<div className="admin-table-wrap">
					<table className="admin-table">
						<thead>
							<tr>
								<th><strong>Title</strong></th>
								<th><strong>Slug</strong></th>
								<th><strong>Status</strong></th>
								<th><strong>Created At</strong></th>
								<th><strong>Updated At</strong></th>
								<th><strong>Actions</strong></th>
							</tr>
						</thead>
						<tbody>
							{paginatedCategories.length ? (
								paginatedCategories.map((category) => {
									const statusMeta = getStatusMeta(category.status);

									return (
										<tr key={category.id}>
											<td data-label="Title">
												<strong>{category.title}</strong>
											</td>
											<td data-label="Slug">{category.slug || '--'}</td>
											<td data-label="Status">
												<span className={`admin-status ${statusMeta.className}`}>{statusMeta.label}</span>
											</td>
											<td data-label="Created At">{formatDate(category.createdAt)}</td>
											<td data-label="Updated At">{formatDate(category.updatedAt)}</td>
											<td data-label="Actions">
												<div className="admin-action-menu-wrap">
													<button
														className="admin-icon-btn admin-icon-btn--compact admin-icon-btn--ghost admin-kebab-btn"
														type="button"
														onClick={(event) => toggleActionMenu(event, category.id)}
														aria-label={`Actions for ${category.title}`}
														title={`Actions for ${category.title}`}
													>
														<span className="admin-kebab-dots" aria-hidden="true">
															<span />
															<span />
															<span />
														</span>
													</button>
													{isMenuOpen(category.id) ? (
														<div className="admin-action-menu">
															<button className="admin-action-menu-item" type="button" onClick={() => openEditModal(category)}>
																Edit
															</button>
															<button
																className="admin-action-menu-item admin-action-menu-item--danger"
																type="button"
																onClick={(event) => handleDelete(event, category)}
																disabled={deletingCategoryId === category.id}
															>
																{deletingCategoryId === category.id ? 'Deleting...' : 'Delete'}
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
									<td colSpan={6}>
										<div className="admin-preview-copy">No blog categories matched your search.</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				<div className="admin-pagination-row">
					<div className="admin-preview-copy">
						Showing {paginatedCategories.length ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, filteredCategories.length)} of {filteredCategories.length}
					</div>
					<div className="admin-pagination-controls">
						<button className="admin-action-btn admin-action-btn--ghost" type="button" onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1}>
							Prev
						</button>
						<span className="admin-status admin-status--neutral">
							Page {currentPage} / {totalPages}
						</span>
						<button className="admin-action-btn admin-action-btn--ghost" type="button" onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage >= totalPages}>
							Next
						</button>
					</div>
				</div>
			</section>

			{isModalOpen ? (
				<div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => {
					if (event.target === event.currentTarget) {
						closeModal();
					}
				}}>
					<form className="admin-modal" onSubmit={handleSubmit}>
						<div className="admin-modal-head">
							<div>
								<div className="admin-card-kicker">Blog categories</div>
								<div className="admin-card-title">{modalMode === 'add' ? 'Add category' : 'Edit category'}</div>
								<div className="admin-card-subtitle">Only title and status are required for blog categories.</div>
							</div>
							<button className="admin-icon-btn admin-modal-close" type="button" onClick={closeModal} aria-label="Close modal">
								×
							</button>
						</div>

						<div className="admin-modal-body">
							{formError ? <div className="admin-modal-error">{formError}</div> : null}

							<div className="admin-field-group admin-field-group--full">
								<label className="admin-field-label" htmlFor="blog-category-title">Title</label>
								<input
									id="blog-category-title"
									className="admin-field"
									value={form.title}
									onChange={(event) => setForm((previous) => ({ ...previous, title: event.target.value }))}
									placeholder="Category title"
									disabled={isSubmitting}
								/>
							</div>

							<div className="admin-field-group admin-field-group--full">
								<label className="admin-field-label" htmlFor="blog-category-status">Status</label>
								<select
									id="blog-category-status"
									className="admin-field"
									value={form.status}
									onChange={(event) => setForm((previous) => ({ ...previous, status: event.target.value }))}
									disabled={isSubmitting}
								>
									<option value="1">Active</option>
									<option value="0">Inactive</option>
								</select>
							</div>
						</div>

						<div className="admin-modal-actions">
							<button className="admin-action-btn admin-action-btn--ghost" type="button" onClick={closeModal} disabled={isSubmitting}>
								Cancel
							</button>
							<button className="admin-action-btn" type="submit" disabled={isSubmitting}>
								{isSubmitting ? 'Saving...' : modalMode === 'add' ? 'Create Category' : 'Update Category'}
							</button>
						</div>
					</form>
				</div>
			) : null}
		</AdminLayout>
	);
}
