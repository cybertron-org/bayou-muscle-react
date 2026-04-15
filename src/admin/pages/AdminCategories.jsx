import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../layouts/AdminLayout';
import useCategories from '../../hooks/useCategories';

const emptyCategoryForm = {
	type: 'parent',
	title: '',
	status: 'active',
	parentId: '',
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

export default function AdminCategories() {
	const [selectedCategoryId, setSelectedCategoryId] = useState('');
	const { categories, isLoading, error, addCategory, updateExistingCategory, deleteExistingCategory, refetch } = useCategories();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMode, setModalMode] = useState('add');
	const [editingTarget, setEditingTarget] = useState(null);
	const [openActionMenu, setOpenActionMenu] = useState(null);
	const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
	const [formError, setFormError] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const pageSize = 10;

	const selectedCategory = categories.find((item) => item.id === selectedCategoryId) || categories[0] || null;
	const availableParentCategories =
		editingTarget?.type === 'parent' && categoryForm.type === 'subcategory'
			? categories.filter((item) => item.id !== editingTarget.id)
			: categories;

	const allCategoryRows = useMemo(
		() =>
			categories.flatMap((parent) => [
				{
					rowKey: `parent-${parent.id}`,
					type: 'parent',
					id: parent.id,
					parentId: null,
					title: parent.title,
					parentTitle: '--',
					status: parent.status,
					createdAt: parent.createdAt,
					updatedAt: parent.updatedAt,
				},
				...(parent.subcategories || []).map((child) => ({
					rowKey: `subcategory-${child.id}`,
					type: 'subcategory',
					id: child.id,
					parentId: parent.id,
					title: child.title,
					parentTitle: parent.title,
					status: child.status,
					createdAt: child.createdAt,
					updatedAt: child.updatedAt,
				})),
			]),
		[categories],
	);

	const filteredRows = useMemo(() => {
		const query = searchTerm.trim().toLowerCase();
		if (!query) {
			return allCategoryRows;
		}

		return allCategoryRows.filter((row) =>
			[row.title, row.parentTitle, row.status, row.type].some((value) =>
				String(value || '')
					.toLowerCase()
					.includes(query),
			),
		);
	}, [allCategoryRows, searchTerm]);

	const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
	const paginatedRows = useMemo(() => {
		const startIndex = (currentPage - 1) * pageSize;
		return filteredRows.slice(startIndex, startIndex + pageSize);
	}, [filteredRows, currentPage]);

	const resetModalState = () => {
		setIsModalOpen(false);
		setModalMode('add');
		setEditingTarget(null);
		setFormError('');
		setCategoryForm({
			...emptyCategoryForm,
			parentId: selectedCategory?.id || categories[0]?.id || emptyCategoryForm.parentId,
		});
	};

	useEffect(() => {
		if (!error) {
			return;
		}

		toast.error(error);
	}, [error]);

	useEffect(() => {
		if (!categories.length) {
			setSelectedCategoryId('');
			return;
		}

		const isSelectedValid = categories.some((item) => item.id === selectedCategoryId);
		if (!isSelectedValid) {
			setSelectedCategoryId(categories[0].id);
		}
	}, [categories, selectedCategoryId]);

	useEffect(() => {
		if (currentPage > totalPages) {
			setCurrentPage(totalPages);
		}
	}, [currentPage, totalPages]);

	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm]);

	const showFormError = (message) => {
		setFormError(message);
		toast.error(message);
	};

	useEffect(() => {
		if (!isModalOpen) {
			return undefined;
		}

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		const onKeyDown = (event) => {
			if (event.key === 'Escape') {
				resetModalState();
			}
		};

		window.addEventListener('keydown', onKeyDown);
		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener('keydown', onKeyDown);
		};
	}, [isModalOpen, selectedCategory?.id]);

	useEffect(() => {
		if (!openActionMenu) {
			return undefined;
		}

		const closeMenuOnOutsideClick = (event) => {
			const clickedInsideMenu = event.target.closest('.admin-action-menu-wrap');
			if (!clickedInsideMenu) {
				setOpenActionMenu(null);
			}
		};

		const closeMenuOnEscape = (event) => {
			if (event.key === 'Escape') {
				setOpenActionMenu(null);
			}
		};

		document.addEventListener('mousedown', closeMenuOnOutsideClick);
		window.addEventListener('keydown', closeMenuOnEscape);
		return () => {
			document.removeEventListener('mousedown', closeMenuOnOutsideClick);
			window.removeEventListener('keydown', closeMenuOnEscape);
		};
	}, [openActionMenu]);

	const openAddModal = () => {
		setModalMode('add');
		setEditingTarget(null);
		setFormError('');
		setCategoryForm({
			...emptyCategoryForm,
			parentId: selectedCategory?.id || categories[0]?.id || emptyCategoryForm.parentId,
		});
		setIsModalOpen(true);
	};

	const openEditModal = (target) => {
		setOpenActionMenu(null);

		if (target.type === 'parent') {
			const parent = categories.find((item) => item.id === target.id);
			if (!parent) {
				return;
			}

			setModalMode('edit');
			setEditingTarget({ type: 'parent', id: parent.id });
			setCategoryForm({
				type: 'parent',
				title: parent.title,
				status: parent.status,
				parentId: parent.id,
			});
			setFormError('');
			setIsModalOpen(true);
			return;
		}

		const parent = categories.find((item) => item.id === target.parentId);
		const subcategory = parent?.subcategories.find((item) => item.id === target.id);
		if (!parent || !subcategory) {
			return;
		}

		setModalMode('edit');
		setEditingTarget({ type: 'subcategory', parentId: parent.id, id: subcategory.id });
		setCategoryForm({
			type: 'subcategory',
			title: subcategory.title,
			status: subcategory.status,
			parentId: parent.id,
		});
		setFormError('');
		setIsModalOpen(true);
	};

	const handleSubmitCategory = async (event) => {
		event.preventDefault();

		const title = categoryForm.title.trim();
		if (!title) {
			showFormError('Enter a category title.');
			return;
		}

		if (modalMode === 'add') {
			if (isSubmitting) return;
			setIsSubmitting(true);

			try {
				if (categoryForm.type === 'parent') {
					const duplicateParent = categories.some((item) => item.title.toLowerCase() === title.toLowerCase());
					if (duplicateParent) {
						showFormError('A parent category with that title already exists.');
						setIsSubmitting(false);
						return;
					}

					const result = await addCategory({
						title,
						status: categoryForm.status,
						parentId: null,
					});

					setSelectedCategoryId(result.item.id);
					resetModalState();
					toast.success('Parent category added successfully.');
					setIsSubmitting(false);
					return;
				}

				const parentId = categoryForm.parentId || selectedCategory?.id;
				const parent = categories.find((item) => item.id === parentId);
				if (!parent) {
					showFormError('Choose a valid parent category.');
					setIsSubmitting(false);
					return;
				}

				const duplicateSubcategory = parent.subcategories.some((item) => item.title.toLowerCase() === title.toLowerCase());
				if (duplicateSubcategory) {
					showFormError('That subcategory already exists under the selected parent.');
					setIsSubmitting(false);
					return;
				}

				await addCategory({
					title,
					status: categoryForm.status,
					parentId,
				});

				setSelectedCategoryId(parentId);
				resetModalState();
				toast.success('Subcategory added successfully.');
				setIsSubmitting(false);
				return;
			} catch (err) {
				const errorMessage = err?.message || 'Failed to create category.';
				showFormError(errorMessage);
				setIsSubmitting(false);
				return;
			}

			setIsSubmitting(false);
			return;
		}

		if (!editingTarget) {
			showFormError('No category selected for editing.');
			return;
		}

		if (isSubmitting) return;
		setIsSubmitting(true);

		try {
			if (editingTarget.type === 'parent') {
				const currentParent = categories.find((item) => item.id === editingTarget.id);
				if (!currentParent) {
					showFormError('That category is no longer available.');
					setIsSubmitting(false);
					return;
				}

				if (categoryForm.type === 'parent') {
					const duplicateParent = categories.some(
						(item) => item.id !== currentParent.id && item.title.toLowerCase() === title.toLowerCase(),
					);
					if (duplicateParent) {
						showFormError('A parent category with that title already exists.');
						setIsSubmitting(false);
						return;
					}

					await updateExistingCategory(currentParent.id, {
						title,
						status: categoryForm.status,
						parentId: null,
					});
					setSelectedCategoryId(currentParent.id);
					resetModalState();
					toast.success('Parent category updated successfully.');
					setIsSubmitting(false);
					return;
				}

				const targetParentId = categoryForm.parentId || selectedCategory?.id;
				if (!targetParentId || targetParentId === currentParent.id) {
					showFormError('Choose a different parent category.');
					setIsSubmitting(false);
					return;
				}

				const targetParent = categories.find((item) => item.id === targetParentId);
				if (!targetParent) {
					showFormError('The selected parent category is no longer available.');
					setIsSubmitting(false);
					return;
				}

				const duplicateSubcategory = targetParent.subcategories.some((item) => item.title.toLowerCase() === title.toLowerCase());
				if (duplicateSubcategory) {
					showFormError('That subcategory already exists under the selected parent.');
					setIsSubmitting(false);
					return;
				}

				await updateExistingCategory(currentParent.id, {
					title,
					status: categoryForm.status,
					parentId: targetParentId,
				});
				setSelectedCategoryId(targetParentId);
				resetModalState();
				toast.success('Parent category converted and moved successfully.');
				setIsSubmitting(false);
				return;
			}

			const currentParent = categories.find((item) => item.id === editingTarget.parentId);
			const currentSubcategory = currentParent?.subcategories.find((item) => item.id === editingTarget.id);
			if (!currentParent || !currentSubcategory) {
				showFormError('That subcategory is no longer available.');
				setIsSubmitting(false);
				return;
			}

			if (categoryForm.type === 'subcategory') {
				const targetParentId = categoryForm.parentId || currentParent.id;
				const targetParent = categories.find((item) => item.id === targetParentId);
				if (!targetParent) {
					showFormError('The selected parent category is no longer available.');
					setIsSubmitting(false);
					return;
				}

				const duplicateSubcategory = targetParent.subcategories.some(
					(item) => item.id !== currentSubcategory.id && item.title.toLowerCase() === title.toLowerCase(),
				);
				if (duplicateSubcategory) {
					showFormError('That subcategory already exists under the selected parent.');
					setIsSubmitting(false);
					return;
				}

				await updateExistingCategory(currentSubcategory.id, {
					title,
					status: categoryForm.status,
					parentId: targetParentId,
				});
				setSelectedCategoryId(targetParentId);
				resetModalState();
				toast.success('Subcategory updated successfully.');
				setIsSubmitting(false);
				return;
			}

			const duplicateParent = categories.some((item) => item.title.toLowerCase() === title.toLowerCase());
			if (duplicateParent) {
				showFormError('A parent category with that title already exists.');
				setIsSubmitting(false);
				return;
			}

			const result = await updateExistingCategory(currentSubcategory.id, {
				title,
				status: categoryForm.status,
				parentId: null,
			});
			setSelectedCategoryId(result.item.id);
			resetModalState();
			toast.success('Category structure updated successfully.');
			setIsSubmitting(false);
			return;
		} catch (err) {
			const errorMessage = err?.message || 'Failed to update category.';
			showFormError(errorMessage);
			setIsSubmitting(false);
			return;
		}
	};

	const handleRemoveSubcategory = async (parentId, subcategoryId) => {
		if (isSubmitting) return;
		setIsSubmitting(true);
		setOpenActionMenu(null);

		try {
			const parent = categories.find((item) => item.id === parentId);
			const removedSubcategory = parent?.subcategories.find((subcategory) => subcategory.id === subcategoryId);
			await deleteExistingCategory(subcategoryId);
			toast.success(`${removedSubcategory?.title || 'Subcategory'} deleted successfully.`);
		} catch (err) {
			const errorMessage = err?.message || 'Failed to delete subcategory.';
			showFormError(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleRemoveParentCategory = async (parentId) => {
		if (isSubmitting) return;
		setIsSubmitting(true);
		setOpenActionMenu(null);

		try {
			const removedParent = categories.find((item) => item.id === parentId);
			const wasSelected = selectedCategoryId === parentId;
			await deleteExistingCategory(parentId);
			if (wasSelected) {
				setSelectedCategoryId('');
			}
			toast.success(`${removedParent?.title || 'Category'} deleted successfully.`);
		} catch (err) {
			const errorMessage = err?.message || 'Failed to delete category.';
			showFormError(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	const toggleActionMenu = (event, payload) => {
		event.stopPropagation();
		setOpenActionMenu((previous) => {
			if (!previous) {
				return payload;
			}

			const sameTarget =
				previous.type === payload.type &&
				previous.id === payload.id &&
				(previous.parentId || '') === (payload.parentId || '');

			return sameTarget ? null : payload;
		});
	};

	const isMenuOpen = (payload) =>
		!!openActionMenu &&
		openActionMenu.type === payload.type &&
		openActionMenu.id === payload.id &&
		(openActionMenu.parentId || '') === (payload.parentId || '');

	const handleEditParentClick = (event, itemId) => {
		event.stopPropagation();
		openEditModal({ type: 'parent', id: itemId });
	};

	const handleEditSubcategoryClick = (event, parentId, subcategoryId) => {
		event.stopPropagation();
		openEditModal({ type: 'subcategory', parentId, id: subcategoryId });
	};

	if (isLoading) {
		return (
			<AdminLayout title="Categories" subtitle="Manage parent categories and subcategories in one place.">
				<section className="admin-card">
					<div className="admin-form-section-title">Categories</div>
					<div className="admin-preview-copy">Loading categories...</div>
				</section>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout title="Categories" subtitle="Manage parent categories and subcategories in one place.">
			<section className="admin-card">
				<div className="admin-card-head admin-card-head--categories">
					<div>
						<div className="admin-card-kicker"></div>
						<div className="admin-card-title">Category table</div>
						<div className="admin-card-subtitle">
							All parent categories and subcategories are listed together with searchable, paginated rows.
						</div>
					</div>
					<div className="admin-category-toolbar">
						<input
							className="admin-field admin-category-search"
							type="search"
							value={searchTerm}
							onChange={(event) => setSearchTerm(event.target.value)}
							placeholder="Search by title, parent, status"
						/>
						<div className="admin-category-toolbar-actions">
							<button className="admin-action-btn" onClick={openAddModal} type="button">
								+ Add category
							</button>
							<button className="admin-action-btn admin-action-btn--ghost" onClick={refetch} type="button">
								Refresh
							</button>
						</div>
					</div>
				</div>

				<div className="admin-table-wrap">
					<table className="admin-table">
						<thead>
							<tr >
								<th ><strong>Title</strong></th>
								<th><strong>Parent</strong></th>
								<th><strong>Status</strong></th>
								<th><strong>Created At</strong></th>
								<th><strong>Updated At</strong></th>
								<th><strong>Actions</strong></th>
							</tr>
						</thead>
						<tbody>
							{paginatedRows.length ? (
								paginatedRows.map((row) => (
									<tr key={row.rowKey}>
										<td data-label="Title">
											{row.title}
										</td>
										<td data-label="Parent">
											{row.parentTitle === '--' ? (
												<span className="">-</span>
											) : (
												row.parentTitle
											)}
										</td>
										<td data-label="Status">
											<span className={`admin-status admin-status--${row.status === 'active' ? 'success' : 'warning'}`}>
												{row.status}
											</span>
										</td>
										<td data-label="Created At">{formatDate(row.createdAt)}</td>
										<td data-label="Updated At">{formatDate(row.updatedAt)}</td>
										<td data-label="Actions">
											<div className="admin-action-menu-wrap">
												<button
													className="admin-icon-btn admin-icon-btn--compact admin-icon-btn--ghost admin-kebab-btn"
													onClick={(event) =>
														toggleActionMenu(
															event,
															row.type === 'parent'
																? { type: 'parent', id: row.id }
																: { type: 'subcategory', parentId: row.parentId, id: row.id },
														)
													}
													type="button"
													aria-label={`Actions for ${row.title}`}
													title={`Actions for ${row.title}`}
												>
													<span className="admin-kebab-dots" aria-hidden="true">
														<span />
														<span />
														<span />
													</span>
												</button>
												{isMenuOpen(
													row.type === 'parent'
														? { type: 'parent', id: row.id }
														: { type: 'subcategory', parentId: row.parentId, id: row.id },
												) ? (
													<div className="admin-action-menu">
														<button
															className="admin-action-menu-item"
															onClick={(event) =>
																row.type === 'parent'
																	? handleEditParentClick(event, row.id)
																	: handleEditSubcategoryClick(event, row.parentId, row.id)
															}
															type="button"
														>
															Edit
														</button>
														<button
															className="admin-action-menu-item admin-action-menu-item--danger"
															onClick={(event) => {
																event.stopPropagation();
																if (row.type === 'parent') {
																	handleRemoveParentCategory(row.id);
																	return;
																}
																handleRemoveSubcategory(row.parentId, row.id);
															}}
															type="button"
														>
															Delete
														</button>
													</div>
												) : null}
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={6}>
										<div className="admin-preview-copy">No categories matched your search.</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				<div className="admin-pagination-row">
					<div className="admin-preview-copy">
						Showing {paginatedRows.length ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, filteredRows.length)} of {filteredRows.length}
					</div>
					<div className="admin-pagination-controls">
						<button
							className="admin-action-btn admin-action-btn--ghost"
							type="button"
							onClick={() => setCurrentPage((previous) => Math.max(1, previous - 1))}
							disabled={currentPage === 1}
						>
							Prev
						</button>
						<span className="admin-status admin-status--neutral">
							Page {currentPage} / {totalPages}
						</span>
						<button
							className="admin-action-btn admin-action-btn--ghost"
							type="button"
							onClick={() => setCurrentPage((previous) => Math.min(totalPages, previous + 1))}
							disabled={currentPage >= totalPages}
						>
							Next
						</button>
					</div>
				</div>
			</section>

			{isModalOpen ? (
				<div className="admin-modal-backdrop" onClick={resetModalState} role="presentation">
					<div className="admin-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="category-modal-title">
						<div className="admin-modal-head">
							<div>
								<div className="admin-card-kicker">{modalMode === 'edit' ? 'Edit category' : 'Create category'}</div>
								<div className="admin-card-title" id="category-modal-title">{modalMode === 'edit' ? 'Edit category' : 'Add category'}</div>
								<div className="admin-card-subtitle">Choose whether this should be a new parent category or a subcategory under an existing parent.</div>
							</div>
							<button className="admin-icon-btn admin-modal-close" onClick={resetModalState} type="button" aria-label="Close modal">
								×
							</button>
						</div>

						<form className="admin-modal-body" onSubmit={handleSubmitCategory}>
							<div className="admin-field-group">
								<span className="admin-field-label">Category type</span>
								<div className="admin-toggle-group" role="radiogroup" aria-label="Category type">
									<button className={`admin-toggle-btn ${categoryForm.type === 'parent' ? 'is-active' : ''}`} onClick={() => setCategoryForm((previous) => ({ ...previous, type: 'parent' }))} type="button">
										Parent category
									</button>
									<button
										className={`admin-toggle-btn ${categoryForm.type === 'subcategory' ? 'is-active' : ''}`}
										onClick={() => setCategoryForm((previous) => ({
											...previous,
											type: 'subcategory',
											parentId:
												editingTarget?.type === 'parent'
														? categories.find((item) => item.id !== editingTarget.id)?.id || previous.parentId || selectedCategory?.id || categories[0]?.id || ''
														: previous.parentId || selectedCategory?.id || categories[0]?.id || '',
										}))}
										type="button"
									>
										Subcategory
									</button>
								</div>
							</div>

							<div className="admin-field-group">
								<label className="admin-field-label" htmlFor="categoryTitle">Title</label>
								<input
									className="admin-field"
									id="categoryTitle"
									placeholder={categoryForm.type === 'parent' ? 'Ex: Apparel' : 'Ex: Tank Tops'}
									type="text"
									value={categoryForm.title}
									onChange={(event) => setCategoryForm((previous) => ({ ...previous, title: event.target.value }))}
								/>
							</div>

							<div className="admin-field-group">
								<label className="admin-field-label" htmlFor="categoryStatus">Status</label>
								<select
									className="admin-field"
									id="categoryStatus"
									value={categoryForm.status}
									onChange={(event) => setCategoryForm((previous) => ({ ...previous, status: event.target.value }))}
								>
									<option value="active">Active</option>
									<option value="inactive">Inactive</option>
								</select>
							</div>

							{categoryForm.type === 'subcategory' ? (
								<div className="admin-field-group">
									<label className="admin-field-label" htmlFor="parentCategory">Parent category</label>
									<select
										className="admin-field"
										id="parentCategory"
										value={categoryForm.parentId}
										onChange={(event) => setCategoryForm((previous) => ({ ...previous, parentId: event.target.value }))}
									>
										{availableParentCategories.map((item) => (
											<option key={item.id} value={item.id}>
												{item.title}
											</option>
										))}
									</select>
								</div>
							) : null}

							{formError ? <div className="admin-modal-error">{formError}</div> : null}

							<div className="admin-modal-actions">
								<button className="admin-action-btn admin-action-btn--ghost" onClick={resetModalState} type="button">
									Cancel
								</button>
								<button className="admin-action-btn" type="submit" disabled={isSubmitting}>
									{isSubmitting ? 'Saving...' : modalMode === 'edit' ? 'Update category' : 'Save category'}
								</button>
							</div>
						</form>
					</div>
				</div>
			) : null}
		</AdminLayout>
	);
}
