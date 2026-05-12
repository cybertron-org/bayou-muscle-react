import apiRequest from "./api";

export const fetchUserDashboard = async () => {
    const response = await apiRequest('/dashboard/user', {
        method: 'GET',
    });
    return response?.data || {};
}

export const fetchAdminDashboard = async () => {
    const response = await apiRequest('/admin/dashboard', {
        method: 'GET',
    });
    return response?.data || {};
}