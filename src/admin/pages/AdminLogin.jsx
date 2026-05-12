import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

export default function AdminLogin() {
	const navigate = useNavigate();
	const { login, logout, isLoading, error } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(true);
	const [formError, setFormError] = useState('');

	const onSubmit = async (event) => {
		event.preventDefault();
		setFormError('');

		const normalizedEmail = email.trim();
		if (!normalizedEmail || !password.trim()) {
			setFormError('Email and password are required.');
			toast.error('Email and password are required.');
			return;
		}

		try {
			const result = await login({
				email: normalizedEmail,
				password,
				rememberMe,
			});

			if (String(result?.role || '').toLowerCase() !== 'admin') {
				await logout();
				toast.error('Admin access only. Please use a valid admin account.');
				return;
			}

			toast.success(result?.message || 'Logged in successfully');
			navigate('/admin/dashboard', { replace: true });
		} catch (err) {
			toast.error(err?.message || 'Unable to sign in. Please try again.');
		}
	};

	return (
		<section className="admin-login-page">
			<div className="admin-login-ambient admin-login-ambient--left" />
			<div className="admin-login-ambient admin-login-ambient--right" />

			<div className="admin-login-shell">
				<aside className="admin-login-info">
					<div className="admin-login-brand">
						<div className="admin-login-brand-mark" ></div>

					</div>

					<div className="admin-login-headline" style={{color:"white"}}>Secure access for admin operations</div>
					<div className="admin-login-copy">Sign in with your admin credentials to access dashboard operations securely.</div>

					<div className="admin-login-badges">
						<span className="admin-login-badge">Admin Panel</span>
						<span className="admin-login-badge">Manage</span>
						<span className="admin-login-badge">Live Auth</span>
					</div>
				</aside>

				<article className="admin-login-card">
					<div className="admin-login-kicker">Admin Login</div>
					<h1 className="admin-login-title">Welcome back</h1>
					<p className="admin-login-subtitle">Sign in to manage products, discounts, categories, and users.</p>

					<form className="admin-login-form" onSubmit={onSubmit}>
						{formError || error ? <div className="admin-modal-error">{formError || error}</div> : null}

						<div className="admin-field-group">
							<label className="admin-field-label" htmlFor="adminEmail">Email</label>
							<input
								className="admin-field"
								id="adminEmail"
								type="email"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								placeholder="admin@bayou.com"
								disabled={isLoading}
							/>
						</div>

						<div className="admin-field-group">
							<label className="admin-field-label" htmlFor="adminPassword">Password</label>
							<div className="admin-inline-field admin-inline-field--password">
								<input
									className="admin-field"
									id="adminPassword"
									type={showPassword ? 'text' : 'password'}
									value={password}
									onChange={(event) => setPassword(event.target.value)}
									placeholder="Enter your password"
									disabled={isLoading}
								/>
								<button
									className="admin-action-btn admin-action-btn--ghost"
									onClick={() => setShowPassword((prev) => !prev)}
									type="button"
									disabled={isLoading}
								>
									{showPassword ? 'Hide' : 'Show'}
								</button>
							</div>
						</div>

						<div className="admin-login-row">
							<label className="admin-login-check">
								<input
									checked={rememberMe}
									onChange={(event) => setRememberMe(event.target.checked)}
									type="checkbox"
									disabled={isLoading}
								/>
								<span>Remember me</span>
							</label>
							<button className="admin-login-link" type="button" disabled={isLoading}>Forgot password?</button>
						</div>

						<div className="admin-actions-row">
							<button className="admin-action-btn" type="submit" disabled={isLoading}>
								{isLoading ? 'Signing In...' : 'Sign In'}
							</button>
							<button className="admin-action-btn admin-action-btn--ghost" type="button" disabled={isLoading} onClick={() => navigate('/home')}>
								Back to Site
							</button>
						</div>
					</form>

					<div className="admin-login-footer-note">
						Use your admin email and password. Successful sign-in redirects to the admin dashboard.
					</div>
				</article>
			</div>
		</section>
	);
}
