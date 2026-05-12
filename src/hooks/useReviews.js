import { useCallback, useEffect, useState } from 'react';
import { fetchReviews, changeStatus } from '../services/reviewService';

const normalizeReview = (review) => ({
    id: String(review?.id || ''),
    productId: String(review?.product_id || ''),
    userId: String(review?.user_id || ''),
    review: review?.review || '--',
    rating: review?.rating ?? 0,
    status: review?.status || 'pending',
    createdAt: review?.created_at || null,
    updatedAt: review?.updated_at || null,
    reviewerName: review?.user?.full_name || 'Anonymous',
    productName: review?.product?.name || 'Unknown Product',
});

export default function useReviews() {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const loadReviews = useCallback(async (params) => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetchReviews(params);
            const mappedReviews = Array.isArray(response?.data)
                ? response.data.map(normalizeReview)
                : [];
            setReviews(mappedReviews);
            return mappedReviews;
        } catch (err) {
            setError(err?.message || 'Unable to fetch reviews.');
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateReviewStatus = useCallback(async (reviewId, newStatus) => {
        setError('');
        try {
            const response = await changeStatus(reviewId, newStatus);
            const updated = response?.data;
            if (!updated?.id) {
                throw new Error('Invalid update review status response.');
            }
            const mappedReview = normalizeReview(updated);
            setReviews((prev) =>
                prev.map((item) => (item.id === mappedReview.id ? mappedReview : item))
            );
            return mappedReview;
        } catch (err) {
            setError(err?.message || 'Unable to update review status.');
            throw new Error(err?.message || 'Unable to update review status.');
        }
    }, []);

    useEffect(() => {
        loadReviews();
    }, [loadReviews]);

    return {
        reviews,
        isLoading,
        error,
        loadReviews,
        updateReviewStatus,
    };
}

