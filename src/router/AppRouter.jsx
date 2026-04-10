import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Home from '../pages/Home';
import Shop from '../pages/Shop';
import ProductDetail from '../pages/ProductDetail';
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
			<Route path="/admin" element={<AdminDashboard />} />
			<Route path="/admin/dashboard" element={<AdminDashboard />} />
			<Route path="/admin/products" element={<AdminProducts />} />
			<Route path="/admin/products/add" element={<AdminAddProduct />} />
			<Route path="/admin/orders" element={<AdminOrders />} />
			<Route path="/admin/users" element={<AdminUsers />} />
			<Route path="/admin/settings" element={<AdminSettings />} />
			<Route path="/admin/categories" element={<AdminCategories />} />
			<Route path="/admin/discounts" element={<AdminDiscounts />} />
			<Route path="*" element={<Navigate to="/home" replace />} />
		</Routes>
	);
}
