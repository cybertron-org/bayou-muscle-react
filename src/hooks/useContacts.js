import { useCallback, useEffect, useState } from 'react';
import { fetchContacts,submitContact } from '../services/contactService';

const normalizeContact = (contact) => ({
    id: String(contact?.id || ''),
    fullName: contact?.full_name || 'Unnamed',
    email: contact?.email || '',
    phone: contact?.phone || '--',
    message: contact?.message || '--',
    createdAt: contact?.created_at || null,
    updatedAt: contact?.updated_at || null,
});

export default function useContacts() {
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const loadContacts = useCallback(async (params) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetchContacts(params);
            const mappedContacts = Array.isArray(response?.data)
                ? response.data.map(normalizeContact)
                : [];
            setContacts(mappedContacts);
            return mappedContacts;
        } catch (err) {
            setError(err?.message || 'Unable to fetch contacts.');
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    const submitUserContact = useCallback(async (data) => {
        setIsLoading(true);
        setError('');
        try {
            const response = await submitContact(data);
            return response;
        } catch (err) {
            setError(err?.message || 'Unable to submit contact.');
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadContacts();
    }, [loadContacts]);

    return {
        contacts,
        isLoading,
        error,
        loadContacts,
        submitUserContact,
    };
}