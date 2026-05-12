import { useCallback, useState } from "react";
import { getWebsiteBlogs,getBlogDetails } from "../services/blogService";

const normalizeImagePath = (image) => {
    if (!image) {
        return "";
    }

    if (/^https?:\/\//i.test(image) || image.startsWith("/")) {
        return image;
    }

    return `/${image}`;
};

const normalizeBlog = (item) => ({
    id: String(item?.id || ""),
    title: item?.title || "",
    summary: item?.summary || "",
    description: item?.description || "",
    image: normalizeImagePath(item?.image),
    category: item?.category || "",
    categorySlug: item?.category_slug || "",
    slug: item?.slug || "",
    createdAt: item?.created_at || null,
    updatedAt: item?.updated_at || null,
});


export default function useUserBlogs() {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const loadBlogs = useCallback(async (params) => {
        setIsLoading(true);
        setError("");
        try {
            const response = await getWebsiteBlogs(params);
            const items = Array.isArray(response?.data) ? response.data : [];
            const mappedBlogs = items.map(normalizeBlog).filter((item) => item.id);
            setBlogs(mappedBlogs);
            return mappedBlogs;
        } catch (err) {
            setError(err?.message || "Unable to fetch blogs.");
            setBlogs([]);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadLatestBlogs = useCallback(async (params) => {
        const mappedBlogs = await loadBlogs(params);
        return mappedBlogs.slice(0, 2);
    }, [loadBlogs]);

    const getUserBlogDetails = useCallback(async (slug) => {
        setIsLoading(true);
        setError("");
        try {
            const response = await getBlogDetails(slug);
            const data = response?.data || {};
            return normalizeBlog(data);
        } catch (err) {
            setError(err?.message || "Unable to fetch blog details.");
            return null;
        }
        finally {
            setIsLoading(false);
        }
    }, []);


    return { blogs, isLoading, error, loadBlogs, loadLatestBlogs, getUserBlogDetails };
}