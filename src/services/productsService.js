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

