import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const isRoleAllowed = (userRoles, allowedRoles) => {
	if (!allowedRoles || allowedRoles.length === 0) {
		return true;
	}

	return allowedRoles.some((allowedRole) => userRoles.includes(String(allowedRole).toLowerCase()));
};

/**
 * Role-aware route guard.
 * - Redirects unauthenticated users to the requested sign-in page.
 * - Redirects authenticated users to the appropriate destination when the role does not match.
 */
const ProtectedRoute = ({
	children,
	allowedRoles = [],
	unauthenticatedRedirect = '/login',
	unauthorizedRedirect = '/home',
	loadingFallback = 'Loading...',
}) => {
	const location = useLocation();
	const { isAuthenticated, isLoading, roles, role } = useAuth();
	const activeRoles = roles.length > 0 ? roles : role ? [role] : [];

	if (isLoading) {
		return (
			<div style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
				fontSize: '18px',
				color: '#578096'
			}}>
				{loadingFallback}
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to={unauthenticatedRedirect} replace state={{ from: location }} />;
	}

	if (!isRoleAllowed(activeRoles, allowedRoles)) {
		return <Navigate to={unauthorizedRedirect} replace />;
	}

	return children;
};

export default ProtectedRoute;
