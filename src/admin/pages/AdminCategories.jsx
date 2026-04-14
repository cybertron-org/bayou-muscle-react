import { useEffect, useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';

const initialCategories = [
	{
		id: 'supplement',
		title: 'Supplement',
		status: 'active',
		subcategories: [
			{ id: 'supplement-protein', title: 'Protein', status: 'active' },
			{ id: 'supplement-pre-workout', title: 'Pre-Workout', status: 'active' },
			{ id: 'supplement-recovery', title: 'Recovery', status: 'inactive' },
			{ id: 'supplement-vitamins', title: 'Vitamins', status: 'active' },
		],
	},
	{
		id: 'merchandise',
		title: 'Merchandise',
		status: 'active',
		subcategories: [
			{ id: 'merchandise-t-shirts', title: 'T-Shirts', status: 'active' },
			{ id: 'merchandise-hoodies', title: 'Hoodies', status: 'active' },
			{ id: 'merchandise-accessories', title: 'Accessories', status: 'inactive' },
			{ id: 'merchandise-gym-bags', title: 'Gym Bags', status: 'active' },
		],
	},
];

const emptyCategoryForm = {
	type: 'parent',
	title: '',
	status: 'active',
	parentId: 'supplement',
};

const createSlug = (value) =>
	value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

const createId = (prefix, value) => `${prefix}-${createSlug(value)}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

export default function AdminCategories() {
	const [selectedCategoryId, setSelectedCategoryId] = useState('supplement');
	const [categories, setCategories] = useState(initialCategories);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMode, setModalMode] = useState('add');
	const [editingTarget, setEditingTarget] = useState(null);
	const [openActionMenu, setOpenActionMenu] = useState(null);
	const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
	const [formError, setFormError] = useState('');

	const selectedCategory = categories.find((item) => item.id === selectedCategoryId) || categories[0] || null;
	const availableParentCategories =
		editingTarget?.type === 'parent' && categoryForm.type === 'subcategory'
			? categories.filter((item) => item.id !== editingTarget.id)
			: categories;

	const resetModalState = () => {
		setIsModalOpen(false);
		setModalMode('add');
		setEditingTarget(null);
		setFormError('');
		setCategoryForm({
			...emptyCategoryForm,
			parentId: selectedCategory?.id || emptyCategoryForm.parentId,
		});
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
			parentId: selectedCategory?.id || emptyCategoryForm.parentId,
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

	const handleSubmitCategory = (event) => {
		event.preventDefault();

		const title = categoryForm.title.trim();
		if (!title) {
			setFormError('Enter a category title.');
			return;
		}

		if (modalMode === 'add') {
			if (categoryForm.type === 'parent') {
				const duplicateParent = categories.some((item) => item.title.toLowerCase() === title.toLowerCase());
				if (duplicateParent) {
					setFormError('A parent category with that title already exists.');
					return;
				}

				const newParentId = createId('parent', title);
				setCategories((previous) => [
					...previous,
					{
						id: newParentId,
						title,
						status: categoryForm.status,
						description: 'New parent category created from the admin modal.',
						subcategories: [],
					},
				]);
				setSelectedCategoryId(newParentId);
				resetModalState();
				return;
			}

			const parentId = categoryForm.parentId || selectedCategory?.id;
			const parent = categories.find((item) => item.id === parentId);
			if (!parent) {
				setFormError('Choose a valid parent category.');
				return;
			}

			const duplicateSubcategory = parent.subcategories.some((item) => item.title.toLowerCase() === title.toLowerCase());
			if (duplicateSubcategory) {
				setFormError('That subcategory already exists under the selected parent.');
				return;
			}

			setCategories((previous) =>
				previous.map((item) =>
					item.id === parentId
						? {
							...item,
							subcategories: [
								...item.subcategories,
								{
									id: createId(parentId, title),
									title,
									status: categoryForm.status,
								},
							],
						}
						: item,
				),
			);
			setSelectedCategoryId(parentId);
			resetModalState();
			return;
		}

		if (editingTarget?.type === 'parent') {
			const currentParent = categories.find((item) => item.id === editingTarget.id);
			if (!currentParent) {
				setFormError('That category is no longer available.');
				return;
			}

			if (categoryForm.type === 'parent') {
				const duplicateParent = categories.some(
					(item) => item.id !== currentParent.id && item.title.toLowerCase() === title.toLowerCase(),
				);
				if (duplicateParent) {
					setFormError('A parent category with that title already exists.');
					return;
				}

				setCategories((previous) =>
					previous.map((item) =>
						item.id === currentParent.id
							? {
								...item,
								title,
								status: categoryForm.status,
							}
							: item,
					),
				);
				setSelectedCategoryId(currentParent.id);
				resetModalState();
				return;
			}

			const targetParentId = categoryForm.parentId || selectedCategory?.id;
			if (!targetParentId || targetParentId === currentParent.id) {
				setFormError('Choose a different parent category.');
				return;
			}

			const targetParent = categories.find((item) => item.id === targetParentId);
			if (!targetParent) {
				setFormError('The selected parent category is no longer available.');
				return;
			}

			const duplicateSubcategory = targetParent.subcategories.some((item) => item.title.toLowerCase() === title.toLowerCase());
			if (duplicateSubcategory) {
				setFormError('That subcategory already exists under the selected parent.');
				return;
			}

			const movedSubcategory = {
				id: createId(targetParentId, title),
				title,
				status: categoryForm.status,
			};

			setCategories((previous) =>
				previous.reduce((accumulator, item) => {
					if (item.id === currentParent.id) {
						return accumulator;
					}

					if (item.id === targetParentId) {
						accumulator.push({
							...item,
							subcategories: [...item.subcategories, movedSubcategory],
						});
						return accumulator;
					}

					accumulator.push(item);
					return accumulator;
				}, []),
			);
			setSelectedCategoryId(targetParentId);
			resetModalState();
			return;
		}

		const currentParent = categories.find((item) => item.id === editingTarget?.parentId);
		const currentSubcategory = currentParent?.subcategories.find((item) => item.id === editingTarget?.id);
		if (!currentParent || !currentSubcategory) {
			setFormError('That subcategory is no longer available.');
			return;
		}

		if (categoryForm.type === 'subcategory') {
			const targetParentId = categoryForm.parentId || currentParent.id;
			const targetParent = categories.find((item) => item.id === targetParentId);
			if (!targetParent) {
				setFormError('The selected parent category is no longer available.');
				return;
			}

			const duplicateSubcategory = targetParent.subcategories.some(
				(item) => item.id !== currentSubcategory.id && item.title.toLowerCase() === title.toLowerCase(),
			);
			if (duplicateSubcategory) {
				setFormError('That subcategory already exists under the selected parent.');
				return;
			}

			setCategories((previous) =>
				previous.map((item) => {
					if (item.id === currentParent.id && currentParent.id === targetParentId) {
						return {
							...item,
							subcategories: item.subcategories.map((subcategory) =>
								subcategory.id === currentSubcategory.id ? { ...subcategory, title, status: categoryForm.status } : subcategory,
							),
						};
					}

					if (item.id === currentParent.id) {
						return {
							...item,
							subcategories: item.subcategories.filter((subcategory) => subcategory.id !== currentSubcategory.id),
						};
					}

					if (item.id === targetParentId) {
						return {
							...item,
							subcategories: [...item.subcategories, { id: currentSubcategory.id, title, status: categoryForm.status }],
						};
					}

					return item;
				}),
			);
			setSelectedCategoryId(targetParentId);
			resetModalState();
			return;
		}

		const duplicateParent = categories.some((item) => item.id !== currentParent.id && item.title.toLowerCase() === title.toLowerCase());
		if (duplicateParent) {
			setFormError('A parent category with that title already exists.');
			return;
		}

		const newParentId = createId('parent', title);
		setCategories((previous) =>
			previous
				.map((item) => {
					if (item.id === currentParent.id) {
						return {
							...item,
							subcategories: item.subcategories.filter((subcategory) => subcategory.id !== currentSubcategory.id),
						};
					}

					return item;
				})
				.concat({
					id: newParentId,
					title,
					status: categoryForm.status,
					description: 'New parent category created from the admin modal.',
					subcategories: [],
				}),
		);
		setSelectedCategoryId(newParentId);
		resetModalState();
	};

	const handleRemoveSubcategory = (subcategoryId) => {
		setOpenActionMenu(null);
		setCategories((previous) =>
			previous.map((item) => {
				if (item.id !== selectedCategory?.id) {
					return item;
				}

				return {
					...item,
					subcategories: item.subcategories.filter((subcategory) => subcategory.id !== subcategoryId),
				};
			}),
		);
	};

	const handleRemoveParentCategory = (parentId) => {
		setOpenActionMenu(null);
		setCategories((previous) => previous.filter((item) => item.id !== parentId));
		if (selectedCategoryId === parentId) {
			const fallbackCategory = categories.find((item) => item.id !== parentId);
			setSelectedCategoryId(fallbackCategory?.id || '');
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

	const categoryCards = categories.map((item, index) => ({
		key: item.id,
		title: item.title,
		count: item.subcategories.length,
		status: item.status,
		accent: index % 2 === 0 ? 'admin-category-card--supplement' : 'admin-category-card--merchandise',
	}));

	return (
		<AdminLayout title="Categories" subtitle="Manage parent categories and subcategories in one place.">
			<section className="admin-card">
				<div className="admin-card-head">
					<div>
						<div className="admin-card-kicker">Catalog structure</div>
						<div className="admin-card-title">Category manager</div>
						<div className="admin-card-subtitle">
							Keep the category tree clean. Add and edit categories from the modal, then manage the existing structure below.
						</div>
					</div>
					<div className="admin-actions-row" style={{ marginLeft: 'auto' }}>
						<button className="admin-action-btn" onClick={openAddModal} type="button">
							+ Add category
						</button>
					</div>
				</div>

				<div className="admin-category-grid">
					{categoryCards.map((item) => (
						<button
							className={`admin-category-card ${item.accent} ${selectedCategoryId === item.key ? 'is-active' : ''}`}
							key={item.key}
							onClick={() => setSelectedCategoryId(item.key)}
							type="button"
						>
							<div className="admin-category-card-top">
								<div>
									<div className="admin-category-card-label">Parent category</div>
									<div className="admin-category-card-title">{item.title}</div>
								</div>
								<div className="admin-category-card-meta">
									<div className="admin-category-card-actions admin-action-menu-wrap" onClick={(event) => event.stopPropagation()}>
										<button
											className="admin-icon-btn admin-icon-btn--compact admin-icon-btn--ghost admin-kebab-btn"
											onClick={(event) => toggleActionMenu(event, { type: 'parent', id: item.key })}
											type="button"
											aria-label={`Actions for ${item.title}`}
											title={`Actions for ${item.title}`}
										>
											<span className="admin-kebab-dots" aria-hidden="true">
												<span />
												<span />
												<span />
											</span>
										</button>
										{isMenuOpen({ type: 'parent', id: item.key }) ? (
											<div className="admin-action-menu">
												<button className="admin-action-menu-item" onClick={(event) => handleEditParentClick(event, item.key)} type="button">
													Edit
												</button>
												<button className="admin-action-menu-item admin-action-menu-item--danger" onClick={(event) => {
													event.stopPropagation();
													handleRemoveParentCategory(item.key);
												}} type="button">
													Delete
												</button>
											</div>
										) : null}
									</div>
								</div>
							</div>
							<div className="admin-category-card-copy">{item.subtitle}</div>
						</button>
					))}
				</div>

				<div className="admin-create-layout admin-category-layout">
					<div className="admin-card" style={{ padding: '18px' }}>
						<div className="admin-form-section-title">Sub categories</div>
						{selectedCategory ? (
							<>
								<div className="admin-preview-copy" style={{ marginTop: '16px' }}>
									Subcategories stay managed here. Add new ones from the modal, edit any row, or remove them when they are no longer needed.
								</div>
								<div className="admin-subcategory-list">
									{selectedCategory.subcategories.length ? (
										selectedCategory.subcategories.map((subcategory) => (
											<div className="admin-list-item admin-subcategory-item" key={subcategory.id}>
												<div className="admin-list-copy">
													<div className="admin-list-title">{subcategory.title}</div>
												</div>
												<div className="admin-list-actions">
																										<span className={`admin-status admin-status--${subcategory.status === 'active' ? 'success' : 'warning'}`}>
														{subcategory.status}
													</span>
													<div className="admin-action-menu-wrap" onClick={(event) => event.stopPropagation()}>
														<button
															className="admin-icon-btn admin-icon-btn--compact admin-icon-btn--ghost admin-kebab-btn"
															onClick={(event) => toggleActionMenu(event, { type: 'subcategory', parentId: selectedCategory.id, id: subcategory.id })}
															type="button"
															aria-label={`Actions for ${subcategory.title}`}
															title={`Actions for ${subcategory.title}`}
														>
															<span className="admin-kebab-dots" aria-hidden="true">
																<span />
																<span />
																<span />
															</span>
														</button>
														{isMenuOpen({ type: 'subcategory', parentId: selectedCategory.id, id: subcategory.id }) ? (
															<div className="admin-action-menu">
																<button className="admin-action-menu-item" onClick={(event) => handleEditSubcategoryClick(event, selectedCategory.id, subcategory.id)} type="button">
																	Edit
																</button>
																<button className="admin-action-menu-item admin-action-menu-item--danger" onClick={(event) => {
																	event.stopPropagation();
																	handleRemoveSubcategory(subcategory.id);
																}} type="button">
																	Delete
																</button>
															</div>
														) : null}
													</div>

												</div>
											</div>
										))
									) : (
										<div className="admin-placeholder admin-placeholder--compact">
											<div>
												<strong>No subcategories</strong>
												<div>This parent category does not have any subcategories yet.</div>
											</div>
										</div>
									)}
								</div>
							</>
						) : null}
					</div>

					<div className="admin-card" style={{ padding: '18px' }}>
						<div className="admin-form-section-title">Structure snapshot</div>
						<div className="admin-placeholder admin-placeholder--compact">
							<div>
								<strong>{selectedCategory?.title || 'Selected Category'} </strong>
								<div>{selectedCategory?.subcategories?.length || 0} subcategories - {selectedCategory?.status || 'Unknown'}</div>
							</div>
						</div>

						<div className="admin-preview-copy" style={{ marginTop: '16px' }}>
							This shows a quick snapshot of the currently selected category. It is not editable, but it gives you an overview of the category details while you manage the structure on the left.
						</div>
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
													? categories.find((item) => item.id !== editingTarget.id)?.id || previous.parentId || selectedCategory?.id || 'supplement'
													: previous.parentId || selectedCategory?.id || categories[0]?.id || 'supplement',
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
								<button className="admin-action-btn" type="submit">
									{modalMode === 'edit' ? 'Update category' : 'Save category'}
								</button>
							</div>
						</form>
					</div>
				</div>
			) : null}
		</AdminLayout>
	);
}
