import apiRequest from './api';

export const fetchProducts = async (params) => {
  const response = await apiRequest('/admin/products', {
    method: 'GET',
    params,
  });
  return response;
}

export const createProduct = async (productData) => {
  const response = await apiRequest('/admin/products/create', {
    method: 'POST',
    data: productData,
  });
  return response;
}

export const getProduct = async (productId) => {
  const response = await apiRequest(`/admin/products/${productId}`, {
    method: 'GET',
  });
  return response;
};

export const updateProduct = async (productId, productData) => {
  const response = await apiRequest(`/admin/products/update/${productId}`, {
    method: 'POST',
    data: productData,
  });
  return response;
};

export const deleteProduct = async (productId) => {
  const response = await apiRequest(`/admin/products/delete/${productId}`, {
    method: 'DELETE',
  });
  return response;
};

export const getFeaturedProducts = async () => {
  const response = await apiRequest('/website/feature-products', {
    method: 'GET',
  });
  return response;
}

export const getLatestProducts = async () => {
  const response = await apiRequest('/website/latest-releases', {
    method: 'GET',
  });
  return response;
}

export const getProductDetails = async (productslug) => {
  const response = await apiRequest(`/products/${productslug}`, {
    method: 'GET',
  });
  return response;
}

export const getProductsByCategory = async (categorySlug) => {
  const response = await apiRequest(`/website/prod-by-cat/${categorySlug}`, {
    method: 'GET',  
  });
  return response;
}

export const addProductReview = async (reviewData) => {
  const response = await apiRequest(`/reviews`, {
    method: 'POST',
    data: reviewData,
  });
  return response;
}

export const fetchProductReviews = async (productId) => {
  const response = await apiRequest(`/products/${productId}/reviews`, {
    method: 'GET',
  });
  return response;
}

export const addProductToWishlist = async (productId) => {
  const response = await apiRequest(`/wishlist`, {
    method: 'POST',
    data: { product_id: productId },
  });
  return response;
}

export const fetchWishlist = async () => {
  const response = await apiRequest('/wishlist', {
    method: 'GET',
  });
  return response;
}

export const removeProductFromWishlist = async (wishlistItemId) => {
  const response = await apiRequest(`/wishlist/${wishlistItemId}`, {
    method: 'DELETE',
  });
  return response;
}


export const checkout =  async (checkoutData) => {
  const response = await apiRequest('/checkout/place-order', {
    method: 'POST',
    data: checkoutData,
  });
  return response;
}