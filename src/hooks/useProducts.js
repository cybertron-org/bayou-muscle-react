import { useCallback, useEffect, useState } from 'react';

import { fetchProducts, createProduct, deleteProduct, updateProduct, getProductsByCategory, fetchWishlist,removeProductFromWishlist,checkout } from '../services/productsService';

const normalizeProduct = (item) => ({
    id: String(item?.id || ''),
    wishlistId: item?.wishlistId ?? null,
    name: item?.name || 'Untitled',
    slug: item?.slug || '',
    price: item?.price ?? item?.original_price ?? item?.discounted_price ?? '0',
    discountedPrice: item?.discounted_price ?? item?.price ?? item?.original_price ?? '0',
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
    categoryTitle: item?.category?.title || item?.category || item?.category_title || '--',
    categorySlug: item?.category_slug || item?.category?.slug || '',
    originalPrice: item?.original_price ?? null,
    discountPercentage: item?.discount_percentage ?? null,
    rating: item?.rating || { average: 0, count: 0, stars: 0 },
    image: item?.image || item?.thumbnail || '',
    img: item?.image || item?.thumbnail || '',
    cat: item?.category?.title || item?.category || item?.category_title || '--',
    images: Array.isArray(item?.images)
        ? item.images.map((image) => ({
            id: String(image?.id || ''),
            image: image?.image || '',
            isMain: Number(image?.is_main || 0),
        }))
        : item?.image
            ? [{
                id: String(item?.id || ''),
                image: item?.image,
                isMain: 1,
            }]
            : [],
});

export default function useProducts(options = {}) {
    const { autoLoad = true } = options || {};
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(Boolean(autoLoad));
    const [error, setError] = useState('');

    const loadProducts = useCallback(async (params) => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetchProducts(params);
            const mappedProducts = Array.isArray(response?.data)
                ? response.data.map(normalizeProduct)
                : [];
            setProducts(mappedProducts);
            return mappedProducts;
        } catch (err) {
            setError(err?.message || 'Unable to fetch products.');
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addProduct = useCallback(async (productData) => {
        const response = await createProduct(productData);
        const created = response?.data;
        if (!created?.id) {
            throw new Error('Invalid create product response.');
        }
        const mappedProduct = normalizeProduct(created);
        setProducts((prev) => [mappedProduct, ...prev]);
        return mappedProduct;
    }, []);

    const editProduct = useCallback(async (productId, productData) => {
        const response = await updateProduct(productId, productData);
        const updated = response?.data;
        if (!updated?.id) {
            throw new Error('Invalid update product response.');
        }
        const mappedProduct = normalizeProduct(updated);
        setProducts((prev) =>
            prev.map((item) => (item.id === mappedProduct.id ? mappedProduct : item))
        );
        return mappedProduct;
    }, []);

    const deleteExistingProduct = useCallback(async (productId) => {
        await deleteProduct(productId);
        setProducts((prev) => prev.filter((item) => String(item.id) !== String(productId)));
    }, []);

    const loadProductsByCategory = useCallback(async (categorySlug) => {
        setIsLoading(true);
        setError('');
        try {
            const response = await getProductsByCategory(categorySlug);
            const mappedProducts = Array.isArray(response?.data)
                ? response.data.map(normalizeProduct)
                : [];
            setProducts(mappedProducts);
            return mappedProducts;
        }
        catch (err) {
            setError(err?.message || 'Unable to fetch products by category.');
            return [];
        }
        finally {
            setIsLoading(false);
        }
    }, []);

    const loadWishlist = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetchWishlist();
            const wishlistItems = Array.isArray(response?.data)
                ? response.data
                : Array.isArray(response)
                    ? response
                    : [];

            const mappedProducts = wishlistItems.map((item) =>
                normalizeProduct({
                    ...(item?.product || {}),
                    wishlistId: item?.id,
                    quantity: item?.product?.quantity ?? 1,
                })
            );
            setProducts(mappedProducts);
            return mappedProducts;
        }
        catch (err) {
            setError(err?.message || 'Unable to fetch wishlist products.');
            return [];
        }
        finally {
            setIsLoading(false);
        }
    }, []);

    const removeFromWishlist = useCallback(async (wishlistId) => {
        setIsLoading(true);
        setError('');
        try {
            await removeProductFromWishlist(wishlistId);
            setProducts((prev) => prev.filter((item) => String(item.wishlistId) !== String(wishlistId)));
        }
        catch (err) {
            setError(err?.message || 'Unable to remove product from wishlist.');
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    }, []);

    const checkoutProducts = useCallback(async (checkoutData) => {
        setIsLoading(true);
        setError('');
        try {
            const response = await checkout(checkoutData);
            return response;
        }
        catch (err) {
            setError(err?.message || 'Unable to complete checkout.');
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    }, []);




    useEffect(() => {
        if (autoLoad) {
            loadProducts();
        }
    }, [autoLoad, loadProducts]);

    return {
        products,
        isLoading,
        error,
        loadProducts,
        loadProductsByCategory,
        addProduct,
        editProduct,
        deleteExistingProduct,
        loadWishlist,
        removeFromWishlist,
        checkoutProducts,
    };
}