import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../layouts/AdminLayout';
import useContacts from '../../hooks/useContacts';

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

export default function AdminUsers() {
  const { contacts, isLoading, error } = useContacts();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContactId, setSelectedContactId] = useState('');

  const filteredContacts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return contacts;
    }

    return contacts.filter((contact) =>
      [contact.fullName, contact.email, contact.phone]
        .some((value) => String(value || '').toLowerCase().includes(query)),
    );
  }, [contacts, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredContacts.length / pageSize));
  const paginatedContacts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredContacts.slice(startIndex, startIndex + pageSize);
  }, [filteredContacts, currentPage]);

  const selectedContact = contacts.find((item) => item.id === selectedContactId) || null;
  const isPreviewOpen = !!selectedContact;

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
    if (!contacts.length) {
      setSelectedContactId('');
      return;
    }

    if (selectedContactId && !contacts.some((item) => item.id === selectedContactId)) {
      setSelectedContactId('');
    }
  }, [contacts, selectedContactId]);

  const handlePreviewContact = (contactId) => {
    setSelectedContactId((previous) => (previous === contactId ? '' : contactId));
  };

  if (isLoading) {
    return (
      <AdminLayout title="Contacts" subtitle="Contact request inbox and support queue.">
        <section className="admin-card">
          <div className="admin-form-section-title">Contacts</div>
          <div className="admin-preview-copy">Loading contact requests...</div>
        </section>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Contacts" subtitle="Contact request inbox and support queue.">
      <section className="admin-card">
        <div className="admin-card-head admin-card-head--categories">
          <div>
            <div className="admin-card-kicker">Inbox</div>
            <div className="admin-card-title">Contact requests</div>
            <div className="admin-card-subtitle">
              Browse all incoming contact messages in a searchable, paginated table.
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
              placeholder="Search by name, email, phone"
            />
            <div className="admin-category-toolbar-actions">
              <div className="admin-chip">{filteredContacts.length} contacts</div>
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
                    <th><strong>Email</strong></th>
                    <th><strong>Phone</strong></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedContacts.length ? (
                    paginatedContacts.map((contact) => {
                      const isSelected = selectedContact?.id === contact.id;

                      return (
                        <tr
                          key={contact.id}
                          onClick={() => handlePreviewContact(contact.id)}
                          className={isSelected ? 'is-active' : ''}
                        >
                          <td data-label="Name"><strong>{contact.fullName}</strong></td>
                          <td data-label="Email">{contact.email || '--'}</td>
                          <td data-label="Phone">{contact.phone || '--'}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={3}>
                        <div className="admin-preview-copy">No contact requests matched your search.</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="admin-pagination-row">
              <div className="admin-preview-copy">
                Showing {paginatedContacts.length ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, filteredContacts.length)} of {filteredContacts.length}
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
              <div className="admin-card-kicker">Contact preview</div>
              <div className="admin-card-title">{selectedContact?.fullName}</div>
              <div className="admin-card-subtitle">Message details for the selected contact request.</div>

              <div className="admin-placeholder admin-placeholder--compact" style={{ marginTop: '16px' }}>
                <div>
                  <strong>{selectedContact?.fullName}</strong>
                  <div>Email: {selectedContact?.email || '--'}</div>
                  <div>Phone: {selectedContact?.phone || '--'}</div>
                  <div>Created At: {formatDate(selectedContact?.createdAt)}</div>
                  <div>Updated At: {formatDate(selectedContact?.updatedAt)}</div>
                  <div style={{ marginTop: '10px' }}>{selectedContact?.message || '--'}</div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </AdminLayout>
  );
}
