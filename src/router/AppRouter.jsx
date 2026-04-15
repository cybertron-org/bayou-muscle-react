import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Home from '../pages/Home';
import Shop from '../pages/Shop';
import ProductDetail from '../pages/ProductDetail/ProductDetail';
import Contact from '../pages/Contact';
import Cart from '../pages/Cart';
import Blog from '../pages/Blog';
import AdminDashboard from '../admin/pages/AdminDashboard';
import AdminAddProduct from '../admin/pages/AdminAddProduct';
import AdminProducts from '../admin/pages/AdminProducts';
import AdminOrders from '../admin/pages/AdminOrders';
import AdminUsers from '../admin/pages/AdminUsers';
import AdminSettings from '../admin/pages/AdminSettings';
import AdminCategories from '../admin/pages/AdminCategories';
import AdminDiscounts from '../admin/pages/AdminDiscounts';
import AdminLogin from '../admin/pages/AdminLogin'; 
import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRouter() {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		window.__navigate = (target) => navigate(target);
	}, [navigate]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location.pathname]);

	return (
		<Routes>
			<Route path="/" element={<Navigate to="/home" replace />} />
			<Route path="/home" element={<Home />} />
			<Route path="/shop" element={<Shop />} />
			<Route path="/product" element={<ProductDetail onNavigate={navigate} />} />
			<Route path="/contact" element={<Contact />} />
			<Route path="/cart" element={<Cart onNavigate={navigate} initialView="cart" />} />
			<Route path="/checkout" element={<Cart onNavigate={navigate} initialView="checkout" />} />
			<Route path="/blog" element={<Blog onNavigate={navigate} />} />
			<Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
			<Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
			<Route path="/admin/products" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
			<Route path="/admin/products/add" element={<ProtectedRoute><AdminAddProduct /></ProtectedRoute>} />
			<Route path="/admin/products/:productId/edit" element={<ProtectedRoute><AdminAddProduct /></ProtectedRoute>} />
			<Route path="/admin/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
			<Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
			<Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
			<Route path="/admin/categories" element={<ProtectedRoute><AdminCategories /></ProtectedRoute>} />
			<Route path="/admin/discounts" element={<ProtectedRoute><AdminDiscounts /></ProtectedRoute>} />
			<Route path="/admin/login" element={<AdminLogin />} />
			<Route path="*" element={<Navigate to="/home" replace />} />
		</Routes>
	);
}
