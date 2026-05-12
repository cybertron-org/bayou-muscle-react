import apiRequest from "./api";

export const fetchCartItems = async () => {
    const response = await apiRequest('/cart', {
        method: 'GET',
    });
    return response;
}

export const addToCart = async (productId, quantity) => {
    const response = await apiRequest('/cart', {
        method: 'POST',
        data: { product_id: productId, quantity },
    });
    return response;
}

export const updateCartItem = async (cartItemId, quantity) => {
    const response = await apiRequest(`/cart/update/${cartItemId}`, {
        method: 'POST',
        data: { quantity },
    });
    return response;
}

export const removeCartItem = async (cartItemId) => {
    const response = await apiRequest(`/cart/delete/${cartItemId}`, {
        method: 'DELETE',
    });
    return response;
}

export const clearCartItems = async () => {
    const response = await apiRequest('/cart/clear-all', {
        method: 'POST',
    });
    return response;    
}

export const applyCartCoupon = async (couponCode) => {
    const response = await apiRequest('/cart/apply-coupon', {
        method: 'POST',
        data: { coupon_code: couponCode },
    });
    return response;
}