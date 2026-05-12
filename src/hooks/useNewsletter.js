import { useCallback, useState } from 'react';
import { createNewsletterSubscription,fetchNewsletterSubscriptions,deleteNewsletterSubscription } from '../services/newsletterService';

const normalizeSubscription = (item) => ({  
    id: String(item?.id || ''),
    email: item?.email || '',
    createdAt: item?.created_at || null,
    updatedAt: item?.updated_at || null,
});

export default function useNewsletter() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const subscribe = useCallback(async (email) => {
        setIsLoading(true);
        setError('');
        try {
            const response = await createNewsletterSubscription({ email });
            const created = response?.data;
            if (!created?.id) {
                throw new Error('Invalid newsletter subscription response.');
            }
            const mappedSubscription = normalizeSubscription(created);
            setSubscriptions((prev) => [mappedSubscription, ...prev]);
            return mappedSubscription;
        } catch (err) {
            setError(err?.message || 'Unable to subscribe to newsletter.');
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    }, []);

    const fetchSubscriptions = useCallback(async (params) => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetchNewsletterSubscriptions(params);
            const fetched = response?.data;
            if (!Array.isArray(fetched)) {
                throw new Error('Invalid newsletter subscriptions response.');
            }
            const mappedSubscriptions = fetched.map(normalizeSubscription);
            setSubscriptions(mappedSubscriptions);
            return mappedSubscriptions;
        } catch (err) {
            setError(err?.message || 'Unable to fetch newsletter subscriptions.');
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    }, []);

    const deleteSubscription = useCallback(async (subscriptionId) => {
        setIsLoading(true);
        setError('');
        try {
            await deleteNewsletterSubscription(subscriptionId);
            setSubscriptions((prev) => prev.filter((item) => String(item.id) !== String(subscriptionId)));
        } catch (err) {
            setError(err?.message || 'Unable to delete newsletter subscription.');
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    }, []);



    return {
        subscriptions,
         subscribe,
         fetchSubscriptions,
         deleteSubscription,
         isLoading,
         error,
     };
 }