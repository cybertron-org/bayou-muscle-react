import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import useBlogs from '../../hooks/useBlogs';
import { createBlog, updateBlog } from '../../services/blogService';
import AdminLayout from '../layouts/AdminLayout';

const editorModules = {
	toolbar: [
		[{ header: [1, 2, 3, false] }],
		['bold', 'italic', 'underline', 'strike'],
		[{ align: [] }],
		[{ list: 'ordered' }, { list: 'bullet' }],
		['blockquote', 'link', 'image'],
		['clean'],
	],
};

const editorFormats = [
	'header',
	'bold',
	'italic',
	'underline',
	'strike',
	'align',
	'list',
	'bullet',
	'blockquote',
	'link',
	'image',
];

const getTextFromHtml = (html) =>
	String(html || '')
		.replace(/<[^>]*>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

const toSlug = (value) =>
	String(value || '')
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.trim()
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');

const resolveImageSrc = (path) => {
	const value = String(path || '').trim();
	if (!value) {
		return '';
	}

	if (value.startsWith('http://') || value.startsWith('https://')) {
		return value;
	}

	const normalized = value.startsWith('/') ? value.slice(1) : value;
	const apiBase = String(import.meta.env.VITE_APP_URL || '').replace(/\/api\/v\d+\/?$/, '');
	if (apiBase) {
		return `${apiBase}/${normalized}`;
	}

	return `/${normalized}`;
};

export default function AdminAddBlogs() {
	const navigate = useNavigate();
	const { blogId } = useParams();
	const isEditMode = Boolean(blogId);
	const { blogs, isLoading: isBlogsLoading, fetchCategories } = useBlogs();

	const [title, setTitle] = useState('');
	const [summary, setSummary] = useState('');
	const [description, setDescription] = useState('');
	const [slug, setSlug] = useState('');
	const [categoryId, setCategoryId] = useState('');
	const [status, setStatus] = useState('1');
	const [imageFile, setImageFile] = useState(null);
	const [existingImage, setExistingImage] = useState('');
	const [descriptionMode, setDescriptionMode] = useState('visual');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isHydrated, setIsHydrated] = useState(false);
	const [categories, setCategories] = useState([]);
	const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

	const { quill, quillRef } = useQuill({
		modules: editorModules,
		formats: editorFormats,
		placeholder: 'Write the full blog description here...',
	});

	const selectedBlog = useMemo(() => {
		if (!isEditMode) {
			return null;
		}

		return blogs.find((blog) => blog.id === String(blogId || '')) || null;
	}, [blogs, blogId, isEditMode]);

	const imagePreview = useMemo(() => {
		if (imageFile) {
			return URL.createObjectURL(imageFile);
		}

		return resolveImageSrc(existingImage);
	}, [imageFile, existingImage]);

	useEffect(() => {
		return () => {
			if (imageFile && imagePreview.startsWith('blob:')) {
				URL.revokeObjectURL(imagePreview);
			}
		};
	}, [imageFile, imagePreview]);

	useEffect(() => {
		if (!quill) {
			return;
		}

		const toolbar = quill.getModule('toolbar');
		toolbar.addHandler('image', () => {
			const input = document.createElement('input');
			input.type = 'file';
			input.accept = 'image/*';
			input.onchange = () => {
				const file = input.files?.[0];
				if (!file) {
					return;
				}

				const reader = new FileReader();
				reader.onload = () => {
					const range = quill.getSelection(true);
					const index = range?.index ?? quill.getLength();
					quill.insertEmbed(index, 'image', reader.result, 'user');
					quill.setSelection(index + 1, 0);
				};
				reader.readAsDataURL(file);
			};
			input.click();
		});

		const syncValue = () => {
			setDescription(quill.root.innerHTML);
		};

		quill.on('text-change', syncValue);
		return () => {
			quill.off('text-change', syncValue);
		};
	}, [quill]);

	useEffect(() => {
		if (!quill) {
			return;
		}

		const html = description || '';
		if (quill.root.innerHTML !== html) {
			quill.root.innerHTML = html;
		}
	}, [description, quill]);

	useEffect(() => {
		if (quill) {
			quill.enable(!isSubmitting);
		}
	}, [quill, isSubmitting]);

	useEffect(() => {
		let active = true;

		const loadCategories = async () => {
			setIsCategoriesLoading(true);
			const items = await fetchCategories();
			if (active) {
				setCategories(Array.isArray(items) ? items : []);
				setIsCategoriesLoading(false);
			}
		};

		loadCategories();

		return () => {
			active = false;
		};
	}, [fetchCategories]);

	useEffect(() => {
		if (!title.trim() || isEditMode) {
			return;
		}

		if (!slug.trim()) {
			setSlug(toSlug(title));
		}
	}, [title, slug, isEditMode]);

	useEffect(() => {
		if (!isEditMode || !selectedBlog || isHydrated) {
			return;
		}

		setTitle(selectedBlog.title || '');
		setSummary(selectedBlog.summary || '');
		setDescription(selectedBlog.description || '');
		setSlug(selectedBlog.slug || '');
		setCategoryId(selectedBlog.categoryId || '');
		setStatus(String(selectedBlog.status || '0'));
		setExistingImage(selectedBlog.image || '');
		setIsHydrated(true);
	}, [isEditMode, selectedBlog, isHydrated]);

	const validateForm = () => {
		const errors = [];

		if (!title.trim()) {
			errors.push('Title is required.');
		}

		if (!summary.trim()) {
			errors.push('Summary is required.');
		}

		if (!getTextFromHtml(description)) {
			errors.push('Description is required.');
		}

		if (!slug.trim()) {
			errors.push('Slug is required.');
		}

		if (!categoryId.trim()) {
			errors.push('Blog category is required.');
		}

		if (!isEditMode && !imageFile) {
			errors.push('Image is required for new blogs.');
		}

		if (errors.length) {
			errors.forEach((item) => toast.error(item));
			return false;
		}

		return true;
	};

	const handleImageChange = (event) => {
		const file = event.target.files?.[0] || null;
		setImageFile(file);
		event.target.value = '';
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);
		try {
			const formData = new FormData();
			formData.append('title', title.trim());
			formData.append('summary', summary.trim());
			formData.append('description', description);
			formData.append('status', status);
			formData.append('blog_category_id', categoryId.trim());
			formData.append('slug', slug.trim());

			if (imageFile) {
				formData.append('image', imageFile);
			}

			if (isEditMode) {
				await updateBlog(blogId, formData);
				toast.success('Blog updated successfully.');
			} else {
				await createBlog(formData);
				toast.success('Blog created successfully.');
			}

			navigate('/admin/blogs');
		} catch (err) {
			toast.error(err?.message || `Failed to ${isEditMode ? 'update' : 'create'} blog.`);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isEditMode && isBlogsLoading && !isHydrated) {
		return (
			<AdminLayout title="Edit Blog" subtitle="Loading blog details...">
				<section className="admin-card">
					<div className="admin-preview-copy">Loading blog details...</div>
				</section>
			</AdminLayout>
		);
	}

	if (isEditMode && !selectedBlog) {
		return (
			<AdminLayout title="Edit Blog" subtitle="Blog content management.">
				<section className="admin-card">
					<div className="admin-placeholder admin-placeholder--compact">
						<div>
							<strong>Blog not found</strong>
							<div className="admin-preview-copy">The selected blog could not be found for editing.</div>
							<div className="admin-actions-row" style={{ marginTop: '12px', justifyContent: 'center' }}>
								<button className="admin-action-btn" type="button" onClick={() => navigate('/admin/blogs')}>
									Back to Blogs
								</button>
							</div>
						</div>
					</div>
				</section>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout
			title={isEditMode ? 'Edit Blog' : 'Add Blog'}
			subtitle="Create and manage rich blog content with precise control."
		>
			<form onSubmit={handleSubmit} className="admin-create-layout">
				<section className="admin-card">
					<div className="admin-form-section-title">Blog Content</div>

					<div className="admin-form-grid">
						<div className="admin-field-group admin-field-group--full">
							<label className="admin-field-label" htmlFor="blog-title">Title</label>
							<input
								id="blog-title"
								className="admin-field"
								value={title}
								onChange={(event) => setTitle(event.target.value)}
								placeholder="Enter blog title"
								disabled={isSubmitting}
							/>
						</div>

						<div className="admin-field-group admin-field-group--full">
							<label className="admin-field-label" htmlFor="blog-summary">Summary</label>
							<textarea
								id="blog-summary"
								className="admin-field admin-field--textarea"
								value={summary}
								onChange={(event) => setSummary(event.target.value)}
								placeholder="Short summary shown in list pages"
								disabled={isSubmitting}
							/>
						</div>

						<div className="admin-field-group admin-field-group--full">
							<div className="admin-rich-editor-head">
								<label className="admin-field-label">Description</label>
								<div className="admin-rich-editor-mode">
									<button
										type="button"
										className={`admin-toggle-btn ${descriptionMode === 'visual' ? 'is-active' : ''}`}
										onClick={() => setDescriptionMode('visual')}
										disabled={isSubmitting}
									>
										Visual
									</button>
									<button
										type="button"
										className={`admin-toggle-btn ${descriptionMode === 'html' ? 'is-active' : ''}`}
										onClick={() => setDescriptionMode('html')}
										disabled={isSubmitting}
									>
										HTML
									</button>
								</div>
							</div>

							{descriptionMode === 'visual' ? (
								<div className="admin-rich-editor">
									<div ref={quillRef} />
								</div>
							) : (
								<textarea
									className="admin-field admin-field--textarea admin-html-source"
									value={description}
									onChange={(event) => setDescription(event.target.value)}
									placeholder="Paste or edit HTML content directly"
									disabled={isSubmitting}
								/>
							)}
						</div>
					</div>
				</section>

				<section className="admin-card">
					<div className="admin-form-section-title">Publishing & Media</div>

					<div className="admin-form-grid">
						<div className="admin-field-group admin-field-group--full">
							<label className="admin-field-label" htmlFor="blog-slug">Slug</label>
							<input
								id="blog-slug"
								className="admin-field"
								value={slug}
								onChange={(event) => setSlug(toSlug(event.target.value))}
								placeholder="my-blog-title"
								disabled={isSubmitting}
							/>
						</div>

						<div className="admin-field-group">
							<label className="admin-field-label" htmlFor="blog-category-id">Blog Category</label>
							<select
								id="blog-category-id"
								className="admin-field"
								value={categoryId}
								onChange={(event) => setCategoryId(event.target.value)}
								disabled={isSubmitting || isCategoriesLoading}
							>
								<option value="">{isCategoriesLoading ? 'Loading categories...' : 'Select category'}</option>
								{categories.map((category) => (
									<option key={category.id} value={category.id}>
										{category.title}
									</option>
								))}
							</select>
							{!isCategoriesLoading && !categories.length ? (
								<div className="admin-inline-note">No blog categories found. Please add a category first.</div>
							) : null}
						</div>

						<div className="admin-field-group">
							<label className="admin-field-label" htmlFor="blog-status">Status</label>
							<select
								id="blog-status"
								className="admin-field"
								value={status}
								onChange={(event) => setStatus(event.target.value)}
								disabled={isSubmitting}
							>
								<option value="1">Published</option>
								<option value="0">Draft</option>
							</select>
						</div>

						<div className="admin-field-group admin-field-group--full">
							<label className="admin-field-label" htmlFor="blog-image">Featured Image</label>
							<input
								id="blog-image"
								className="admin-field"
								type="file"
								accept="image/*"
								onChange={handleImageChange}
								disabled={isSubmitting}
							/>
							{imagePreview ? (
								<img src={imagePreview} alt="Blog preview" className="admin-thumb-preview" />
							) : (
								<div className="admin-inline-note">Upload one featured image for the blog card and details view.</div>
							)}
						</div>
					</div>

					<div className="admin-actions-row" style={{ marginTop: '16px' }}>
						<button className="admin-action-btn" type="submit" disabled={isSubmitting}>
							{isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Blog' : 'Create Blog')}
						</button>
						<button
							className="admin-action-btn admin-action-btn--ghost"
							type="button"
							disabled={isSubmitting}
							onClick={() => navigate('/admin/blogs')}
						>
							Cancel
						</button>
					</div>
				</section>
			</form>
		</AdminLayout>
	);
}
