import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../layouts/AdminLayout';
import useDiscounts from '../../hooks/useDiscounts';
import useProducts from '../../hooks/useProducts';

const emptyDiscountForm = {
  title: '',
  discountScope: 'coupon',
  type: 'absolute',
  percentage: '',
  amount: '',
  detail: '',
  startDate: '',
  endDate: '',
  couponCode: '',
  productIds: [],
};

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

const formatAmount = (mode, amount) => {
  const raw = String(amount || '').trim();
  if (!raw) {
    return '--';
  }

  return mode === 'percentage' ? `${raw}%` : `$${raw}`;
};

const getStatusClass = (status) => {
  if (status === 'active') {
    return 'admin-status--success';
  }

  if (status === 'scheduled') {
    return 'admin-status--warning';
  }

  return 'admin-status--neutral';
};

export default function AdminDiscounts() {
  const { discounts, isLoading, error, loadDiscounts, addDiscount, editExistingDiscount, deleteExistingDiscount } = useDiscounts();
  const { products: availableProducts, isLoading: isProductsLoading } = useProducts();
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingTarget, setEditingTarget] = useState(null);
  const [discountForm, setDiscountForm] = useState(emptyDiscountForm);
  const [formError, setFormError] = useState('');
  const [openActionMenu, setOpenActionMenu] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingDiscountId, setDeletingDiscountId] = useState('');

  const normalizedProductOptions = useMemo(
    () => (availableProducts || []).map((product) => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
    })),
    [availableProducts],
  );

  const filteredRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return rows;
    }

    return rows.filter((row) =>
      [row.code, row.target, row.level, row.mode, row.scope, row.status, row.title, row.detail]
        .some((value) => String(value || '').toLowerCase().includes(query)),
    );
  }, [rows, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredRows.slice(startIndex, startIndex + pageSize);
  }, [filteredRows, currentPage]);

  const resetModalState = () => {
    setIsModalOpen(false);
    setModalMode('add');
    setEditingTarget(null);
    setDiscountForm(emptyDiscountForm);
    setFormError('');
  };

  const showFormError = (message) => {
    setFormError(message);
    toast.error(message);
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    setRows(discounts || []);
  }, [discounts]);

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
        resetModalState();
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
    setDiscountForm(emptyDiscountForm);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (row) => {
    setOpenActionMenu(null);
    setModalMode('edit');
    setEditingTarget(row.sourceDiscountId || row.id);

    const groupRows = rows.filter((item) => item.sourceDiscountId === row.sourceDiscountId);
    const selectedRows = groupRows.length ? groupRows : [row];
    const baseRow = selectedRows[0];
    const productIds = baseRow.level === 'product'
      ? [...new Set(selectedRows.map((item) => String(item.productId || '')).filter(Boolean))]
      : [];

    setDiscountForm({
      title: baseRow.title || '',
      discountScope: baseRow.level === 'product' ? 'product' : 'coupon',
      type: baseRow.discountType || (baseRow.mode === 'percentage' ? 'percentage' : 'absolute'),
      percentage: String(baseRow.percentage || ''),
      amount: String(baseRow.fixedAmount || baseRow.amount || ''),
      detail: baseRow.detail && baseRow.detail !== '--' ? baseRow.detail : '',
      startDate: baseRow.startDate || '',
      endDate: baseRow.endDate || '',
      couponCode: baseRow.code && baseRow.code !== '--' ? baseRow.code : '',
      productIds,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const buildDiscountPayload = () => {
    const payload = new FormData();
    const title = discountForm.title.trim();
    const detail = discountForm.detail.trim();
    const couponCode = discountForm.couponCode.trim().toUpperCase();
    const percentage = discountForm.percentage.trim();
    const amount = discountForm.amount.trim();

    payload.append('title', title);
    payload.append('type', discountForm.type);
    payload.append('percentage', discountForm.type === 'percentage' ? percentage : '');
    payload.append('amount', discountForm.type === 'absolute' ? amount : '');
    payload.append('detail', detail);
    payload.append('start_date', discountForm.startDate);
    payload.append('end_date', discountForm.endDate);
    payload.append('discount_scope', discountForm.discountScope);

    if (discountForm.discountScope === 'coupon' && couponCode) {
      payload.append('coupon_code', couponCode);
    }

    if (discountForm.discountScope === 'product') {
      discountForm.productIds.forEach((productId) => {
        payload.append('product_ids[]', productId);
      });
    }

    return payload;
  };

  const handleSubmitDiscount = async (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const title = discountForm.title.trim();
    const detail = discountForm.detail.trim();
    const couponCode = discountForm.couponCode.trim();
    const percentage = discountForm.percentage.trim();
    const amount = discountForm.amount.trim();
    const productIds = discountForm.productIds;

    if (!title) {
      showFormError('Enter a discount title.');
      return;
    }

    if (!detail) {
      showFormError('Enter discount details.');
      return;
    }

    if (!discountForm.startDate) {
      showFormError('Choose a start date.');
      return;
    }

    if (!discountForm.endDate) {
      showFormError('Choose an end date.');
      return;
    }

    if (new Date(discountForm.endDate) < new Date(discountForm.startDate)) {
      showFormError('End date must be the same as or after the start date.');
      return;
    }

    if (discountForm.type === 'percentage' && (!percentage || Number(percentage) <= 0)) {
      showFormError('Enter a valid percentage discount.');
      return;
    }

    if (discountForm.type === 'absolute' && (!amount || Number(amount) <= 0)) {
      showFormError('Enter a valid fixed discount amount.');
      return;
    }

    if (discountForm.discountScope === 'coupon' && !couponCode) {
      showFormError('Enter a coupon code.');
      return;
    }

    if (discountForm.discountScope === 'product' && !productIds.length) {
      showFormError('Select at least one product.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = buildDiscountPayload();

      if (modalMode === 'add') {
        await addDiscount(payload);
        await loadDiscounts();
        toast.success('Discount added successfully.');
        resetModalState();
        return;
      }

      if (!editingTarget) {
        showFormError('No discount selected for editing.');
        setIsSubmitting(false);
        return;
      }

      await editExistingDiscount(editingTarget, payload);
      await loadDiscounts();
      toast.success('Discount updated successfully.');
      resetModalState();
    } catch (err) {
      showFormError(err?.message || 'Failed to save discount.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDiscount = async (row) => {
    if (isSubmitting || deletingDiscountId) {
      return;
    }

    const sourceDiscountId = row.sourceDiscountId || row.id;
    setDeletingDiscountId(String(sourceDiscountId));
    setOpenActionMenu(null);

    try {
      await deleteExistingDiscount(sourceDiscountId);
      toast.success(`${row.level === 'coupon' ? row.code : row.target} deleted successfully.`);
    } catch (err) {
      showFormError(err?.message || 'Failed to delete discount.');
    } finally {
      setDeletingDiscountId('');
    }
  };

  const toggleActionMenu = (event, rowId) => {
    event.stopPropagation();
    setOpenActionMenu((previous) => (previous === rowId ? null : rowId));
  };

  const isMenuOpen = (rowId) => openActionMenu === rowId;

  const selectedProducts = normalizedProductOptions.filter((product) => discountForm.productIds.includes(product.id));

  if (isLoading && !rows.length) {
    return (
      <AdminLayout title="Discounts" subtitle="Manage product and coupon discounts in one place.">
        <section className="admin-card">
          <div className="admin-form-section-title">Discounts</div>
          <div className="admin-preview-copy">Loading discounts...</div>
        </section>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Discounts" subtitle="Manage product and coupon discounts in one place.">
      <section className="admin-card">
        <div className="admin-card-head admin-card-head--categories">
          <div>
            <div className="admin-card-kicker"></div>
            <div className="admin-card-title">Discount table</div>
            <div className="admin-card-subtitle">
              Product-level and coupon-level discounts are compiled in one searchable, paginated table.
            </div>
          </div>
          <div className="admin-category-toolbar">
            <input
              className="admin-field admin-category-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by code, product, scope, status"
            />
            <div className="admin-category-toolbar-actions">
              <button className="admin-action-btn" onClick={openAddModal} type="button">
                + Add discount
              </button>
              <button
                className="admin-action-btn admin-action-btn--ghost"
                onClick={async () => {
                  await loadDiscounts();
                  toast.success('Discount list refreshed.');
                }}
                type="button"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th><strong>Code / Product</strong></th>
                <th><strong>Scope</strong></th>
                <th><strong>Mode</strong></th>
                <th><strong>Value</strong></th>
                <th><strong>Status</strong></th>
                <th><strong>Start Date</strong></th>
                <th><strong>End Date</strong></th>
                <th><strong>Actions</strong></th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length ? (
                paginatedRows.map((row) => (
                  <tr key={row.id}>
                    <td data-label="Code / Product">
                      {row.level === 'coupon' ? row.code : row.target}
                    </td>
                    <td data-label="Scope">{row.level === 'coupon' ? 'Coupon' : 'Product'}</td>
                    <td data-label="Mode">{row.mode === 'percentage' ? 'Percentage' : 'Fixed'}</td>
                    <td data-label="Value">{formatAmount(row.mode, row.amount)}</td>
                    <td data-label="Status">
                      <span className={`admin-status ${getStatusClass(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td data-label="Start Date">{formatDate(row.startDate)}</td>
                    <td data-label="End Date">{formatDate(row.endDate)}</td>
                    <td data-label="Actions">
                      <div className="admin-action-menu-wrap">
                        <button
                          className="admin-icon-btn admin-icon-btn--compact admin-icon-btn--ghost admin-kebab-btn"
                          onClick={(event) => toggleActionMenu(event, row.id)}
                          type="button"
                          aria-label={`Actions for ${row.level === 'coupon' ? row.code : row.target}`}
                          title={`Actions for ${row.level === 'coupon' ? row.code : row.target}`}
                        >
                          <span className="admin-kebab-dots" aria-hidden="true">
                            <span />
                            <span />
                            <span />
                          </span>
                        </button>
                        {isMenuOpen(row.id) ? (
                          <div className="admin-action-menu">
                            <button
                              className="admin-action-menu-item"
                              onClick={(event) => {
                                event.stopPropagation();
                                openEditModal(row);
                              }}
                              type="button"
                            >
                              Edit
                            </button>
                            <button
                              className="admin-action-menu-item admin-action-menu-item--danger"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDeleteDiscount(row);
                              }}
                              type="button"
                              disabled={deletingDiscountId === String(row.sourceDiscountId || row.id)}
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
                  <td colSpan={8}>
                    <div className="admin-preview-copy">No discounts matched your search.</div>
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
          <div className="admin-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="discount-modal-title">
            <div className="admin-modal-head">
              <div>
                <div className="admin-card-kicker">{modalMode === 'edit' ? 'Edit discount' : 'Create discount'}</div>
                <div className="admin-card-title" id="discount-modal-title">{modalMode === 'edit' ? 'Edit discount' : 'Add discount'}</div>
                <div className="admin-card-subtitle">Create or update coupon and product-level discounts from this modal.</div>
              </div>
              <button className="admin-icon-btn admin-modal-close" onClick={resetModalState} type="button" aria-label="Close modal">
                ×
              </button>
            </div>

            <form className="admin-modal-body" onSubmit={handleSubmitDiscount}>
              <div className="admin-field-group admin-field-group--full">
                <label className="admin-field-label" htmlFor="discountTitle">Title</label>
                <input
                  className="admin-field"
                  id="discountTitle"
                  placeholder="Ex: 13 august Offer"
                  type="text"
                  value={discountForm.title}
                  onChange={(event) =>
                    setDiscountForm((previous) => ({
                      ...previous,
                      title: event.target.value,
                    }))
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className="admin-field-group">
                <span className="admin-field-label">Discount scope</span>
                <div className="admin-toggle-group" role="radiogroup" aria-label="Discount scope">
                  <button
                    className={`admin-toggle-btn ${discountForm.discountScope === 'coupon' ? 'is-active' : ''}`}
                    onClick={() =>
                      setDiscountForm((previous) => ({
                        ...previous,
                        discountScope: 'coupon',
                        productIds: [],
                      }))
                    }
                    type="button"
                    disabled={isSubmitting}
                  >
                    Coupon
                  </button>
                  <button
                    className={`admin-toggle-btn ${discountForm.discountScope === 'product' ? 'is-active' : ''}`}
                    onClick={() =>
                      setDiscountForm((previous) => ({
                        ...previous,
                        discountScope: 'product',
                        couponCode: '',
                      }))
                    }
                    type="button"
                    disabled={isSubmitting}
                  >
                    Product
                  </button>
                </div>
              </div>

              <div className="admin-field-group">
                <label className="admin-field-label" htmlFor="discountType">Discount type</label>
                <select
                  className="admin-field"
                  id="discountType"
                  value={discountForm.type}
                  onChange={(event) =>
                    setDiscountForm((previous) => ({
                      ...previous,
                      type: event.target.value,
                    }))
                  }
                  disabled={isSubmitting}
                >
                  <option value="percentage">Percentage</option>
                  <option value="absolute">Fixed amount</option>
                </select>
              </div>

              {discountForm.type === 'percentage' ? (
                <div className="admin-field-group">
                  <label className="admin-field-label" htmlFor="discountPercentage">Percentage</label>
                  <input
                    className="admin-field"
                    id="discountPercentage"
                    placeholder="Ex: 12"
                    type="number"
                    min="0"
                    step="0.01"
                    value={discountForm.percentage}
                    onChange={(event) =>
                      setDiscountForm((previous) => ({
                        ...previous,
                        percentage: event.target.value,
                      }))
                    }
                    disabled={isSubmitting}
                  />
                </div>
              ) : (
                <div className="admin-field-group">
                  <label className="admin-field-label" htmlFor="discountAmount">Amount</label>
                  <input
                    className="admin-field"
                    id="discountAmount"
                    placeholder="Ex: 100"
                    type="number"
                    min="0"
                    step="0.01"
                    value={discountForm.amount}
                    onChange={(event) =>
                      setDiscountForm((previous) => ({
                        ...previous,
                        amount: event.target.value,
                      }))
                    }
                    disabled={isSubmitting}
                  />
                </div>
              )}

              <div className="admin-field-group admin-field-group--full">
                <label className="admin-field-label" htmlFor="discountDetail">Detail</label>
                <textarea
                  className="admin-field admin-field--textarea admin-field--small"
                  id="discountDetail"
                  placeholder="Offer Details..."
                  value={discountForm.detail}
                  onChange={(event) =>
                    setDiscountForm((previous) => ({
                      ...previous,
                      detail: event.target.value,
                    }))
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className="admin-field-group">
                <label className="admin-field-label" htmlFor="discountStartDate">Start date</label>
                <input
                  className="admin-field"
                  id="discountStartDate"
                  type="date"
                  value={discountForm.startDate}
                  onChange={(event) =>
                    setDiscountForm((previous) => ({
                      ...previous,
                      startDate: event.target.value,
                    }))
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className="admin-field-group">
                <label className="admin-field-label" htmlFor="discountEndDate">End date</label>
                <input
                  className="admin-field"
                  id="discountEndDate"
                  type="date"
                  value={discountForm.endDate}
                  onChange={(event) =>
                    setDiscountForm((previous) => ({
                      ...previous,
                      endDate: event.target.value,
                    }))
                  }
                  disabled={isSubmitting}
                />
              </div>

              {discountForm.discountScope === 'coupon' ? (
                <div className="admin-field-group admin-field-group--full">
                  <label className="admin-field-label" htmlFor="couponCode">Coupon code</label>
                  <input
                    className="admin-field"
                    id="couponCode"
                    placeholder="Ex: ada2"
                    type="text"
                    value={discountForm.couponCode}
                    onChange={(event) =>
                      setDiscountForm((previous) => ({
                        ...previous,
                        couponCode: event.target.value,
                      }))
                    }
                    disabled={isSubmitting}
                  />
                </div>
              ) : (
                <div className="admin-field-group admin-field-group--full">
                  <label className="admin-field-label">Products</label>
                  {isProductsLoading ? (
                    <div className="admin-preview-copy">Loading products...</div>
                  ) : (
                    <div className="admin-product-picklist">
                      {normalizedProductOptions.length ? normalizedProductOptions.map((product) => {
                        const checked = discountForm.productIds.includes(product.id);

                        return (
                          <label className="admin-product-pick" key={product.id}>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(event) => {
                                const isChecked = event.target.checked;
                                setDiscountForm((previous) => ({
                                  ...previous,
                                  productIds: isChecked
                                    ? [...previous.productIds, product.id]
                                    : previous.productIds.filter((item) => item !== product.id),
                                }));
                              }}
                              disabled={isSubmitting}
                            />
                            <span>
                              <span className="admin-product-pick-title">{product.name}</span>
                              <span className="admin-product-pick-meta">SKU: {product.sku}</span>
                            </span>
                          </label>
                        );
                      }) : (
                        <div className="admin-preview-copy">No products available.</div>
                      )}
                    </div>
                  )}

                  {selectedProducts.length ? (
                    <div className="admin-tags-wrap admin-tags-wrap--space">
                      {selectedProducts.map((product) => (
                        <span className="admin-tag" key={product.id}>{product.name}</span>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}

              {formError ? <div className="admin-modal-error">{formError}</div> : null}

              <div className="admin-modal-actions">
                <button className="admin-action-btn admin-action-btn--ghost" onClick={resetModalState} type="button">
                  Cancel
                </button>
                <button className="admin-action-btn" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : modalMode === 'edit' ? 'Update discount' : 'Save discount'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}
