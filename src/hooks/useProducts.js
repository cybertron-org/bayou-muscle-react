import { useCallback, useEffect, useState } from 'react';

import { fetchProducts, createProduct, deleteProduct, updateProduct } from '../services/productsService';

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

export default function useProducts() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
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

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    return {
        products,
        isLoading,
        error,
        loadProducts,
        addProduct,
        editProduct,
        deleteExistingProduct
    };
}