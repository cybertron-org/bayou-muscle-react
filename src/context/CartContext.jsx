import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
    addToCart,
    applyCartCoupon,
    clearCartItems,
    fetchCartItems,
    removeCartItem,
    updateCartItem,
} from '../services/cartService';

const TOKEN_KEY = 'access_token';

const CartContext = createContext(null);

const getStoredToken = () => localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || '';

const extractPayload = (response) => {
    if (!response) {
        return null;
    }

    if (
        typeof response === 'object'
        && !Array.isArray(response)
        && (
            Object.prototype.hasOwnProperty.call(response, 'status')
            || Object.prototype.hasOwnProperty.call(response, 'subtotal')
            || Object.prototype.hasOwnProperty.call(response, 'coupon_discount')
            || Object.prototype.hasOwnProperty.call(response, 'total')
            || Object.prototype.hasOwnProperty.call(response, 'applied_coupon')
        )
    ) {
        return response;
    }

    if (
        response?.data
        && typeof response.data === 'object'
        && !Array.isArray(response.data)
        && (
            Object.prototype.hasOwnProperty.call(response.data, 'status')
            || Object.prototype.hasOwnProperty.call(response.data, 'subtotal')
            || Object.prototype.hasOwnProperty.call(response.data, 'coupon_discount')
            || Object.prototype.hasOwnProperty.call(response.data, 'total')
            || Object.prototype.hasOwnProperty.call(response.data, 'applied_coupon')
        )
    ) {
        return response.data;
    }

    return response;
};

const normalizeCartItem = (item) => {
    const product = item?.product || {};

    return {
        id: String(item?.id || ''),
        productId: String(item?.product_id || product?.id || ''),
        productName: product?.name || item?.product_name || 'Unknown Product',
        productSlug: product?.slug || '',
        image: product?.image || item?.image || '',
        quantity: Number(item?.quantity ?? 0),
        unitPrice: Number(item?.unit_price ?? product?.price ?? 0),
        discountedPrice: Number(item?.discounted_price ?? product?.discounted_price ?? product?.price ?? item?.unit_price ?? 0),
        total: Number(item?.total_price ?? item?.total ?? 0),
        createdAt: item?.created_at || null,
        updatedAt: item?.updated_at || null,
    };
};

const EMPTY_SUMMARY = {
    subtotal: 0,
    couponDiscount: 0,
    total: 0,
    appliedCoupon: null,
};

export function CartProvider({ children }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [authToken, setAuthToken] = useState(getStoredToken());
    const [cartItems, setCartItems] = useState([]);
    const [cartSummary, setCartSummary] = useState(EMPTY_SUMMARY);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const inFlightRef = useRef(null);
    const lastLoadedAtRef = useRef(0);

    const isAuthenticated = Boolean(authToken);

    const syncToken = useCallback(() => {
        setAuthToken(getStoredToken());
    }, []);

    const resetCartState = useCallback(() => {
        setCartItems([]);
        setCartSummary(EMPTY_SUMMARY);
        setError('');
        lastLoadedAtRef.current = 0;
    }, []);

    const loadCartItems = useCallback(async (options = {}) => {
        const { force = false } = options;

        if (!isAuthenticated) {
            resetCartState();
            return [];
        }

        if (inFlightRef.current && !force) {
            return inFlightRef.current;
        }

        setIsLoading(true);
        setError('');

        const request = (async () => {
            try {
                const response = await fetchCartItems();
                const payload = extractPayload(response) || {};
                const fetched = Array.isArray(payload?.data)
                    ? payload.data
                    : Array.isArray(payload)
                        ? payload
                        : [];

                if (!Array.isArray(fetched)) {
                    throw new Error('Invalid cart items response.');
                }

                const mappedItems = fetched.map(normalizeCartItem);
                setCartItems(mappedItems);
                setCartSummary({
                    subtotal: Number(payload?.subtotal ?? 0),
                    couponDiscount: Number(payload?.coupon_discount ?? 0),
                    total: Number(payload?.total ?? 0),
                    appliedCoupon: payload?.applied_coupon || null,
                });
                lastLoadedAtRef.current = Date.now();
                return mappedItems;
            } catch (err) {
                setError(err?.message || 'Unable to fetch cart items.');
                return [];
            }
        })();

        inFlightRef.current = request;

        try {
            return await request;
        } finally {
            if (inFlightRef.current === request) {
                inFlightRef.current = null;
            }
            setIsLoading(false);
        }
    }, [isAuthenticated, resetCartState]);

    const requireAuth = useCallback(() => {
        const nextToken = getStoredToken();
        if (!nextToken) {
            navigate('/login');
            return false;
        }
        return true;
    }, [navigate]);

    const addItemToCart = useCallback(async (productId, quantity = 1) => {
        if (!requireAuth()) {
            return null;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await addToCart(productId, quantity);
            const payload = extractPayload(response);
            const added = payload?.data || payload;
            if (!added) {
                throw new Error('Invalid add to cart response.');
            }

            await loadCartItems({ force: true });
            return normalizeCartItem(added);
        } catch (err) {
            setError(err?.message || 'Unable to add item to cart.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [loadCartItems, requireAuth]);

    const updateItemQuantity = useCallback(async (cartItemId, quantity) => {
        if (!requireAuth()) {
            return null;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await updateCartItem(cartItemId, quantity);
            const payload = extractPayload(response);
            const updated = payload?.data || payload;
            if (!updated) {
                throw new Error('Invalid update cart item response.');
            }

            await loadCartItems({ force: true });
            return normalizeCartItem(updated);
        } catch (err) {
            setError(err?.message || 'Unable to update cart item.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [loadCartItems, requireAuth]);

    const removeItemFromCart = useCallback(async (cartItemId) => {
        if (!requireAuth()) {
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await removeCartItem(cartItemId);
            await loadCartItems({ force: true });
        } catch (err) {
            setError(err?.message || 'Unable to remove cart item.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [loadCartItems, requireAuth]);

    const clearCart = useCallback(async () => {
        if (!requireAuth()) {
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await clearCartItems();
            resetCartState();
        } catch (err) {
            setError(err?.message || 'Unable to clear cart.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [requireAuth, resetCartState]);

    const applyCoupon = useCallback(async (couponCode) => {
        if (!requireAuth()) {
            return null;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await applyCartCoupon(couponCode);
            const payload = extractPayload(response);
            const applied = payload?.data || payload;

            if (!applied) {
                throw new Error('Invalid apply coupon response.');
            }

            await loadCartItems({ force: true });
            return applied;
        } catch (err) {
            setError(err?.message || 'Unable to apply coupon.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [loadCartItems, requireAuth]);

    const cartCount = useMemo(
        () => cartItems.reduce((sum, item) => sum + Number(item?.quantity || 0), 0),
        [cartItems],
    );

    useEffect(() => {
        syncToken();
    }, [location.pathname, syncToken]);

    useEffect(() => {
        const handleStorage = (event) => {
            if (event.key === TOKEN_KEY || event.key === null) {
                syncToken();
            }
        };

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [syncToken]);

    useEffect(() => {
        if (!isAuthenticated) {
            resetCartState();
            return;
        }

        loadCartItems({ force: true }).catch(() => {});
    }, [isAuthenticated, loadCartItems, resetCartState]);

    useEffect(() => {
        const refreshIfStale = () => {
            if (!isAuthenticated) {
                return;
            }

            const isStale = Date.now() - lastLoadedAtRef.current > 60000;
            if (isStale) {
                loadCartItems().catch(() => {});
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                refreshIfStale();
            }
        };

        window.addEventListener('focus', refreshIfStale);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('focus', refreshIfStale);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isAuthenticated, loadCartItems]);

    const value = useMemo(() => ({
        cartItems,
        cartSummary,
        cartCount,
        isLoading,
        error,
        loadCartItems,
        addItemToCart,
        updateItemQuantity,
        removeItemFromCart,
        clearCart,
        applyCoupon,
    }), [
        cartItems,
        cartSummary,
        cartCount,
        isLoading,
        error,
        loadCartItems,
        addItemToCart,
        updateItemQuantity,
        removeItemFromCart,
        clearCart,
        applyCoupon,
    ]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCartContext must be used within CartProvider.');
    }
    return context;
}
