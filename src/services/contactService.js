import apiRequest from './api';

export const fetchContacts = async (params) => {
    const response = await apiRequest('/admin/contacts', {
        method: 'GET',
        params,
    });
    return response;
}


export const submitContact = async (data) => {
    const response = await apiRequest('/contacts', {
        method: 'POST', 
        data,
    });
    return response;
}