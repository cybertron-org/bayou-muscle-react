import apiRequest from './api';

export const fetchCategories = async () => {
  const response = await apiRequest('/product-categories', {
    method: 'GET',
  });
  return response;
};

export const createCategory = async (categoryData) => {
  const response = await apiRequest('/admin/product-categories/create', {
    method: 'POST',
    data: categoryData,
  });
  return response;
};

export const updateCategory = async (categoryId, categoryData) => {
  const response = await apiRequest(`/admin/product-categories/update/${categoryId}`, {
    method: 'POST',
    data: categoryData,
  });
  return response;
};

export const deleteCategory = async (categoryId) => {
  const response = await apiRequest(`/admin/product-categories/delete/${categoryId}`, {
    method: 'DELETE',
  });
  return response;
};

export const getSubCategoryByCategoryId = async (categoryId) => {
  const response = await apiRequest(`/product-categories/${categoryId}/subcategories`, {
    method: 'GET',
  });
  return response;
};

