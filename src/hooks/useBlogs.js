import { fetchBlogs, createBlog, updateBlog, deleteBlog, getBlogCategories, createBlogCategory, updateBlogCategory, deleteBlogCategory } from "../services/blogService";
import { useCallback, useEffect, useState } from "react";

const normalizeBlog = (item) => ({
    id: String(item?.id || ''),
    title: item?.title || 'Untitled',
    summary: item?.summary || '--',
    description: item?.description || '--',
    image: item?.image || '',
    status: String(item?.status || '0'),
    categoryId: String(item?.blog_category_id || ''),
    slug: item?.slug || '',
    createdAt: item?.created_at || null,
    updatedAt: item?.updated_at || null,
});

const toBlogArray = (response) => {
    const payload = response?.data;

    if (Array.isArray(payload)) {
        return payload;
    }

    if (Array.isArray(payload?.data)) {
        return payload.data;
    }

    if (payload && typeof payload === 'object') {
        if ('id' in payload || 'title' in payload) {
            return [payload];
        }
    }

    return [];
};

const normalizeBlogCategory = (item) => ({
    id: String(item?.id || ''),
    title: item?.title || 'Untitled',
    status: String(item?.status || '0'),
    slug: item?.slug || '',
    createdAt: item?.created_at || null,
    updatedAt: item?.updated_at || null,
});

export default function useBlogs() {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const loadBlogs = useCallback(async (params) => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetchBlogs(params);
            const items = toBlogArray(response);
            const mappedBlogs = items.map(normalizeBlog).filter((item) => item.id);
            setBlogs(mappedBlogs);
            return mappedBlogs;
        } catch (err) {
            setError(err?.message || 'Unable to fetch blogs.');
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addBlog = useCallback(async (blogData) => {
        setError('');
        try {
            const response = await createBlog(blogData);
            const newBlog = normalizeBlog(response?.data);
            setBlogs((prev) => [...prev, newBlog]);
            return newBlog;
        } catch (err) {
            setError(err?.message || 'Unable to create blog.');
            throw new Error(err?.message || 'Unable to create blog.');
        }
    }, []);

    const editBlog = useCallback(async (blogId, blogData) => {
        setError('');
        try {
            const response = await updateBlog(blogId, blogData);
            const updatedBlog = normalizeBlog(response?.data);
            setBlogs((prev) =>
                prev.map((item) => (item.id === updatedBlog.id ? updatedBlog : item))
            );
            return updatedBlog;
        }
        catch (err) {
            setError(err?.message || 'Unable to update blog.');
            throw new Error(err?.message || 'Unable to update blog.');
        }
    }, []);

    const deleteExistingBlog = useCallback(async (blogId) => {
        setError('');
        try {
            await deleteBlog(blogId);
            setBlogs((prev) => prev.filter((item) => String(item.id) !== String(blogId)));
            return true;
        } catch (err) {
            setError(err?.message || 'Unable to delete blog.');
            throw new Error(err?.message || 'Unable to delete blog.');
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        setError('');
        try {
            const response = await getBlogCategories();
            const categories = Array.isArray(response?.data) ? response.data : [];
            return categories.map(normalizeBlogCategory).filter((item) => item.id);
        } catch (err) {
            setError(err?.message || 'Unable to fetch blog categories.');
            return [];
        }
    }, []);

    const addCategory = useCallback(async (categoryData) => {
        setError('');
        try {
            const response = await createBlogCategory(categoryData);
            const newCategory = response?.data;
            return {
                id: String(newCategory.id),
                title: newCategory.title || 'Untitled',
            };
        } catch (err) {
            setError(err?.message || 'Unable to create blog category.');
            throw new Error(err?.message || 'Unable to create blog category.');
        }
    }, []);

    const editCategory = useCallback(async (categoryId, categoryData) => {
        setError('');
        try {
            const response = await updateBlogCategory(categoryId, categoryData);
            const updatedCategory = response?.data;
            return {
                id: String(updatedCategory.id),
                title: updatedCategory.title || 'Untitled',
            };
        } catch (err) {
            setError(err?.message || 'Unable to update blog category.');
            throw new Error(err?.message || 'Unable to update blog category.');
        }
    }, []);

    const deleteExistingCategory = useCallback(async (categoryId) => {
        setError('');
        try {
            await deleteBlogCategory(categoryId);
            return true;
        } catch (err) {
            setError(err?.message || 'Unable to delete blog category.');
            throw new Error(err?.message || 'Unable to delete blog category.');
        }
    }, []);

    useEffect(() => {
        loadBlogs();
    }, [loadBlogs]);

    return { blogs, isLoading, error, loadBlogs, addBlog, editBlog, deleteExistingBlog, fetchCategories, addCategory, editCategory, deleteExistingCategory };
}
