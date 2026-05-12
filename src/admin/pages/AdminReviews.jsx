import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../layouts/AdminLayout';
import useReviews from '../../hooks/useReviews';

const pageSize = 10;

const formatDate = (value) => {
	if (!value) {
		return '--';
	}

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return '--';
	}

	return date.toLocaleString();
};

const getStatusClass = (status) => {
	const normalized = String(status || '').toLowerCase();

	if (normalized === 'approved') {
		return 'admin-status--success';
	}

	if (normalized === 'pending') {
		return 'admin-status--warning';
	}

	return 'admin-status--neutral';
};

const renderStars = (rating) => {
	const total = 5;
	const value = Math.max(0, Math.min(total, Number(rating) || 0));
	return `${'★'.repeat(value)}${'☆'.repeat(total - value)}`;
};

export default function AdminReviews() {
	const { reviews, isLoading, error, updateReviewStatus } = useReviews();
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedReviewId, setSelectedReviewId] = useState('');
	const [updatingReviewId, setUpdatingReviewId] = useState('');

	const filteredReviews = useMemo(() => {
		const query = searchTerm.trim().toLowerCase();
		if (!query) {
			return reviews;
		}

		return reviews.filter((review) =>
			[review.reviewerName, review.productName, review.review, review.status]
				.some((value) => String(value || '').toLowerCase().includes(query)),
		);
	}, [reviews, searchTerm]);

	const totalPages = Math.max(1, Math.ceil(filteredReviews.length / pageSize));
	const paginatedReviews = useMemo(() => {
		const startIndex = (currentPage - 1) * pageSize;
		return filteredReviews.slice(startIndex, startIndex + pageSize);
	}, [filteredReviews, currentPage]);

	const selectedReview = reviews.find((item) => item.id === selectedReviewId) || null;
	const isPreviewOpen = !!selectedReview;

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
		if (!reviews.length) {
			setSelectedReviewId('');
			return;
		}

		if (selectedReviewId && !reviews.some((item) => item.id === selectedReviewId)) {
			setSelectedReviewId('');
		}
	}, [reviews, selectedReviewId]);

	const handlePreviewReview = (reviewId) => {
		setSelectedReviewId((previous) => (previous === reviewId ? '' : reviewId));
	};

	const handleStatusChange = async (reviewId, nextStatus) => {
		if (!reviewId || !nextStatus || updatingReviewId) {
			return;
		}

		setUpdatingReviewId(String(reviewId));
		try {
			await updateReviewStatus(reviewId, nextStatus);
			toast.success(`Review status updated to ${nextStatus}.`);
		} catch (err) {
			toast.error(err?.message || 'Failed to update review status.');
		} finally {
			setUpdatingReviewId('');
		}
	};

	if (isLoading) {
		return (
			<AdminLayout title="Reviews" subtitle="Customer feedback and moderation queue.">
				<section className="admin-card">
					<div className="admin-form-section-title">Reviews</div>
					<div className="admin-preview-copy">Loading reviews...</div>
				</section>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout title="Reviews" subtitle="Customer feedback and moderation queue.">
			<section className="admin-card">
				<div className="admin-card-head admin-card-head--categories">
					<div>
						<div className="admin-card-kicker">Feedback</div>
						<div className="admin-card-title">Reviews table</div>
						<div className="admin-card-subtitle">
							Browse all product reviews in a searchable, paginated table with detailed preview.
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
							placeholder="Search by reviewer, product, review, status"
						/>
						<div className="admin-category-toolbar-actions">
							<div className="admin-chip">{filteredReviews.length} reviews</div>
						</div>
					</div>
				</div>

				<div className={`admin-products-layout ${isPreviewOpen ? 'admin-products-layout--preview-open' : 'admin-products-layout--preview-closed'}`}>
					<div>
						<div className="admin-table-wrap">
							<table className="admin-table">
								<thead>
									<tr>
										<th><strong>Reviewer</strong></th>
										<th><strong>Product</strong></th>
										<th><strong>Rating</strong></th>
										<th><strong>Status</strong></th>
										<th><strong>Created At</strong></th>
									</tr>
								</thead>
								<tbody>
									{paginatedReviews.length ? (
										paginatedReviews.map((review) => {
											const isSelected = selectedReview?.id === review.id;

											return (
												<tr
													key={review.id}
													onClick={() => handlePreviewReview(review.id)}
													className={isSelected ? 'is-active' : ''}
												>
													<td data-label="Reviewer">
														<strong>{review.reviewerName}</strong>
													</td>
													<td data-label="Product">{review.productName}</td>
													<td data-label="Rating">{renderStars(review.rating)}</td>
													<td data-label="Status">
														<div className="admin-status-control">
															<select 
                                                            className={`admin-status ${getStatusClass(review.status)}`} 
																value={review.status}
																onClick={(event) => event.stopPropagation()}
																onChange={(event) => {
																	event.stopPropagation();
																	handleStatusChange(review.id, event.target.value);
																}}
																disabled={updatingReviewId === review.id}
															>
																<option value="pending">Pending</option>
																<option value="approved">Approved</option>
																<option value="rejected">Rejected</option>
                                                                
															</select>
														</div>
													</td>
													<td data-label="Created At">{formatDate(review.createdAt)}</td>
												</tr>
											);
										})
									) : (
										<tr>
											<td colSpan={5}>
												<div className="admin-preview-copy">No reviews matched your search.</div>
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>

						<div className="admin-pagination-row">
							<div className="admin-preview-copy">
								Showing {paginatedReviews.length ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, filteredReviews.length)} of {filteredReviews.length}
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
							<div className="admin-card-kicker">Review preview</div>
							<div className="admin-card-title">{selectedReview?.reviewerName}</div>
							<div className="admin-card-subtitle">Expanded review details for moderation and context.</div>

							<div className="admin-placeholder admin-placeholder--compact" style={{ marginTop: '16px' }}>
								<div>
									<strong>{selectedReview?.reviewerName}</strong>
									<div>Product: {selectedReview?.productName}</div>
									<div>Rating: {renderStars(selectedReview?.rating)}</div>
									<div>Status: {selectedReview?.status}</div>
									<div className="admin-status-actions" style={{ marginTop: '10px' }}>
										<button
											className={`admin-action-btn admin-action-btn--ghost ${selectedReview?.status === 'pending' ? 'is-active' : ''}`}
											type="button"
											onClick={() => handleStatusChange(selectedReview?.id, 'pending')}
											disabled={updatingReviewId === selectedReview?.id}
										>
											Pending
										</button>
										<button
											className={`admin-action-btn admin-action-btn--ghost ${selectedReview?.status === 'approved' ? 'is-active' : ''}`}
											type="button"
											onClick={() => handleStatusChange(selectedReview?.id, 'approved')}
											disabled={updatingReviewId === selectedReview?.id}
										>
											Approve
										</button>
										<button
											className={`admin-action-btn admin-action-btn--ghost ${selectedReview?.status === 'rejected' ? 'is-active' : ''}`}
											type="button"
											onClick={() => handleStatusChange(selectedReview?.id, 'rejected')}
											disabled={updatingReviewId === selectedReview?.id}
										>
											Reject
										</button>
									</div>
									<div>Created At: {formatDate(selectedReview?.createdAt)}</div>
									<div>Updated At: {formatDate(selectedReview?.updatedAt)}</div>
									<div style={{ marginTop: '10px' }}>{selectedReview?.review}</div>
								</div>
							</div>
						</div>
					) : null}
				</div>
			</section>
		</AdminLayout>
	);
}
