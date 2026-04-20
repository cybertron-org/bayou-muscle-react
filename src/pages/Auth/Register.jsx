import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Register.css';
import useAuth from '../../hooks/useAuth';


const INITIAL_FORM = {
	firstName: '',
	lastName: '',
	email: '',
	phone: '',
	password: '',
	confirmPassword: '',
	agree: false,
};


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(values) {
	const errors = {};

	if (!values.firstName.trim()) errors.firstName = 'First name is required.';
	if (!values.lastName.trim()) errors.lastName = 'Last name is required.';

	if (!values.email.trim()) {
		errors.email = 'Email is required.';
	} else if (!emailRegex.test(values.email.trim())) {
		errors.email = 'Enter a valid email address.';
	}

	if (!values.phone.trim()) {
		errors.phone = 'Phone number is required.';
	} else if (values.phone.replace(/\D/g, '').length < 8) {
		errors.phone = 'Enter a valid phone number.';
	}

	if (!values.password) {
		errors.password = 'Password is required.';
	} else if (values.password.length < 8) {
		errors.password = 'Password must be at least 8 characters.';
	}

	if (!values.confirmPassword) {
		errors.confirmPassword = 'Please confirm your password.';
	} else if (values.confirmPassword !== values.password) {
		errors.confirmPassword = 'Passwords do not match.';
	}

	if (!values.agree) {
		errors.agree = 'You must accept terms and privacy policy.';
	}

	return errors;
}

export default function Register() {
	const { register, isLoading, error: apiError } = useAuth();
	const navigate = useNavigate();
	const [formData, setFormData] = useState(INITIAL_FORM);
	const [touched, setTouched] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
			firstName: true,
			lastName: true,
			email: true,
			phone: true,
			password: true,
			confirmPassword: true,
			agree: true,
		});

		const currentErrors = validateForm(formData);
		if (Object.keys(currentErrors).length > 0) {
			toast.error('Please correct the highlighted fields.');
			return;
		}

		try {
			const response = await register({
				full_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
				email: formData.email.trim(),
				phone: formData.phone.trim(),
				password: formData.password,
                password_confirmation: formData.confirmPassword,
			});
			toast.success(response?.message || 'Your account has been created successfully.');
			setFormData(INITIAL_FORM);
			setTouched({});
			setShowPassword(false);
			setShowConfirmPassword(false);
			navigate('/profile', { replace: true });
            
		} catch {
			toast.error('Unable to create account. Please try again.');
		}
	};

	return (
		<>
			

			<div className="supp-page auth-register-page">


				<section className="auth-register-form-wrap pt-100 pb-100">
					<div className="container">
						<div className="auth-register-form-shell">
							<div className="auth-register-head">
								<h2 className="feedback-title">
									CREATE <span className="feedback"> ACCOUNT </span>
								</h2>
								<p className="hm-blog__excerpt">
									Join Bayou Muscle to get faster checkout, special offers, and order tracking in one place.
								</p>
							</div>

							<form className="auth-register-form" onSubmit={onSubmit} noValidate>
								{apiError ? <p className="auth-register-error">{apiError}</p> : null}
								<div className="auth-register-grid">
									<div className="form-group">
										<input
											type="text"
											name="firstName"
											placeholder="First Name *"
											value={formData.firstName}
											onChange={onChange}
											onBlur={onBlur}
											disabled={isLoading}
											aria-invalid={Boolean(touched.firstName && errors.firstName)}
										/>
										{touched.firstName && errors.firstName ? <p className="auth-register-error">{errors.firstName}</p> : null}
									</div>

									<div className="form-group">
										<input
											type="text"
											name="lastName"
											placeholder="Last Name *"
											value={formData.lastName}
											onChange={onChange}
											onBlur={onBlur}
											disabled={isLoading}
											aria-invalid={Boolean(touched.lastName && errors.lastName)}
										/>
										{touched.lastName && errors.lastName ? <p className="auth-register-error">{errors.lastName}</p> : null}
									
                                    </div>


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
										<input
											type="tel"
											name="phone"
											placeholder="Phone Number *"
											value={formData.phone}
											onChange={onChange}
											onBlur={onBlur}
											disabled={isLoading}
											aria-invalid={Boolean(touched.phone && errors.phone)}
										/>
										{touched.phone && errors.phone ? <p className="auth-register-error">{errors.phone}</p> : null}
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

									<div className="form-group">
										<div className="auth-register-password-field">
											<input
												type={showConfirmPassword ? 'text' : 'password'}
												name="confirmPassword"
												placeholder="Confirm Password *"
												value={formData.confirmPassword}
												onChange={onChange}
												onBlur={onBlur}
												disabled={isLoading}
												aria-invalid={Boolean(touched.confirmPassword && errors.confirmPassword)}
											/>
											<button
												type="button"
												className="auth-register-eye-btn"
												onClick={() => setShowConfirmPassword((prev) => !prev)}
												disabled={isLoading}
											>
												{showConfirmPassword ? 'Hide' : 'Show'}
											</button>
										</div>
										{touched.confirmPassword && errors.confirmPassword ? <p className="auth-register-error">{errors.confirmPassword}</p> : null}
									</div>
								</div>

								<label className="auth-register-check">
									<input
										type="checkbox"
										name="agree"
										checked={formData.agree}
										onChange={onChange}
										onBlur={onBlur}
										disabled={isLoading}
									/>
									<span>I agree to the Terms of Service and Privacy Policy.</span>
								</label>
								{touched.agree && errors.agree ? <p className="auth-register-error auth-register-error--check">{errors.agree}</p> : null}

								<div className="auth-register-actions">
									<button className="auth-register-btn" type="submit" disabled={isLoading || !isValid}>
										{isLoading ? 'Creating Account...' : 'Create Account'}
									</button>
																	<button
									className="auth-register-link"
									type="button"
									onClick={() => navigate('/login')}
									disabled={isLoading}
								>
									Already have an account? Sign In
								</button>
								</div>
							</form>
						</div>
					</div>
				</section>

			</div>

		</>
	);
}
