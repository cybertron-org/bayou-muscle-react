import apiRequest from "./api";

export const fetchBlogs = async (params) => {
    const response = await apiRequest('/admin/blogs', {
        method: 'GET', 
        params,
    });
    return response;
}

export const createBlog = async (blogData) => {
    const response = await apiRequest('/admin/blogs/create', {
        method: 'POST',
        data: blogData,
    });
    return response;
}

export const updateBlog = async (blogId, blogData) => {
    const response = await apiRequest(`/admin/blogs/update/${blogId}`, {
        method: 'POST',
        data: blogData,
    });
    return response;
}   

export const deleteBlog = async (blogId) => {
    const response = await apiRequest(`/admin/blogs/delete/${blogId}`, {
        method: 'DELETE',
    });
    return response;
}


export const getBlogCategories = async () => {
    const response = await apiRequest('/admin/blog-categories', {
        method: 'GET',
    });
    return response;
}

export const createBlogCategory = async (categoryData) => {
    const response = await apiRequest('/admin/blog-categories/create', {
        method: 'POST',
        data: categoryData,
    });
    return response;
}

export const updateBlogCategory = async (categoryId, categoryData) => {
    const response = await apiRequest(`/admin/blog-categories/update/${categoryId}`, {
        method: 'POST',
        data: categoryData,
    });
    return response;
}

export const deleteBlogCategory = async (categoryId) => {
    const response = await apiRequest(`/admin/blog-categories/delete/${categoryId}`, {
        method: 'DELETE',
    });
    return response;
}


// User Blogs api
export const getWebsiteBlogs = async (params) => {
    const response = await apiRequest('/website/blogs', {
        method: 'GET',
        params,
    });
    return response;
}

export const getBlogDetails = async (slug) => {
    const response = await apiRequest(`/website/blogs/${slug}`, {
        method: 'GET',
    });
    return response;
}
