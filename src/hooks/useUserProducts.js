import { useCallback } from "react";
import {
    getFeaturedProducts,
    getLatestProducts,
    getProductDetails,
    addProductReview,
    fetchProductReviews,
    addProductToWishlist

} from "../services/productsService";

const formatPrice = (value) => {
    const amount = Number(value);
    if (Number.isNaN(amount)) {
        return "$0.00";
    }
    return `$${amount.toFixed(2)}`;
};

const normalizeProductCard = (item) => {
    const starsRaw = Number(item?.rating?.stars ?? 0);
    const stars = Math.max(0, Math.min(5, starsRaw));
    const reviews = Number(item?.rating?.count ?? 0);
    const discount = Number(item?.discount_percentage ?? 0);

    return {
        id: item?.id,
        slug: item?.slug || null,
        name: item?.name || "Untitled Product",
        cat: item?.category || "General",
        price: formatPrice(item?.price),
        oldPrice: item?.original_price != null ? formatPrice(item?.original_price) : null,
        badge: discount > 0 ? `-${Math.round(discount)}%` : null,
        stars,
        reviews,
        img: item?.image || "/images/p14.png",
    };
};

const normalizeProductDetail = (item) => {
    const base = normalizeProductCard(item);
    const relatedItems = Array.isArray(item?.related_products)
        ? item.related_products.map(normalizeProductCard)
        : [];

    return {
        ...base,
        categorySlug: item?.category_slug || null,
        url: item?.url || null,
        summary: item?.summary || "",
        description: item?.description || "",
        additionalInfo: item?.additional_info || "",
        ratingAverage: Number(item?.rating?.average ?? 0),
        reviewsList: Array.isArray(item?.reviews) ? item.reviews : [],
        relatedProducts: relatedItems,
    };
};

const useUserProducts = () => {
    const fetchUserProducts = useCallback(async () => {
    try {   
        const response = await getFeaturedProducts();
                const items = Array.isArray(response?.data) ? response.data : [];
                return items.map(normalizeProductCard);
    }
    catch (error) {
        console.error('Error fetching user products:', error);
        throw error;
    }
    }, []);

    const fetchLatestProducts = useCallback(async () => {
        try {
            const response = await getLatestProducts();
            const items = Array.isArray(response?.data) ? response.data : [];
            return items.map(normalizeProductCard);
        } catch (error) {
            console.error('Error fetching latest products:', error);
            throw error;
        }
    }, []);


    const getProduct = useCallback(async (productslug) => {
        try {
            const response = await getProductDetails(productslug);
            return normalizeProductDetail(response?.data);
        } catch (error) {
            console.error('Error fetching product details:', error);
            throw error;
        }
    }, []);

    const addReview = useCallback(async (reviewData) => {
        try {
            const response = await addProductReview(reviewData);
            return response?.data;
        } catch (error) {
            console.error('Error adding product review:', error);
            throw error;
        }
    }, []);

    const fetchReviews = useCallback(async (productId) => {
        try {
            const response = await fetchProductReviews(productId);
            return Array.isArray(response?.data) ? response.data : [];
        } catch (error) {
            console.error('Error fetching product reviews:', error);
            throw error;
        }
    }, []);

    const addToWishlist = useCallback(async (productId) => {
        try {
            const response = await addProductToWishlist(productId);
            return response?.data;
        } catch (error) {
            console.error('Error adding product to wishlist:', error);
            throw error;
        }
    }, []);




    return { fetchUserProducts, fetchLatestProducts, getProduct, addReview, fetchReviews, addToWishlist };
};

export default useUserProducts;
