import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import './Register.css';

const INITIAL_FORM = {
	email: '',
	password: '',
	rememberMe: true,
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(values) {
	const errors = {};

	if (!values.email.trim()) {
		errors.email = 'Email is required.';
	} else if (!emailRegex.test(values.email.trim())) {
		errors.email = 'Enter a valid email address.';
	}

	if (!values.password) {
		errors.password = 'Password is required.';
	}

	return errors;
}

export default function Login() {
	const navigate = useNavigate();
	const { login, isLoading, error: apiError } = useAuth();

	const [formData, setFormData] = useState(INITIAL_FORM);
	const [touched, setTouched] = useState({});
	const [showPassword, setShowPassword] = useState(false);

	const errors = useMemo(() => validateForm(formData), [formData]);
	const isValid = Object.keys(errors).length === 0;

	const onChange = (event) => {
		const { name, value, type, checked } = event.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}));
	};

	const onBlur = (event) => {
		const { name } = event.target;
		setTouched((prev) => ({ ...prev, [name]: true }));
	};

	const onSubmit = async (event) => {
		event.preventDefault();

		setTouched({
			email: true,
			password: true,
		});

		const currentErrors = validateForm(formData);
		if (Object.keys(currentErrors).length > 0) {
			toast.error('Please correct the highlighted fields.');
			return;
		}

		try {
			const response = await login({
				email: formData.email.trim(),
				password: formData.password,
				rememberMe: formData.rememberMe,
			});

			const targetPath = String(response?.role || 'user').toLowerCase() === 'admin' ? '/admin/dashboard' : '/profile';
			toast.success(response?.message || 'Logged in successfully.');
			navigate(targetPath, { replace: true });
		} catch {
			toast.error('Unable to sign in. Please try again.');
		}
	};

	return (
		<div className="supp-page auth-register-page">
			<section className="auth-register-form-wrap pt-100 pb-100">
				<div className="container">
					<div className="auth-register-form-shell auth-login-form-shell">
						<div className="auth-register-head">
							<h2 className="feedback-title">
								WELCOME <span className="feedback"> BACK </span>
							</h2>
							<p className="hm-blog__excerpt">
								Sign in to continue your Bayou Muscle journey.
							</p>
						</div>

						<form className="auth-register-form" onSubmit={onSubmit} noValidate>
							{apiError ? <p className="auth-register-error">{apiError}</p> : null}

							<div className="form-group">
								<input
									type="email"
									name="email"
									placeholder="Email *"
									value={formData.email}
									onChange={onChange}
									onBlur={onBlur}
									disabled={isLoading}
									aria-invalid={Boolean(touched.email && errors.email)}
								/>
								{touched.email && errors.email ? <p className="auth-register-error">{errors.email}</p> : null}
							</div>

							<div className="form-group">
								<div className="auth-register-password-field">
									<input
										type={showPassword ? 'text' : 'password'}
										name="password"
										placeholder="Password *"
										value={formData.password}
										onChange={onChange}
										onBlur={onBlur}
										disabled={isLoading}
										aria-invalid={Boolean(touched.password && errors.password)}
									/>
									<button
										type="button"
										className="auth-register-eye-btn"
										onClick={() => setShowPassword((prev) => !prev)}
										disabled={isLoading}
									>
										{showPassword ? 'Hide' : 'Show'}
									</button>
								</div>
								{touched.password && errors.password ? <p className="auth-register-error">{errors.password}</p> : null}
							</div>

							<label className="auth-register-check">
								<input
									type="checkbox"
									name="rememberMe"
									checked={formData.rememberMe}
									onChange={onChange}
									disabled={isLoading}
								/>
								<span>Keep me signed in on this device.</span>
							</label>

							<div className="auth-register-actions">
								<button className="auth-register-btn" type="submit" disabled={isLoading || !isValid}>
									{isLoading ? 'Signing In...' : 'Sign In'}
								</button>
								<button
									className="auth-register-link"
									type="button"
									onClick={() => navigate('/forgot-password')}
									disabled={isLoading}
								>
									Forgot Password?
								</button>
								<button
									className="auth-register-link"
									type="button"
									onClick={() => navigate('/register')}
									disabled={isLoading}
								>
									Create Account
								</button>
							</div>
						</form>
					</div>
				</div>
			</section>
		</div>
	);
}
