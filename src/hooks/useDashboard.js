import { useCallback, useEffect, useState } from 'react';
import { fetchUserDashboard,fetchAdminDashboard } from '../services/dashboardService';

export default function useDashboard(options = {}) {
    const { autoLoad = true, scope = 'user' } = options || {};
    const [dashboardData, setDashboardData] = useState({});
    const [isLoading, setIsLoading] = useState(Boolean(autoLoad));
    const [error, setError] = useState('');

    const loadDashboardData = useCallback(async () => {
        setIsLoading(true);
        setError('');

        try {
            const data = await fetchUserDashboard();
            setDashboardData(data);
            return data;
        } catch (err) {
            setError(err?.message || 'Unable to fetch dashboard data.');
            return {};
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadAdminDashboardData = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await fetchAdminDashboard();
            setDashboardData(data);
            return data;
        }
        catch (err) {
            setError(err?.message || 'Unable to fetch dashboard data.');
            return {};
        }
        finally {
            setIsLoading(false);
        }
    }, []);

    const refreshDashboard = scope === 'admin' ? loadAdminDashboardData : loadDashboardData;


    useEffect(() => {
        if (autoLoad) {
            refreshDashboard();
        }
    }, [autoLoad, refreshDashboard]);

    return {
        dashboardData,
        isLoading,
        error,
        refreshDashboard,
        refreshAdminDashboard: loadAdminDashboardData,
    };
}