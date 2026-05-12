import { useState, useCallback, useEffect } from 'react';
import {
  getOrders,
  getUserOrders,
  getOrderById,
  getUserOrderById,
  updateOrderStatus as updateOrderStatusRequest,
  getAllCustomers
} from '../services/orderService';

/**
 * Normalize order data from API response to component structure
 * Maps order.items array structure to normalized format
 */
const normalizeOrder = (order) => ({
  id: String(order?.id || ''),
  status: order?.status || 'pending',
  subtotal: parseFloat(order?.subtotal || 0),
  couponCode: order?.coupon_code || null,
  couponDiscount: parseFloat(order?.coupon_discount || 0),
  totalPrice: parseFloat(order?.total_price || 0),
  createdAt: order?.created_at || '',
  updatedAt: order?.updated_at || '',
  user: {
    id: String(order?.user?.id || ''),
    name: order?.user?.name || '',
    email: order?.user?.email || '',
    phone: order?.user?.phone || '',
  },
  payment: {
    id: String(order?.payment?.id || ''),
    orderId: String(order?.payment?.order_id || ''),
    transactionId: order?.payment?.transaction_id || null,
    paymentMethod: order?.payment?.payment_method || '',
    totalPrice: parseFloat(order?.payment?.total_price || 0),
    status: order?.payment?.status || 'pending',
    responseData: order?.payment?.response_data || null,
    createdAt: order?.payment?.created_at || '',
    updatedAt: order?.payment?.updated_at || '',
  },
  items: Array.isArray(order?.items)
    ? order.items.map((item) => ({
        id: String(item?.id || ''),
        productId: String(item?.product_id || ''),
        productName: item?.product_name || '',
        quantity: Number(item?.quantity || 0),
        price: parseFloat(item?.price || 0),
        productImage: item?.product_image || '',
      }))
    : [],
});

export default function useOrders(options = {}) {
  const { autoLoad = true, scope = 'admin' } = options || {};
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(autoLoad));
  const [updatingOrderId, setUpdatingOrderId] = useState('');
  const [error, setError] = useState('');

  const isEmployeeScope = scope === 'user';
  const fetchOrdersRequest = isEmployeeScope ? getUserOrders : getOrders;
  const fetchOrderByIdRequest = isEmployeeScope ? getUserOrderById : getOrderById;

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetchOrdersRequest();
      const normalizedOrders = Array.isArray(response)
        ? response.map(normalizeOrder)
        : [];
      setOrders(normalizedOrders);
      return normalizedOrders;
    } catch (err) {
      const errorMsg = err?.message || 'Unable to fetch orders.';
      setError(errorMsg);
      console.error('useOrders error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [fetchOrdersRequest]);

  const loadOrderById = useCallback(async (orderId) => {
    const normalizedOrderId = String(orderId || '');
    if (!normalizedOrderId) {
      return null;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetchOrderByIdRequest(normalizedOrderId);
      const responseOrder = response?.id ? response : response?.data?.id ? response.data : response?.data?.order || response?.order || response;
      const normalizedOrder = normalizeOrder(responseOrder);

      setOrder(normalizedOrder);
      setOrders([normalizedOrder]);
      return normalizedOrder;
    } catch (err) {
      const errorMsg = err?.message || 'Unable to fetch order details.';
      setError(errorMsg);
      console.error('loadOrderById error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchOrderByIdRequest]);

  const updateOrderStatus = useCallback(async (orderId, status) => {
    const normalizedOrderId = String(orderId || '');
    if (!normalizedOrderId || !status) {
      return null;
    }

    setUpdatingOrderId(normalizedOrderId);
    setError('');

    try {
      const response = await updateOrderStatusRequest(normalizedOrderId, status);
      const responseOrder = response?.data?.id ? response.data : response?.data?.order || response?.order || response;
      const updatedOrder = normalizeOrder(responseOrder);

      setOrders((currentOrders) =>
        currentOrders.map((order) => (
          order.id === normalizedOrderId
            ? {
                ...order,
                status: updatedOrder.status || status,
                updatedAt: updatedOrder.updatedAt || order.updatedAt,
              }
            : order
        ))
      );

      return updatedOrder;
    } catch (err) {
      const errorMsg = err?.message || 'Unable to update order status.';
      setError(errorMsg);
      console.error('updateOrderStatus error:', err);
      throw err;
    } finally {
      setUpdatingOrderId('');
    }
  }, []);

  const loadCustomers = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getAllCustomers();
      const customers = Array.isArray(response?.data) ? response.data : [];
      return customers;
    } catch (err) {
      const errorMsg = err?.message || 'Unable to fetch customers.';
      setError(errorMsg);
      console.error('loadCustomers error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);
  


  useEffect(() => {
    if (autoLoad) {
      loadOrders();
    }
  }, [autoLoad, loadOrders]);

  return {
    orders,
    order,
    isLoading,
    error,
    loadOrders,
    loadOrderById,
    updateOrderStatus,
    updatingOrderId,
  };
}