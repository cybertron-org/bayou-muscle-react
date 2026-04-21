import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import Register from '../pages/Register';
import Login from '../pages/Auth/Login';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import ResetPassword from '../pages/Auth/ResetPassword';
import Home          from '../pages/Home';
import About         from '../pages/About/About';
import Supplements   from '../pages/Supplements/Supplements';
import Shop          from '../pages/Shop-old';
import Merchandise   from '../pages/Merchandise/Merchandise';
import ProductDetail from '../pages/ProductDetail/ProductDetail';
import Contact       from '../pages/Contact';
import Cart          from '../pages/Cartx';
import Blog          from '../pages/Blog/Blog';
import BlogDetails   from '../pages/BlogDetails/BlogDetails'; 
import Profile 	 from '../pages/Profile/Profile';

import AdminDashboard  from '../admin/pages/AdminDashboard';
import AdminAddProduct from '../admin/pages/AdminAddProduct';
import AdminProducts   from '../admin/pages/AdminProducts';
import AdminOrders     from '../admin/pages/AdminOrders';
import AdminUsers      from '../admin/pages/AdminUsers';
import AdminSettings   from '../admin/pages/AdminSettings';
import AdminCategories from '../admin/pages/AdminCategories';
import AdminLogin from '../admin/pages/AdminLogin'; 
import AdminReviews from '../admin/pages/AdminReviews';
import AdminBlogs from '../admin/pages/AdminBlogs';
import AdminBlogDetails from '../admin/pages/AdminBlogDetails';
import AdminAddBlogs from '../admin/pages/AdminAddBlogs';
import AdminBlogCategory from '../admin/pages/AdminBlogCategory';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminDiscounts  from '../admin/pages/AdminDiscounts';


export default function AppRouter() {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		window.__navigate = (target, productId) =>
			productId ? navigate(`/${target}/${productId}`) : navigate(`/${target}`);
	}, [navigate]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location.pathname]);

	return (
		<Routes>
			{/* Public routes */}
			<Route path="/"            element={<Navigate to="/home" replace />} />
			<Route path="/login"       element={<Login />} />
			<Route path="/forgot-password" element={<ForgotPassword />} />
			<Route path="/reset-password" element={<ResetPassword />} />
			<Route path="/home"        element={<Home />} />
			<Route path="/about"       element={<About />} />
			<Route path="/supplements" element={<Supplements />} />
			<Route path="/shop"        element={<Shop />} />
			<Route path="/merchandise" element={<Merchandise />} />
			<Route path="/product"      element={<ProductDetail onNavigate={navigate} />} />
			<Route path="/product/:slug" element={<ProductDetail onNavigate={navigate} />} />
			<Route path="/contact"     element={<Contact />} />
			<Route path="/register"    element={<Register />} />
			<Route path="/cart"        element={<Cart onNavigate={navigate} initialView="cart" />} />
			<Route path="/checkout"    element={<Cart onNavigate={navigate} initialView="checkout" />} />
			<Route path="/blog"        element={<Blog onNavigate={navigate} />} />
			<Route path="/blogdetails" element={<BlogDetails />} />
			<Route
				path="/profile"
				element={
					<ProtectedRoute
						allowedRoles={['user']}
						unauthenticatedRedirect="/login"
						unauthorizedRedirect="/admin/dashboard"
					>
						<Profile />
					</ProtectedRoute>
				}
			/>
			{/* Admin routes */}
			<Route path="/admin/login" element={<AdminLogin />} />
			<Route path="/admin/reviews" element={<ProtectedRoute allowedRoles={['admin']} unauthenticatedRedirect="/admin/login" unauthorizedRedirect="/profile"><AdminReviews /></ProtectedRoute>} />
			<Route path="/admin/blogs" element={<ProtectedRoute allowedRoles={['admin']} unauthenticatedRedirect="/admin/login" unauthorizedRedirect="/profile"><AdminBlogs /></ProtectedRoute>} />
			<Route path="/admin/blogs/add" element={<ProtectedRoute allowedRoles={['admin']} unauthenticatedRedirect="/admin/login" unauthorizedRedirect="/profile"><AdminAddBlogs /></ProtectedRoute>} />
			<Route path="/admin/blogs/:blogId" element={<ProtectedRoute allowedRoles={['admin']} unauthenticatedRedirect="/admin/login" unauthorizedRedirect="/profile"><AdminBlogDetails /></ProtectedRoute>} />
			<Route path="/admin/blogs/:blogId/edit" element={<ProtectedRoute allowedRoles={['admin']} unauthenticatedRedirect="/admin/login" unauthorizedRedirect="/profile"><AdminAddBlogs /></ProtectedRoute>} />
			<Route path="/admin/blog-categories" element={<ProtectedRoute allowedRoles={['admin']} unauthenticatedRedirect="/admin/login" unauthorizedRedirect="/profile"><AdminBlogCategory /></ProtectedRoute>} />
			<Route path="/admin"                        element={<ProtectedRoute allowedRoles={['admin']} unauthenticatedRedirect="/admin/login" unauthorizedRedirect="/profile"><AdminDashboard /></ProtectedRoute>} />
			<Route path="/admin/dashboard"              element={<ProtectedRoute allowedRoles={['admin']} unauthenticatedRedirect="/admin/login" unauthorizedRedirect="/profile"><AdminDashboard /></ProtectedRoute>} />
			<Route path="/admin/products"               element={<ProtectedRoute allowedRoles={['admin']} unauthenticatedRedirect="/admin/login" unauthorizedRedirect="/profile"><AdminProducts /></ProtectedRoute>} />
			<Route path="/admin/products/add"           element={<ProtectedRoute allowedRoles={['admin']} unauthenticatedRedirect="/admin/login" unauthorizedRedirect="/profile"><AdminAddProduct /></ProtectedRoute>} />
			<Route path="/admin/products/:productId/edit" element={<ProtectedRoute allowedRoles={['admin']} unauthenticatedRedirect="/admin/login" unauthorizedRedirect="/profile"><AdminAddProduct /></ProtectedRoute>} />
			<Route path="/admin/orders"                 element={<ProtectedRoute allowedRoles={['admin']} unauthenticatedRedirect="/admin/login" unauthorizedRedirect="/profile"><AdminOrders /></ProtectedRoute>} />
			<Route path="/admin/users"                  element={<ProtectedRoute allowedRoles={['admin']} unauthenticatedRedirect="/admin/login" unauthorizedRedirect="/profile"><AdminUsers /></ProtectedRoute>} />
			<Route path="/admin/settings"               element={<ProtectedRoute allowedRoles={['admin']} unauthenticatedRedirect="/admin/login" unauthorizedRedirect="/profile"><AdminSettings /></ProtectedRoute>} />
			<Route path="/admin/categories"             element={<ProtectedRoute allowedRoles={['admin']} unauthenticatedRedirect="/admin/login" unauthorizedRedirect="/profile"><AdminCategories /></ProtectedRoute>} />
			<Route path="/admin/discounts"              element={<ProtectedRoute allowedRoles={['admin']} unauthenticatedRedirect="/admin/login" unauthorizedRedirect="/profile"><AdminDiscounts /></ProtectedRoute>} />

			<Route path="*" element={<Navigate to="/home" replace />} />
		</Routes>
	);
}
