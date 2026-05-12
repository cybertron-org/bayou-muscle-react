import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import './Register.css';

const INITIAL_FORM = {
	email: '',
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(values) {
	const errors = {};

	if (!values.email.trim()) {
		errors.email = 'Email is required.';
	} else if (!emailRegex.test(values.email.trim())) {
		errors.email = 'Enter a valid email address.';
	}

	return errors;
}

export default function ForgotPassword() {
	const navigate = useNavigate();
	const { forgotPassword, isLoading, error: apiError } = useAuth();

	const [formData, setFormData] = useState(INITIAL_FORM);
	const [touched, setTouched] = useState({});
	const [isSubmitted, setIsSubmitted] = useState(false);

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

		setTouched({ email: true });

		const currentErrors = validateForm(formData);
		if (Object.keys(currentErrors).length > 0) {
			toast.error('Please enter a valid email address.');
			return;
		}

		try {
			const response = await forgotPassword({ email: formData.email.trim() });
			setIsSubmitted(true);
			toast.success(response?.message || 'Password reset link sent.');
		} catch {
			toast.error('Unable to send reset link. Please try again.');
		}
	};

	return (
		<div className="supp-page auth-register-page">
			<section className="auth-register-form-wrap pt-100 pb-100">
				<div className="container">
					<div className="auth-register-form-shell auth-login-form-shell">
						<div className="auth-register-head">
							<h2 className="feedback-title">
								RESET <span className="feedback"> PASSWORD </span>
							</h2>
							<p className="hm-blog__excerpt">
								Enter your account email and we will send you reset instructions.
							</p>
						</div>

						<form className="auth-register-form" onSubmit={onSubmit} noValidate>
							{apiError ? <p className="auth-register-error">{apiError}</p> : null}
							{isSubmitted ? (
								<p className="auth-register-success">
									If this email exists in our system, a reset link has been sent.
								</p>
							) : null}

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

							<div className="auth-register-actions">
								<button className="auth-register-btn" type="submit" disabled={isLoading || !isValid}>
									{isLoading ? 'Sending...' : 'Send Reset Link'}
								</button>
								<button
									className="auth-register-link"
									type="button"
									onClick={() => navigate('/login')}
									disabled={isLoading}
								>
									Back to Login
								</button>
							</div>
						</form>
					</div>
				</div>
			</section>
		</div>
	);
}
