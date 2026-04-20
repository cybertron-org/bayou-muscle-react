import { useMemo, useState } from 'react';
import { loginUser, logoutUser, registerUser, forgotPassword as forgotPasswordRequest } from '../services/authService';

const TOKEN_KEY = 'access_token';
const USER_KEY = 'auth_user';

const getStoredToken = () => localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || '';

const getStoredUser = () => {
	const rawUser = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
	if (!rawUser) {
		return null;
	}

	try {
		return JSON.parse(rawUser);
	} catch {
		return null;
	}
};

const getUserRoles = (user) => {
	if (!user) {
		return [];
	}

	if (Array.isArray(user.roles)) {
		return user.roles.filter(Boolean).map((role) => String(role).toLowerCase());
	}

	if (typeof user.role === 'string' && user.role.trim()) {
		return [user.role.trim().toLowerCase()];
	}

	return [];
};

const getPrimaryRole = (user) => getUserRoles(user)[0] || 'user';

const persistAuth = ({ token, user, rememberMe }) => {
	const primary = rememberMe ? localStorage : sessionStorage;
	const secondary = rememberMe ? sessionStorage : localStorage;

	primary.setItem(TOKEN_KEY, token);
	primary.setItem(USER_KEY, JSON.stringify(user));

	secondary.removeItem(TOKEN_KEY);
	secondary.removeItem(USER_KEY);
};

const clearAuthStorage = () => {
	localStorage.removeItem(TOKEN_KEY);
	localStorage.removeItem(USER_KEY);
	sessionStorage.removeItem(TOKEN_KEY);
	sessionStorage.removeItem(USER_KEY);
};

export default function useAuth() {
	const [user, setUser] = useState(getStoredUser());
	const [token, setToken] = useState(getStoredToken());
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const roles = useMemo(() => getUserRoles(user), [user]);
	const role = useMemo(() => getPrimaryRole(user), [user]);
	const isAuthenticated = useMemo(() => Boolean(token), [token]);

	const login = async ({ email, password, rememberMe = true }) => {
		setIsLoading(true);
		setError('');

		try {
			const response = await loginUser({ email, password });
			persistAuth({ token: response.token, user: response.user, rememberMe });
			setToken(response.token);
			setUser(response.user);
			return response;
		} catch (err) {
			const message = err?.message || 'Unable to sign in. Please try again.';
			setError(message);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async () => {
		setIsLoading(true);
		setError('');

		try {
			await logoutUser();
		} catch (err) {
			// Even if API logout fails, client auth should be cleared.
		} finally {
			clearAuthStorage();
			setToken('');
			setUser(null);
			setError('');
			setIsLoading(false);
		}
	};

	const register = async ({ full_name, email, phone, password, password_confirmation }) => {
		setIsLoading(true);
		setError('');

		try {
			const response = await registerUser({ full_name, email, phone, password, password_confirmation });
			const payload = response?.data || response || {};
			const nextToken = payload?.access_token || payload?.token || '';
			const nextUser = payload?.user || null;

			if (nextToken && nextUser) {
				persistAuth({ token: nextToken, user: nextUser, rememberMe: true });
				setToken(nextToken);
				setUser(nextUser);
			}

			return response;
		} catch (err) {
			const message = err?.message || 'Unable to register. Please try again.';
			setError(message);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const forgotPassword = async ({ email }) => {
		setIsLoading(true);
		setError('');
		
		try {
			const response = await forgotPasswordRequest({ email });
			return response;
		}
		catch (err) {
			const message = err?.message || 'Unable to process request. Please try again.';
			setError(message);
			throw err;
		}
		finally {
			setIsLoading(false);
		}
	};

	return {
		user,
		role,
		roles,
		token,
		isAuthenticated,
		isLoading,
		error,
		login,
		logout,
		register,
		forgotPassword,
	};
}
