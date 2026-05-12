import apiRequest from './api';

export const createNewsletterSubscription = async (data) => {
    const response = await apiRequest('/newsletters/create', {
        method: 'POST',
        data,
    });
    return response;
}

export const fetchNewsletterSubscriptions = async (params) => {
    const response = await apiRequest('/admin/newsletters', {
        method: 'GET',
        params,
    });
    return response;
}


export const deleteNewsletterSubscription = async (subscriptionId) => {
    const response = await apiRequest(`/admin/newsletters/${subscriptionId}`, {
        method: 'DELETE',
    });
    return response;
}