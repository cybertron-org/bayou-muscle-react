import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { addProductToWishlist, fetchWishlist, removeProductFromWishlist } from '../services/productsService';

const TOKEN_KEY = 'access_token';

const WishlistContext = createContext(null);

const getStoredToken = () => localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || '';

const normalizeWishlistItem = (entry) => {
  const product = entry?.product || entry || {};

  return {
    wishlistId: String(entry?.id || entry?.wishlist_id || entry?.wishlistId || ''),
    productId: String(entry?.product_id || product?.id || ''),
    name: product?.name || 'Untitled Product',
    slug: product?.slug || '',
    summary: product?.summary || '',
    price: product?.price ?? 0,
    quantity: Number(product?.quantity ?? 1),
    img: String(entry?.product_image || product?.thumbnail || ''),
    createdAt: entry?.created_at || null,
    updatedAt: entry?.updated_at || null,
  };
};

export function WishlistProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [authToken, setAuthToken] = useState(getStoredToken());
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingProductIds, setPendingProductIds] = useState({});

  const inFlightRef = useRef(null);
  const lastLoadedAtRef = useRef(0);

  const isAuthenticated = Boolean(authToken);

  const syncToken = useCallback(() => {
    setAuthToken(getStoredToken());
  }, []);

  const resetWishlistState = useCallback(() => {
    setWishlistItems([]);
    setError('');
    setPendingProductIds({});
    lastLoadedAtRef.current = 0;
  }, []);

  const loadWishlist = useCallback(async (options = {}) => {
    const { force = false } = options;

    if (!isAuthenticated) {
      resetWishlistState();
      return [];
    }

    if (inFlightRef.current && !force) {
      return inFlightRef.current;
    }

    setIsLoading(true);
    setError('');

    const request = (async () => {
      try {
        const response = await fetchWishlist();
        const entries = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];

        const mappedItems = entries.map(normalizeWishlistItem).filter((item) => item.productId);
        setWishlistItems(mappedItems);
        lastLoadedAtRef.current = Date.now();
        return mappedItems;
      } catch (err) {
        setError(err?.message || 'Unable to fetch wishlist items.');
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
  }, [isAuthenticated, resetWishlistState]);

  const requireAuth = useCallback(() => {
    const token = getStoredToken();
    if (!token) {
      navigate('/login');
      return false;
    }
    return true;
  }, [navigate]);

  const wishlistMap = useMemo(() => {
    const map = new Map();
    wishlistItems.forEach((item) => {
      if (item.productId) {
        map.set(String(item.productId), String(item.wishlistId));
      }
    });
    return map;
  }, [wishlistItems]);

  const isWishlisted = useCallback(
    (productId) => wishlistMap.has(String(productId || '')),
    [wishlistMap],
  );

  const getWishlistIdByProduct = useCallback(
    (productId) => wishlistMap.get(String(productId || '')) || null,
    [wishlistMap],
  );

  const setProductPending = useCallback((productId, value) => {
    const key = String(productId || '');
    if (!key) {
      return;
    }

    setPendingProductIds((prev) => {
      if (value) {
        return { ...prev, [key]: true };
      }
      const { [key]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const isProductPending = useCallback(
    (productId) => Boolean(pendingProductIds[String(productId || '')]),
    [pendingProductIds],
  );

  const toggleWishlist = useCallback(async (productId) => {
    if (!requireAuth()) {
      return null;
    }

    const key = String(productId || '');
    if (!key || isProductPending(key)) {
      return null;
    }

    setError('');
    setProductPending(key, true);

    try {
      const existingWishlistId = getWishlistIdByProduct(key);

      if (existingWishlistId) {
        await removeProductFromWishlist(existingWishlistId);
        setWishlistItems((prev) => prev.filter((item) => String(item.productId) !== key));
      } else {
        await addProductToWishlist(key);
      }

      await loadWishlist({ force: true });
      return !existingWishlistId;
    } catch (err) {
      setError(err?.message || 'Unable to update wishlist.');
      throw err;
    } finally {
      setProductPending(key, false);
    }
  }, [getWishlistIdByProduct, isProductPending, loadWishlist, requireAuth, setProductPending]);

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
      resetWishlistState();
      return;
    }

    loadWishlist({ force: true }).catch(() => {});
  }, [isAuthenticated, loadWishlist, resetWishlistState]);

  useEffect(() => {
    const refreshIfStale = () => {
      if (!isAuthenticated) {
        return;
      }

      const isStale = Date.now() - lastLoadedAtRef.current > 60000;
      if (isStale) {
        loadWishlist().catch(() => {});
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
  }, [isAuthenticated, loadWishlist]);

  const value = useMemo(() => ({
    wishlistItems,
    wishlistCount: wishlistItems.length,
    isLoading,
    error,
    loadWishlist,
    toggleWishlist,
    isWishlisted,
    isProductPending,
    getWishlistIdByProduct,
  }), [
    wishlistItems,
    isLoading,
    error,
    loadWishlist,
    toggleWishlist,
    isWishlisted,
    isProductPending,
    getWishlistIdByProduct,
  ]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlistContext() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error('useWishlistContext must be used within a WishlistProvider.');
  }

  return context;
}
