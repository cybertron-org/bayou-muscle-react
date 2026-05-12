import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../layouts/AdminLayout';
import useNewsletter from '../../hooks/useNewsletter';

const pageSize = 10;

const formatDate = (value) => {
	if (!value) {
		return '--';
	}

	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) {
		return '--';
	}

	return parsed.toLocaleString();
};

export default function AdminNewsletter() {
	const { subscriptions, isLoading, error, fetchSubscriptions, deleteSubscription } = useNewsletter();
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [deletingId, setDeletingId] = useState('');

	useEffect(() => {
		fetchSubscriptions().catch(() => {});
	}, [fetchSubscriptions]);

	useEffect(() => {
		if (error) {
			toast.error(error);
		}
	}, [error]);

	const filteredSubscriptions = useMemo(() => {
		const query = searchTerm.trim().toLowerCase();
		if (!query) {
			return subscriptions;
		}

		return subscriptions.filter((item) =>
			String(item.email || '').toLowerCase().includes(query),
		);
	}, [subscriptions, searchTerm]);

	const totalPages = Math.max(1, Math.ceil(filteredSubscriptions.length / pageSize));

	useEffect(() => {
		if (currentPage > totalPages) {
			setCurrentPage(totalPages);
		}
	}, [currentPage, totalPages]);

	const paginatedSubscriptions = useMemo(() => {
		const startIndex = (currentPage - 1) * pageSize;
		return filteredSubscriptions.slice(startIndex, startIndex + pageSize);
	}, [filteredSubscriptions, currentPage]);

	const handleDeleteSubscription = async (subscriptionId, email) => {
		const confirmed = window.confirm(`Delete newsletter subscription for "${email}"? This action cannot be undone.`);
		if (!confirmed) {
			return;
		}

		setDeletingId(String(subscriptionId));
		try {
			await deleteSubscription(subscriptionId);
			toast.success('Subscription deleted successfully.');
		} catch (err) {
			toast.error(err?.message || 'Failed to delete subscription.');
		} finally {
			setDeletingId('');
		}
	};

	if (isLoading && !subscriptions.length) {
		return (
			<AdminLayout title="Newsletter" subtitle="Manage newsletter subscriptions and audience growth.">
				<section className="admin-card">
					<div className="admin-form-section-title">Newsletter subscriptions</div>
					<div className="admin-preview-copy">Loading newsletter subscriptions...</div>
				</section>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout title="Newsletter" subtitle="Manage newsletter subscriptions and audience growth.">
			<section className="admin-card">
				<div className="admin-card-head admin-card-head--categories">
					<div>
						<div className="admin-card-kicker">Audience</div>
						<div className="admin-card-title">Newsletter subscriptions</div>
						<div className="admin-card-subtitle">
							View all newsletter subscribers in a searchable, paginated table.
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
							placeholder="Search by email"
						/>
						<div className="admin-category-toolbar-actions">
							<div className="admin-chip">{filteredSubscriptions.length} subscriptions</div>
						</div>
					</div>
				</div>

				<div className="admin-table-wrap">
					<table className="admin-table">
						<thead>
							<tr>
								<th><strong>ID</strong></th>
								<th><strong>Email</strong></th>
								<th><strong>Created At</strong></th>
								<th><strong>Updated At</strong></th>
								<th><strong>Actions</strong></th>
							</tr>
						</thead>
						<tbody>
							{paginatedSubscriptions.length ? (
								paginatedSubscriptions.map((item) => (
									<tr key={item.id}>
										<td data-label="ID"><strong>{item.id}</strong></td>
										<td data-label="Email">{item.email || '--'}</td>
										<td data-label="Created At">{formatDate(item.createdAt)}</td>
										<td data-label="Updated At">{formatDate(item.updatedAt)}</td>
										<td data-label="Actions">
											<button
												type="button"
												className="admin-action-btn admin-action-btn--ghost"
												onClick={() => handleDeleteSubscription(item.id, item.email || 'this email')}
												disabled={deletingId === String(item.id)}
											>
												{deletingId === String(item.id) ? 'Deleting...' : 'Delete'}
											</button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={5}>
										<div className="admin-preview-copy">No newsletter subscriptions matched your search.</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				<div className="admin-pagination-row">
					<div className="admin-preview-copy">
						Showing {paginatedSubscriptions.length ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, filteredSubscriptions.length)} of {filteredSubscriptions.length}
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
		</AdminLayout>
	);
}
