import apiRequest from './api';

const AUTH_ENDPOINTS = {
	login: '/auth/login',
	logout: '/auth/logout',
};

export const loginUser = async ({ email, password }) => {
	const response = await apiRequest(AUTH_ENDPOINTS.login, {
		method: 'POST',
		data: {
			email,
			password,
		},
	});

	const payload = response?.data || response || {};
	const token = payload?.access_token || '';
	const user = payload?.user || null;
	const role = user?.role || 'user';

	if (!token || !user) {
		throw {
			status: 500,
			message: 'Invalid login response from server.',
			errors: {},
		};
	}



	return {
		role,
		token,
		tokenType: payload?.token_type || 'Bearer',
		user,
		message: response?.message || 'User logged in successfully',
	};
};


export const logoutUser = async () => {
	const response = await apiRequest(AUTH_ENDPOINTS.logout, {
		method: 'POST',
	});
	return response;
};


export const registerUser = async ({ full_name, email, phone, password, password_confirmation }) => {
	console.log('Registering user with data:', { full_name, email, phone, password, password_confirmation });
	const response = await apiRequest('/auth/register', {
		method: 'POST',
		data: {
			full_name,
			email,
			phone,
			password,
			password_confirmation,
		},
	});
	return response;
}

export const forgotPassword = async ({ email }) => {
	const response = await apiRequest('/auth/forgot-password', {
		method: 'POST',
		data: {
			email,
		},
	});
	return response;
}

export const resetPassword = async ({ email, token, password, password_confirmation }) => {
	const response = await apiRequest('/auth/reset-password', {
		method: 'POST',
		data: {
			email,
			token,
			password,
			password_confirmation,
		},
	});

	return response;
};

export const updateProfile = async ({ full_name, email, phone, address, password, password_confirmation }) => {
	const response = await apiRequest('/auth/profile/update', {
		method: 'POST',
		data: {
			full_name,
			email,
			phone,
			address,
			password,
			password_confirmation,
		},

	});
	return response;
};

