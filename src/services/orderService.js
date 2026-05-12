import apiRequest from './api';

/**
 * Fetch all orders (admin endpoint)
 * @returns {Promise} - Orders array with user, payment, and items details
 */
export const getOrders = async () => {
  try {
    const response = await apiRequest('/admin/orders');
    // API returns { status, message, data: [...orders] }
    return response?.data || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/**
 * Fetch single order by ID
 * @param {number} id - Order ID
 * @returns {Promise} - Order details
 */
export const getOrderById = async (id) => {
  try {
    const response = await apiRequest(`/admin/orders/${id}`);
    return response?.data || null;
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    throw error;
  }
};

/**
 * Update order status
 * @param {number} id - Order ID
 * @param {string} status - New status
 * @returns {Promise} - Updated order
 */
export const updateOrderStatus = async (id, status) => {
  try {
    const response = await apiRequest(`/admin/orders/${id}/status`, {
      method: 'POST',
      data: { status },
    });
    return response?.data || null;
  } catch (error) {
    console.error(`Error updating order ${id}:`, error);
    throw error;
  }
};


export const getUserOrders = async () => {
  try {
    const response = await apiRequest(`/orders`, {
      method: 'GET',
    });
    return response?.data || [];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

export const getUserOrderById = async (id) => {
  try {
    const response = await apiRequest(`/orders/${id}`, {
      method: 'GET',
    });
    return response?.data || null;
  } catch (error) {
    console.error(`Error fetching user order ${id}:`, error);
    throw error;
  }
};

export const getAllCustomers = async () => {
  try {
    const response = await apiRequest(`/admin/customers`, {
      method: 'GET',
    });
    return response?.data || [];
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

