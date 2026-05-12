import apiRequest from "./api";

export const fetchReviews = async (params) => {
    const response = await apiRequest('/admin/reviews', {
        method: 'GET',
        params,
    });
    return response;
}

export const changeStatus = async (reviewId, status) => {
    const response = await apiRequest(`/admin/reviews/${reviewId}/status`, {
        method: 'POST',
        data: {
            status,
        },
    });
    return response;
}


