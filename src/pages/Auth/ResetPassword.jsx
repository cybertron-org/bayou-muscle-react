import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import './Register.css';

const INITIAL_FORM = {
	password: '',
	confirmPassword: '',
};

function validateForm(values) {
	const errors = {};

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

	return errors;
}

export default function ResetPassword() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { resetPassword, isLoading, error: apiError } = useAuth();

	const email = (searchParams.get('email') || '').trim();
	const token = (searchParams.get('token') || '').trim();
	const hasRequiredParams = Boolean(email && token);

	const [formData, setFormData] = useState(INITIAL_FORM);
	const [touched, setTouched] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const errors = useMemo(() => validateForm(formData), [formData]);
	const isValid = Object.keys(errors).length === 0;

	const onChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const onBlur = (event) => {
		const { name } = event.target;
		setTouched((prev) => ({ ...prev, [name]: true }));
	};

	const onSubmit = async (event) => {
		event.preventDefault();

		if (!hasRequiredParams) {
			toast.error('This reset link is invalid or incomplete.');
			return;
		}

		setTouched({
			password: true,
			confirmPassword: true,
		});

		const currentErrors = validateForm(formData);
		if (Object.keys(currentErrors).length > 0) {
			toast.error('Please correct the highlighted fields.');
			return;
		}

		try {
			const response = await resetPassword({
				email,
				token,
				password: formData.password,
				password_confirmation: formData.confirmPassword,
			});

			toast.success(response?.message || 'Password reset successfully.');
			navigate('/login', { replace: true });
		} catch {
			toast.error('Unable to reset password. Please try again.');
		}
	};

	return (
		<div className="supp-page auth-register-page">
			<section className="auth-register-form-wrap pt-100 pb-100">
				<div className="container">
					<div className="auth-register-form-shell auth-login-form-shell">
						<div className="auth-register-head">
							<h2 className="feedback-title">
								NEW <span className="feedback"> PASSWORD </span>
							</h2>
							<p className="hm-blog__excerpt">
								Create a new password for your account to complete recovery.
							</p>
						</div>

						<form className="auth-register-form" onSubmit={onSubmit} noValidate>
							{apiError ? <p className="auth-register-error">{apiError}</p> : null}

							{!hasRequiredParams ? (
								<p className="auth-register-error">
									Reset link is missing token or email. Please request a new reset link.
								</p>
							) : null}
{/* 
							<div className="form-group">
								<input type="email" value={email} disabled readOnly />
							</div>

							<div className="form-group">
								<input type="text" value={token} disabled readOnly />
							</div> */}

							<div className="form-group">
								<div className="auth-register-password-field">
									<input
										type={showPassword ? 'text' : 'password'}
										name="password"
										placeholder="New Password *"
										value={formData.password}
										onChange={onChange}
										onBlur={onBlur}
										disabled={isLoading || !hasRequiredParams}
										aria-invalid={Boolean(touched.password && errors.password)}
									/>
									<button
										type="button"
										className="auth-register-eye-btn"
										onClick={() => setShowPassword((prev) => !prev)}
										disabled={isLoading || !hasRequiredParams}
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
										placeholder="Confirm New Password *"
										value={formData.confirmPassword}
										onChange={onChange}
										onBlur={onBlur}
										disabled={isLoading || !hasRequiredParams}
										aria-invalid={Boolean(touched.confirmPassword && errors.confirmPassword)}
									/>
									<button
										type="button"
										className="auth-register-eye-btn"
										onClick={() => setShowConfirmPassword((prev) => !prev)}
										disabled={isLoading || !hasRequiredParams}
									>
										{showConfirmPassword ? 'Hide' : 'Show'}
									</button>
								</div>
								{touched.confirmPassword && errors.confirmPassword ? <p className="auth-register-error">{errors.confirmPassword}</p> : null}
							</div>

							<div className="auth-register-actions">
								<button className="auth-register-btn" type="submit" disabled={isLoading || !isValid || !hasRequiredParams}>
									{isLoading ? 'Resetting...' : 'Reset Password'}
								</button>
								<button
									className="auth-register-link"
									type="button"
									onClick={() => navigate('/forgot-password')}
									disabled={isLoading}
								>
									Request New Link
								</button>
							</div>
						</form>
					</div>
				</div>
			</section>
		</div>
	);
}
