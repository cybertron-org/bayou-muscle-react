import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useProducts from '../../hooks/useProducts';
import AdminLayout from '../layouts/AdminLayout';

const pageSize = 10;

const normalizeProduct = (item) => ({
	id: String(item?.id || ''),
	name: item?.name || 'Untitled',
	slug: item?.slug || '',
	price: item?.price ?? '0',
	discountedPrice: item?.discounted_price ?? item?.price ?? '0',
	quantity: Number(item?.quantity ?? 0),
	sku: item?.sku || '--',
	summary: item?.summary || '--',
	description: item?.description || '--',
	additionalInfo: item?.additional_info || '--',
	bestSeller: Number(item?.best_seller || 0),
	isFeatured: Number(item?.is_featured || 0),
	clearance: Number(item?.clearance || 0),
	gender: item?.gender || '--',
	isActive: Number(item?.is_active || 0),
	createdAt: item?.created_at || null,
	updatedAt: item?.updated_at || null,
	categoryTitle: item?.category?.title || '--',
	images: Array.isArray(item?.images)
		? item.images.map((image) => ({
			id: String(image?.id || ''),
			image: image?.image || '',
			isMain: Number(image?.is_main || 0),
		}))
		: [],
});

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

const formatCurrency = (value) => {
	const amount = Number(value);
	if (Number.isNaN(amount)) {
		return value;
	}

	return `$${amount.toFixed(2)}`;
};

const getStatusMeta = (product) => {
	if (!product?.isActive) {
		return { label: 'Inactive', className: 'admin-status--neutral' };
	}

	if (product.clearance === 1) {
		return { label: 'Clearance', className: 'admin-status--warning' };
	}

	if (product.quantity <= 24) {
		return { label: 'Low stock', className: 'admin-status--warning' };
	}

	if (product.bestSeller === 1 || product.isFeatured === 1) {
		return { label: 'Featured', className: 'admin-status--success' };
	}

	return { label: 'Active', className: 'admin-status--success' };
};

export default function AdminProducts() {
	const navigate = useNavigate();
	const { products: rawProducts, isLoading, error, deleteExistingProduct } = useProducts();
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedProductId, setSelectedProductId] = useState('');
	const [openActionMenu, setOpenActionMenu] = useState(null);
	const [deletingProductId, setDeletingProductId] = useState('');

	const products = useMemo(
		() => (rawProducts || []).map(normalizeProduct).filter((item) => item.id),
		[rawProducts],
	);

	const filteredProducts = useMemo(() => {
		const query = searchTerm.trim().toLowerCase();
		if (!query) {
			return products;
		}

		return products.filter((product) =>
			[product.name, product.sku, product.slug, product.gender, product.summary]
				.some((value) => String(value || '').toLowerCase().includes(query)),
		);
	}, [products, searchTerm]);

	const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
	const paginatedProducts = useMemo(() => {
		const startIndex = (currentPage - 1) * pageSize;
		return filteredProducts.slice(startIndex, startIndex + pageSize);
	}, [filteredProducts, currentPage]);

	const selectedProduct = products.find((product) => product.id === selectedProductId) || null;
	const visibleImage = selectedProduct?.images?.find((image) => image.isMain === 1) || selectedProduct?.images?.[0] || null;
	const selectedStatus = getStatusMeta(selectedProduct || {});
	const isPreviewOpen = !!selectedProduct;

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
		if (!selectedProductId) {
			setOpenActionMenu(null);
		}
	}, [selectedProductId]);

	useEffect(() => {
		if (!products.length) {
			setSelectedProductId('');
			return;
		}

		if (selectedProductId && !products.some((product) => product.id === selectedProductId)) {
			setSelectedProductId('');
		}
	}, [products, selectedProductId]);

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

	const handlePreviewProduct = (productId) => {
		setSelectedProductId((previous) => (previous === productId ? '' : productId));
		setOpenActionMenu(null);
	};

	const handleDeleteProduct = async (productId) => {
		if (deletingProductId) {
			return;
		}

		const targetProduct = products.find((product) => product.id === productId);
		setDeletingProductId(productId);

		try {
			await deleteExistingProduct(productId);
			if (selectedProductId === productId) {
				setSelectedProductId('');
			}
			setOpenActionMenu(null);
			toast.success(`${targetProduct?.name || 'Product'} deleted successfully.`);
		} catch (err) {
			toast.error(err?.message || 'Failed to delete product.');
		} finally {
			setDeletingProductId('');
		}
	};

	const toggleActionMenu = (event, productId) => {
		event.stopPropagation();
		setOpenActionMenu((previous) => (previous === productId ? null : productId));
	};

	const isMenuOpen = (productId) => openActionMenu === productId;

	const openPreviewFromMenu = (event, productId) => {
		event.stopPropagation();
		handlePreviewProduct(productId);
	};

	const openEditFromMenu = (event, productId) => {
		event.stopPropagation();
		setOpenActionMenu(null);
		navigate(`/admin/products/${productId}/edit`);
	};

	const deleteFromMenu = async (event, productId) => {
		event.stopPropagation();
		await handleDeleteProduct(productId);
	};

	if (isLoading) {
		return (
			<AdminLayout title="Products" subtitle="Product catalog overview and management template.">
				<section className="admin-card">
					<div className="admin-form-section-title">Products</div>
					<div className="admin-preview-copy">Loading products...</div>
				</section>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout title="Products" subtitle="Product catalog overview and management template.">
			<section className="admin-card">
				<div className="admin-card-head admin-card-head--categories">
					<div>
						<div className="admin-card-kicker">Catalog</div>
						<div className="admin-card-title">Products workspace</div>
						<div className="admin-card-subtitle">
							Browse product rows in a searchable, paginated list with a detail preview panel.
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
							placeholder="Search by name, SKU, slug, summary"
						/>
						<div className="admin-category-toolbar-actions">
							<button className="admin-action-btn" onClick={() => navigate('/admin/products/add')} type="button">
								+ Add Product
							</button>
							<div className="admin-chip">{filteredProducts.length} products</div>
						</div>
					</div>
				</div>

				<div className={`admin-products-layout ${isPreviewOpen ? 'admin-products-layout--preview-open' : 'admin-products-layout--preview-closed'}`}>
					<div>
						<div className="admin-table-wrap">
							<table className="admin-table">
								<thead>
									<tr>
										<th><strong>Name</strong></th>
										<th><strong>Price</strong></th>
										<th><strong>Qty</strong></th>
										<th><strong>SKU</strong></th>
										<th><strong>Status</strong></th>
										<th><strong>Created At</strong></th>
										<th><strong>Actions</strong></th>
									</tr>
								</thead>
								<tbody>
									{paginatedProducts.length ? (
										paginatedProducts.map((product) => {
											const statusMeta = getStatusMeta(product);
											const isSelected = selectedProduct?.id === product.id;

											return (
												<tr key={product.id} onClick={() => handlePreviewProduct(product.id)} className={isSelected ? 'is-active' : ''}>
													<td data-label="Name">
														<strong>{product.name}</strong>
														<div className="admin-preview-copy">{product.summary}</div>
													</td>
													<td data-label="Price">{formatCurrency(product.price)}</td>
													<td data-label="Qty">{product.quantity}</td>
													<td data-label="SKU">{product.sku}</td>
													<td data-label="Status">
														<span className={`admin-status ${statusMeta.className}`}>{statusMeta.label}</span>
													</td>
													<td data-label="Created At">{formatDate(product.createdAt)}</td>
													<td data-label="Actions">
														<div className="admin-action-menu-wrap">
															<button
																className="admin-icon-btn admin-icon-btn--compact admin-icon-btn--ghost admin-kebab-btn"
																onClick={(event) => toggleActionMenu(event, product.id)}
																type="button"
																aria-label={`Actions for ${product.name}`}
																title={`Actions for ${product.name}`}
															>
																<span className="admin-kebab-dots" aria-hidden="true">
																	<span />
																	<span />
																	<span />
																</span>
															</button>
															{isMenuOpen(product.id) ? (
																<div className="admin-action-menu">
																	<button className="admin-action-menu-item" type="button" onClick={(event) => openPreviewFromMenu(event, product.id)}>
																		Preview
																	</button>
																	<button className="admin-action-menu-item" type="button" onClick={(event) => openEditFromMenu(event, product.id)}>
																		Edit
																	</button>
																	<button className="admin-action-menu-item admin-action-menu-item--danger" type="button" onClick={(event) => deleteFromMenu(event, product.id)} disabled={deletingProductId === product.id}>
																		Delete
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
											<td colSpan={7}>
												<div className="admin-preview-copy">No products matched your search.</div>
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>

						<div className="admin-pagination-row">
							<div className="admin-preview-copy">
								Showing {paginatedProducts.length ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, filteredProducts.length)} of {filteredProducts.length}
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
					</div>

					{isPreviewOpen ? (
						<div className="admin-card admin-products-preview-panel" style={{ padding: '18px' }}>
							<div className="admin-card-kicker">Product preview</div>
							<div className="admin-card-title">{selectedProduct?.name}</div>
							<div className="admin-card-subtitle">Secondary details are shown here for the selected product.</div>

							<div className="admin-placeholder admin-placeholder--compact" style={{ marginTop: '16px' }}>
								<div>
									{visibleImage?.image ? (
										<img
											src={visibleImage.image}
											alt={selectedProduct?.name}
											style={{ width: '100%', borderRadius: '16px', marginBottom: '14px', objectFit: 'cover', aspectRatio: '16 / 10' }}
										/>
									) : null}
									<strong>{selectedProduct?.name}</strong>
									<div>Category: {selectedProduct?.categoryTitle}</div>
									<div>Price: {formatCurrency(selectedProduct?.price)}</div>
									<div>Discounted Price: {formatCurrency(selectedProduct?.discountedPrice)}</div>
									<div>Quantity: {selectedProduct?.quantity}</div>
									<div>SKU: {selectedProduct?.sku}</div>
									<div>Status: {selectedStatus.label}</div>
									<div>Gender: {selectedProduct?.gender}</div>
									<div style={{ marginTop: '10px' }}>{selectedProduct?.summary}</div>
									<div style={{ marginTop: '10px' }}>{selectedProduct?.description}</div>
									<div style={{ marginTop: '10px' }}>{selectedProduct?.additionalInfo}</div>
								</div>
							</div>

							<div className="admin-tags-wrap admin-tags-wrap--space">
								<span className="admin-tag">Best seller: {selectedProduct?.bestSeller}</span>
								<span className="admin-tag">Featured: {selectedProduct?.isFeatured}</span>
								<span className="admin-tag">Clearance: {selectedProduct?.clearance}</span>
								<span className="admin-tag">Active: {selectedProduct?.isActive}</span>
								<span className="admin-tag">Images: {selectedProduct?.images?.length || 0}</span>
							</div>
						</div>
					) : null}
				</div>
			</section>
		</AdminLayout>
	);
}
