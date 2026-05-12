import { useCallback, useEffect, useState } from 'react';
import { createCategory, deleteCategory, fetchCategories, updateCategory, getSubCategoryByCategoryId } from '../services/CategoriesService';

const normalizeCategoryTree = (apiData = []) =>
	apiData.map((parent) => ({
		id: String(parent.id),
		parentId: null,
		title: parent.title || 'Untitled',
		status: parent.status || 'inactive',
		slug: parent.slug || '',
		createdAt: parent.created_at || null,
		updatedAt: parent.updated_at || null,
		subcategories: (parent.children || []).map((child) => ({
			id: String(child.id),
			parentId: String(child.parent_id ?? parent.id),
			title: child.title || 'Untitled',
			status: child.status || 'inactive',
			slug: child.slug || '',
			createdAt: child.created_at || null,
			updatedAt: child.updated_at || null,
		})),
	}));

export default function useCategories() {
	const [categories, setCategories] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');

	const loadCategories = useCallback(async () => {
		setIsLoading(true);
		setError('');

		try {
			const response = await fetchCategories();
			const normalized = normalizeCategoryTree(response?.data || []);
			setCategories(normalized);
			return normalized;
		} catch (err) {
			setError(err?.message || 'Unable to fetch categories.');
			return [];
		} finally {
			setIsLoading(false);
		}
	}, []);

	const addCategory = useCallback(async ({ title, status, parentId = null }) => {
		const response = await createCategory({
			title,
			status,
			parent_id: parentId ? String(parentId) : null,
		});

		const created = response?.data;
		if (!created?.id) {
			throw new Error('Invalid create category response.');
		}

		const mappedCategory = {
			id: String(created.id),
			parentId: created.parent_id ? String(created.parent_id) : null,
			title: created.title || 'Untitled',
			status: created.status || 'inactive',
			slug: created.slug || '',
			createdAt: created.created_at || null,
			updatedAt: created.updated_at || null,
		};

		if (!mappedCategory.parentId) {
			setCategories((previous) => [
				...previous,
				{
					...mappedCategory,
					subcategories: [],
				},
			]);
			return { type: 'parent', item: mappedCategory };
		}

		setCategories((previous) =>
			previous.map((item) =>
				item.id === mappedCategory.parentId
					? {
						...item,
						updatedAt: mappedCategory.updatedAt || item.updatedAt,
						subcategories: [
							...(item.subcategories || []),
							{
								id: mappedCategory.id,
								parentId: mappedCategory.parentId,
								title: mappedCategory.title,
								status: mappedCategory.status,
								slug: mappedCategory.slug,
								createdAt: mappedCategory.createdAt,
								updatedAt: mappedCategory.updatedAt,
							},
						],
					}
					: item,
			),
		);

		return {
			type: 'subcategory',
			item: {
				id: mappedCategory.id,
				parentId: mappedCategory.parentId,
				title: mappedCategory.title,
				status: mappedCategory.status,
				slug: mappedCategory.slug,
				createdAt: mappedCategory.createdAt,
				updatedAt: mappedCategory.updatedAt,
			},
		};
	}, []);

	const updateExistingCategory = useCallback(async (categoryId, { title, status, parentId = null }) => {
		const response = await updateCategory(categoryId, {
			title,
			status,
			parent_id: parentId ? String(parentId) : null,
		});

		const updated = response?.data;
		if (!updated?.id) {
			throw new Error('Invalid update category response.');
		}

		const mappedCategory = {
			id: String(updated.id),
			parentId: updated.parent_id ? String(updated.parent_id) : null,
			title: updated.title || 'Untitled',
			status: updated.status || 'inactive',
			slug: updated.slug || '',
			createdAt: updated.created_at || null,
			updatedAt: updated.updated_at || null,
		};

		await loadCategories();
		return {
			type: mappedCategory.parentId ? 'subcategory' : 'parent',
			item: mappedCategory,
		};
	}, [loadCategories]);

	const deleteExistingCategory = useCallback(async (categoryId) => {
		await deleteCategory(categoryId);
		await loadCategories();
	}, [loadCategories]);

	const loadSubCategories = useCallback(async (categoryId) => {
		try {
			const response = await getSubCategoryByCategoryId(categoryId);
			const normalizedSubCategories = Array.isArray(response?.data)
				? response.data.map((child) => ({	
					id: String(child.id),
					parentId: String(child.parent_id),
					title: child.title || 'Untitled',
					status: child.status || 'inactive',
					slug: child.slug || '',
					createdAt: child.created_at || null,
					updatedAt: child.updated_at || null,
				}))
				: [];
			setCategories((previous) =>
				previous.map((item) =>
					item.id === String(categoryId)

						? {
							...item,
							subcategories: normalizedSubCategories,	
						}
						: item,
				),
			);
			return normalizedSubCategories;
		}
		
		catch (err) {
			const errorMsg = err?.message || 'Unable to fetch subcategories.';
			setError(errorMsg);
			return [];
		}
	}, []);



	useEffect(() => {
		loadCategories();
	}, [loadCategories]);

	return {
		categories,
		setCategories,
		isLoading,
		error,
		addCategory,
		updateExistingCategory,
		deleteExistingCategory,
		refetch: loadCategories,
		loadSubCategories,
	};
}
