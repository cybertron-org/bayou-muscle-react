import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import useProducts from '../../hooks/useProducts';
import useCategories from '../../hooks/useCategories';
import { getProduct } from '../../services/productsService';
import AdminLayout from '../layouts/AdminLayout';

const MAX_IMAGE_SIZE_MB = 10;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

const isImageWithinSizeLimit = (file) => file.size <= MAX_IMAGE_SIZE_BYTES;

const showImageSizeError = (file) => {
  toast.error(`${file.name || 'Image'} must be ${MAX_IMAGE_SIZE_MB} MB or smaller.`);
};

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

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const isEditMode = Boolean(productId);
  const { addProduct, editProduct, deleteProductImage } = useProducts();
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [deletingImageId, setDeletingImageId] = useState('');
  const [confirmRemoval, setConfirmRemoval] = useState(null);

  // Basic Info
  const [categoryId, setCategoryId] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [sku, setSku] = useState('');
  const [gender, setGender] = useState('unisex');
  const [apliiqProductId, setApliiqProductId] = useState('');
  const [apliiqVariantId, setApliiqVariantId] = useState('');

  // Description Fields
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [descriptionEditorMode, setDescriptionEditorMode] = useState('visual');
  const [additionalInfoEditorMode, setAdditionalInfoEditorMode] = useState('visual');

  const {
    quill: descriptionQuill,
    quillRef: descriptionEditorRef,
  } = useQuill({
    modules: editorModules,
    formats: editorFormats,
    placeholder: 'Full product description, ingredients, usage details...',
  });

  const {
    quill: additionalInfoQuill,
    quillRef: additionalInfoEditorRef,
  } = useQuill({
    modules: editorModules,
    formats: editorFormats,
    placeholder: 'Additional details like warnings, certifications, etc...',
  });

  // Product Flags
  const [isActive, setIsActive] = useState(1);
  const [bestSeller, setBestSeller] = useState(0);
  const [isFeatured, setIsFeatured] = useState(0);
  const [clearance, setClearance] = useState(0);

  // Images
  const [mainImage, setMainImage] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const mainPreview = useMemo(() => {
    if (!mainImage) {
      return '';
    }
    return URL.createObjectURL(mainImage);
  }, [mainImage]);

  const galleryPreviews = useMemo(
    () => galleryImages.map((file) => ({ file, src: URL.createObjectURL(file) })),
    [galleryImages],
  );

  const allImages = useMemo(
    () => [
      ...(mainImage ? [mainImage] : []),
      ...galleryImages,
    ],
    [mainImage, galleryImages],
  );

  const existingMainImageIndex = useMemo(() => {
    if (!existingImages.length) {
      return -1;
    }

    const mainIndex = existingImages.findIndex((image) => Number(image?.is_main || 0) === 1);
    return mainIndex >= 0 ? mainIndex : 0;
  }, [existingImages]);

  const existingMainImage = useMemo(() => {
    if (existingMainImageIndex < 0) {
      return null;
    }
    return existingImages[existingMainImageIndex] || null;
  }, [existingImages, existingMainImageIndex]);

  const existingGalleryImages = useMemo(
    () => existingImages.filter((_, index) => index !== existingMainImageIndex),
    [existingImages, existingMainImageIndex],
  );

  const displayedMainPreview = mainPreview || existingMainImage?.image || '';
  const hasAtLeastOneImage = allImages.length > 0 || existingImages.length > 0;
  const totalDisplayedImages = allImages.length + existingImages.length;
  const categoryOptions = useMemo(
    () =>
      (categories || []).flatMap((parent) => {
        const parentOption = {
          id: parent.id,
          label: parent.title,
        };

        const subcategoryOptions = (parent.subcategories || []).map((child) => ({
          id: child.id,
          label: `${child.title}`,
        }));

        return [parentOption, ...subcategoryOptions];
      }),
    [categories],
  );

  // Fetch product data when in edit mode
  useEffect(() => {
    if (isEditMode) {
      (async () => {
        try {
          const response = await getProduct(productId);
          const product = response?.data;
          if (product) {
            setCategoryId(String(product.category_id || ''));
            setProductName(product.name || '');
            setPrice(product.price || '');
            setSku(product.sku || '');
            setGender(product.gender || 'unisex');
            setApliiqProductId(product.apliiq_product_id || '');
            setApliiqVariantId(product.apliiq_variant_id || '');
            setSummary(product.summary || '');
            setDescription(product.description || '');
            setAdditionalInfo(product.additional_info || '');
            setIsActive(product.is_active ? 1 : 0);
            setBestSeller(product.best_seller ? 1 : 0);
            setIsFeatured(product.is_featured ? 1 : 0);
            setClearance(product.clearance ? 1 : 0);

            // Normalize existing images: prefer top-level main_image if present
            const images = Array.isArray(product.images) ? product.images.map((img) => ({
              id: img?.id ?? '',
              image: img?.image || '',
              is_main: Number(img?.is_main ?? img?.isMain ?? 0),
            })) : [];

            if (product.main_image) {
              // if main_image exists, put it first and mark as main
              const main = { id: 'main', image: product.main_image, is_main: 1 };
              setExistingImages([main, ...images]);
            } else {
              setExistingImages(images);
            }
          }
        } catch (err) {
          toast.error('Failed to load product. ' + (err?.message || ''));
          setTimeout(() => navigate('/admin/products'), 500);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [isEditMode, productId, navigate]);

  useEffect(() => {
    return () => {
      if (mainPreview) {
        URL.revokeObjectURL(mainPreview);
      }
    };
  }, [mainPreview]);

  useEffect(() => {
    return () => {
      galleryPreviews.forEach((item) => URL.revokeObjectURL(item.src));
    };
  }, [galleryPreviews]);

  const onMainImageChange = (event) => {
    const file = event.target.files?.[0] || null;

    if (file && !isImageWithinSizeLimit(file)) {
      showImageSizeError(file);
      event.target.value = '';
      return;
    }

    setMainImage(file);
    if (file) {
      setMainImageIndex(0);
    }
    event.target.value = '';
  };

  const onGalleryImagesChange = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';

    if (!files.length) {
      return;
    }

    const validFiles = files.filter((file) => {
      if (isImageWithinSizeLimit(file)) {
        return true;
      }

      showImageSizeError(file);
      return false;
    });

    if (validFiles.length) {
      setGalleryImages((prev) => [...prev, ...validFiles]);
    }
  };

  const removeGalleryImage = (index) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const closeRemoveConfirm = () => {
    setConfirmRemoval(null);
  };

  const promptRemoveExistingImage = (image) => {
    if (deletingImageId) return;
    setConfirmRemoval({ type: 'existing', image });
  };

  const promptRemoveGalleryImage = (index, file) => {
    setConfirmRemoval({ type: 'gallery', index, file });
  };

  const confirmRemoveImage = async () => {
    if (!confirmRemoval) {
      return;
    }

    if (confirmRemoval.type === 'existing') {
      const imageId = confirmRemoval.image?.id;
      if (!imageId || deletingImageId) {
        return;
      }

      setConfirmRemoval(null);
      setDeletingImageId(imageId);
      try {
        await deleteProductImage(imageId);
        setExistingImages((prev) => prev.filter((img) => String(img.id) !== String(imageId)));
        toast.success('Image removed successfully.');
      } catch (err) {
        toast.error(err?.message || 'Failed to remove image.');
      } finally {
        setDeletingImageId('');
      }
      return;
    }

    if (confirmRemoval.type === 'gallery') {
      const { index } = confirmRemoval;
      setConfirmRemoval(null);
      removeGalleryImage(index);
    }
  };

  const handleRemoveExistingImage = async (imageId) => {
    if (deletingImageId) return;

    setDeletingImageId(imageId);
    try {
      await deleteProductImage(imageId);
      setExistingImages((prev) => prev.filter((img) => String(img.id) !== String(imageId)));
      toast.success('Image removed successfully.');
    } catch (err) {
      toast.error(err?.message || 'Failed to remove image.');
    } finally {
      setDeletingImageId('');
    }
  };

  const insertImageIntoEditor = (editor) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) {
        return;
      }

      if (!isImageWithinSizeLimit(file)) {
        showImageSizeError(file);
        input.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const range = editor.getSelection(true);
        const insertAt = range?.index ?? editor.getLength();
        editor.insertEmbed(insertAt, 'image', reader.result, 'user');
        editor.setSelection(insertAt + 1, 0);
      };
      reader.readAsDataURL(file);
    };

    input.click();
  };

  useEffect(() => {
    if (!descriptionQuill) {
      return;
    }

    const toolbar = descriptionQuill.getModule('toolbar');
    toolbar.addHandler('image', () => insertImageIntoEditor(descriptionQuill));

    const syncDescription = () => {
      setDescription(descriptionQuill.root.innerHTML);
    };

    descriptionQuill.on('text-change', syncDescription);
    return () => {
      descriptionQuill.off('text-change', syncDescription);
    };
  }, [descriptionQuill]);

  useEffect(() => {
    if (!additionalInfoQuill) {
      return;
    }

    const toolbar = additionalInfoQuill.getModule('toolbar');
    toolbar.addHandler('image', () => insertImageIntoEditor(additionalInfoQuill));

    const syncAdditionalInfo = () => {
      setAdditionalInfo(additionalInfoQuill.root.innerHTML);
    };

    additionalInfoQuill.on('text-change', syncAdditionalInfo);
    return () => {
      additionalInfoQuill.off('text-change', syncAdditionalInfo);
    };
  }, [additionalInfoQuill]);

  useEffect(() => {
    if (!descriptionQuill) {
      return;
    }

    const html = description || '';
    if (descriptionQuill.root.innerHTML !== html) {
      descriptionQuill.root.innerHTML = html;
    }
  }, [descriptionQuill, description]);

  useEffect(() => {
    if (!additionalInfoQuill) {
      return;
    }

    const html = additionalInfo || '';
    if (additionalInfoQuill.root.innerHTML !== html) {
      additionalInfoQuill.root.innerHTML = html;
    }
  }, [additionalInfoQuill, additionalInfo]);

  useEffect(() => {
    if (descriptionQuill) {
      descriptionQuill.enable(!isSubmitting);
    }
    if (additionalInfoQuill) {
      additionalInfoQuill.enable(!isSubmitting);
    }
  }, [descriptionQuill, additionalInfoQuill, isSubmitting]);

  const validateForm = () => {
    const errors = [];

    if (!categoryId.trim()) {
      errors.push('Category ID is required');
    }
    if (!productName.trim()) {
      errors.push('Product name is required');
    }
    if (!price || Number(price) <= 0) {
      errors.push('Valid price is required');
    }
    if (!sku.trim()) {
      errors.push('SKU is required');
    }
    if (!summary.trim()) {
      errors.push('Summary is required');
    }
    if (!getTextFromHtml(description)) {
      errors.push('Description is required');
    }
    if (!getTextFromHtml(additionalInfo)) {
      errors.push('Additional info is required');
    }
    if (!hasAtLeastOneImage) {
      errors.push('At least one image is required');
    }

    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Add all fields as per API requirement
      formData.append('category_id', categoryId);
      formData.append('name', productName);
      formData.append('price', String(price));
      formData.append('summary', summary);
      formData.append('description', description);
      formData.append('additional_info', additionalInfo);
      formData.append('gender', gender);
      formData.append('is_active', String(isActive));
      formData.append('sku', sku);
      formData.append('best_seller', String(bestSeller));
      formData.append('is_featured', String(isFeatured));
      formData.append('clearance', String(clearance));
      formData.append('apliiq_product_id', apliiqProductId);
      formData.append('apliiq_variant_id', apliiqVariantId);

      // Files: send new main image as `main_image` and gallery images as `images[]`
      // Validate sizes before appending
      const filesToCheck = [];
      if (mainImage) filesToCheck.push({ name: 'main_image', file: mainImage });
      galleryImages.forEach((file, idx) => filesToCheck.push({ name: `images[${idx}]`, file }));

      for (const item of filesToCheck) {
        if (!isImageWithinSizeLimit(item.file)) {
          throw new Error(`${item.file.name || item.name} must be ${MAX_IMAGE_SIZE_MB} MB or smaller.`);
        }
      }

      if (mainImage) {
        formData.append('main_image', mainImage);
      }

      if (galleryImages.length > 0) {
        galleryImages.forEach((image, idx) => {
          formData.append(`images[${idx}]`, image);
        });
      }

      if (isEditMode) {
        await editProduct(productId, formData);
        toast.success('Product updated successfully!');
      } else {
        await addProduct(formData);
        toast.success('Product created successfully!');
      }

      // Navigate back
      setTimeout(() => {
        navigate('/admin/products');
      }, 500);
    } catch (err) {
      // API returns formatted error from apiRequest interceptor: { message, errors }
      if (err?.errors && typeof err.errors === 'object') {
        Object.values(err.errors).forEach((val) => {
          if (Array.isArray(val)) {
            val.forEach((m) => toast.error(m));
          } else if (typeof val === 'string') {
            toast.error(val);
          }
        });
      } else {
        toast.error(err?.message || `Failed to ${isEditMode ? 'update' : 'create'} product`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout
        title={isEditMode ? 'Edit Product' : 'Add Product'}
        subtitle="Loading..."
      >
        <section className="admin-card">
          <div className="admin-inline-note">Loading product details...</div>
        </section>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={isEditMode ? 'Edit Product' : 'Add Product'}
      subtitle={isEditMode ? 'Update the product details below.' : 'Complete the form below to create a new product with all required details and images.'}
    >
      <form onSubmit={handleSubmit} className="admin-product-form">
        <section className="admin-card">
          <div className="admin-card-head">
            <div>
              <div className="admin-card-kicker">Catalog</div>
              <div className="admin-card-title">{isEditMode ? 'Update product' : 'Create new product'}</div>
              <div className="admin-card-subtitle">
                {isEditMode ? 'Edit the product information and images below.' : 'Fill all details below to add a new product to the catalog.'}
              </div>
            </div>
            <button
              className="admin-action-btn admin-action-btn--ghost"
              onClick={() => navigate('/admin/products')}
              type="button"
              disabled={isSubmitting}
            >
              Back to Products
            </button>
          </div>

          <div className="admin-create-layout admin-product-form-layout">
            <div className="admin-card admin-form-panel">
              <div className="admin-form-section-title">Basic Information</div>
              <div className="admin-inline-note">Core catalog details, pricing, and product content.</div>

              <div className="admin-form-grid">
                <div className="admin-field-group">
                  <label className="admin-field-label" htmlFor="categoryId">Category *</label>
                  <select
                    className="admin-field"
                    id="categoryId"
                    value={categoryId}
                    onChange={(event) => setCategoryId(event.target.value)}
                    required
                    disabled={isSubmitting || isCategoriesLoading}
                  >
                    <option value="">Select category</option>
                    {categoryOptions.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-field-group">
                  <label className="admin-field-label" htmlFor="sku">SKU *</label>
                  <input
                    className="admin-field"
                    id="sku"
                    placeholder="Ex: 1234"
                    type="text"
                    value={sku}
                    onChange={(event) => setSku(event.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="admin-field-group">
                  <label className="admin-field-label" htmlFor="apliiqProductId">Apliiq Product ID</label>
                  <input
                    className="admin-field"
                    id="apliiqProductId"
                    placeholder="Ex: 123456"
                    type="text"
                    value={apliiqProductId}
                    onChange={(event) => setApliiqProductId(event.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="admin-field-group">
                  <label className="admin-field-label" htmlFor="apliiqVariantId">Apliiq Variant ID</label>
                  <input
                    className="admin-field"
                    id="apliiqVariantId"
                    placeholder="Ex: 789012"
                    type="text"
                    value={apliiqVariantId}
                    onChange={(event) => setApliiqVariantId(event.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="admin-field-group admin-field-group--full">
                  <label className="admin-field-label" htmlFor="productName">Product Name *</label>
                  <input
                    className="admin-field"
                    id="productName"
                    placeholder="Ex: Bayou Nitro Whey Protein"
                    type="text"
                    value={productName}
                    onChange={(event) => setProductName(event.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="admin-field-group">
                  <label className="admin-field-label" htmlFor="price">Price *</label>
                  <input
                    className="admin-field"
                    id="price"
                    placeholder="Ex: 100"
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>



                <div className="admin-field-group">
                  <label className="admin-field-label" htmlFor="gender">Gender *</label>
                  <select
                    className="admin-field"
                    id="gender"
                    value={gender}
                    onChange={(event) => setGender(event.target.value)}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="unisex">Unisex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="admin-field-group admin-field-group--full">
                  <label className="admin-field-label" htmlFor="summary">Summary *</label>
                  <textarea
                    className="admin-field admin-field--textarea admin-field--small"
                    id="summary"
                    placeholder="Short summary for cards and quick previews..."
                    value={summary}
                    onChange={(event) => setSummary(event.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="admin-field-group admin-field-group--full ">
                  <div className="admin-rich-editor-head">
                    <label className="admin-field-label" htmlFor="description">Description *</label>
                    <div className="admin-rich-editor-mode" role="tablist" aria-label="Description editor mode">
                      <button
                        className={`admin-toggle-btn ${descriptionEditorMode === 'visual' ? 'is-active' : ''}`}
                        type="button"
                        onClick={() => setDescriptionEditorMode('visual')}
                        disabled={isSubmitting}
                      >
                        Visual
                      </button>
                      <button
                        className={`admin-toggle-btn ${descriptionEditorMode === 'html' ? 'is-active' : ''}`}
                        type="button"
                        onClick={() => setDescriptionEditorMode('html')}
                        disabled={isSubmitting}
                      >
                        HTML
                      </button>
                    </div>
                  </div>
                  <div className={`admin-rich-editor ${descriptionEditorMode === 'visual' ? '' : 'admin-hidden'}`} id="description">
                    <div ref={descriptionEditorRef} className="admin-quill-host" />
                  </div>
                  <textarea
                    className={`admin-field admin-field--textarea admin-html-source ${descriptionEditorMode === 'html' ? '' : 'admin-hidden'}`}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Write or paste HTML here..."
                    disabled={isSubmitting}
                  />
                </div>

                <div className="admin-field-group admin-field-group--full">
                  <div className="admin-rich-editor-head">
                    <label className="admin-field-label" htmlFor="additionalInfo">Additional Information *</label>
                    <div className="admin-rich-editor-mode" role="tablist" aria-label="Additional information editor mode">
                      <button
                        className={`admin-toggle-btn ${additionalInfoEditorMode === 'visual' ? 'is-active' : ''}`}
                        type="button"
                        onClick={() => setAdditionalInfoEditorMode('visual')}
                        disabled={isSubmitting}
                      >
                        Visual
                      </button>
                      <button
                        className={`admin-toggle-btn ${additionalInfoEditorMode === 'html' ? 'is-active' : ''}`}
                        type="button"
                        onClick={() => setAdditionalInfoEditorMode('html')}
                        disabled={isSubmitting}
                      >
                        HTML
                      </button>
                    </div>
                  </div>
                  <div className={`admin-rich-editor admin-rich-editor--small ${additionalInfoEditorMode === 'visual' ? '' : 'admin-hidden'}`} id="additionalInfo">
                    <div ref={additionalInfoEditorRef} className="admin-quill-host admin-quill-host--small" />
                  </div>
                  <textarea
                    className={`admin-field admin-field--textarea admin-field--small admin-html-source ${additionalInfoEditorMode === 'html' ? '' : 'admin-hidden'}`}
                    value={additionalInfo}
                    onChange={(event) => setAdditionalInfo(event.target.value)}
                    placeholder="Write or paste HTML here..."
                    disabled={isSubmitting}
                  />
                </div>

                <div className="admin-field-group admin-field-group--full">
                  <label className="admin-field-label">Visibility *</label>
                  <div className="admin-rich-editor-mode" role="group" aria-label="Product visibility">
                  <button
                    className={`admin-toggle-btn ${isActive === 1 ? 'is-active' : ''}`}
                    type="button"
                    onClick={() => setIsActive(1)}
                    disabled={isSubmitting}
                  >
                    Active
                  </button>
                  <button
                    className={`admin-toggle-btn ${isActive === 0 ? 'is-active' : ''}`}
                    type="button"
                    onClick={() => setIsActive(0)}
                    disabled={isSubmitting}
                  >
                    Inactive
                  </button>
                  </div>
                  <div className="admin-inline-note">This controls whether the product is visible to customers.</div>
                </div>

                <div className="admin-field-group admin-field-group--full">
                  <label className="admin-field-label">Product Flags</label>
                  <div className="admin-flag-grid">
                    <label className="admin-check-card">
                      <input
                        type="checkbox"
                    checked={bestSeller === 1}
                    onChange={(event) => setBestSeller(event.target.checked ? 1 : 0)}
                        disabled={isSubmitting}
                      />
                      <span>Best Seller</span>
                    </label>

                    <label className="admin-check-card">
                      <input
                        type="checkbox"
                        checked={isFeatured === 1}
                        onChange={(event) => setIsFeatured(event.target.checked ? 1 : 0)}
                        disabled={isSubmitting}
                      />
                      <span>Featured</span>
                    </label>

                    <label className="admin-check-card">
                      <input
                        type="checkbox"
                        checked={clearance === 1}
                        onChange={(event) => setClearance(event.target.checked ? 1 : 0)}
                        disabled={isSubmitting}
                      />
                      <span>Clearance</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-card admin-form-panel">
              <div className="admin-form-section-title">Images</div>
              <div className="admin-inline-note">Manage main thumbnail and gallery images for this product. Maximum size: 10 MB per image.</div>

              <div className="admin-upload-block">
                <label className="admin-field-label" htmlFor="mainImage">Main Image (Thumbnail) *</label>
                <input
                  className="admin-field"
                  id="mainImage"
                  accept="image/*"
                  type="file"
                  onChange={onMainImageChange}
                  disabled={isSubmitting}
                />
                {displayedMainPreview ? (
                  <img alt="Main product preview" className="admin-thumb-preview" src={displayedMainPreview} />
                ) : (
                  <div className="admin-inline-note">Upload a main product image.</div>
                )}
              </div>

              <div className="admin-upload-block">
                <label className="admin-field-label" htmlFor="galleryImages">Additional Images</label>
                <input
                  className="admin-field"
                  id="galleryImages"
                  accept="image/*"
                  multiple
                  type="file"
                  onChange={onGalleryImagesChange}
                  disabled={isSubmitting}
                />

                <div className="admin-gallery-grid">
                  {existingGalleryImages.length || galleryPreviews.length ? (
                    <>
                      {existingGalleryImages.map((image) => (
                        <div className="admin-gallery-item" key={`existing-${image.id}`}>
                          <img alt="Existing gallery image" src={image.image} />
                          <button
                            className="admin-gallery-remove"
                            onClick={() => promptRemoveExistingImage(image)}
                            type="button"
                            disabled={isSubmitting || deletingImageId === image.id}
                            title="Remove this image"
                          >
                            {deletingImageId === image.id ? 'Removing...' : 'Remove'}
                          </button>
                          <div className="admin-inline-note admin-inline-note--padded">Gallery image</div>
                        </div>
                      ))}
                      {galleryPreviews.map(({ file, src }, index) => (
                        <div className="admin-gallery-item" key={`${file.name}-${index}`}>
                          <img alt={file.name} src={src} />
                          <button
                            className="admin-gallery-remove"
                            onClick={() => promptRemoveGalleryImage(index, file)}
                            type="button"
                            disabled={isSubmitting}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="admin-inline-note">Add additional product images (optional).</div>
                  )}
                </div>
              </div>

              <div className="admin-inline-note">
                Total images: {totalDisplayedImages} (Existing: {existingImages.length}, New: {allImages.length})
              </div>
            </div>
          </div>

          <div className="admin-actions-row admin-product-form-actions">
            <button
              className="admin-action-btn admin-action-btn--ghost"
              type="button"
              disabled={isSubmitting}
              onClick={() => navigate('/admin/products')}
            >
              Cancel
            </button>
            <button
              className="admin-action-btn"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (isEditMode ? 'Updating Product...' : 'Creating Product...') : (isEditMode ? 'Update Product' : 'Create Product')}
            </button>
          </div>

        </section>
      </form>

      {confirmRemoval ? (
        <div className="admin-modal-backdrop" onClick={closeRemoveConfirm} role="presentation">
          <div
            className="admin-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-image-modal-title"
          >
            <div className="admin-modal-head">
              <div>
                <div className="admin-card-kicker">Remove image</div>
                <div className="admin-card-title" id="remove-image-modal-title">Confirm removal</div>

              </div>
              <button className="admin-icon-btn admin-modal-close" onClick={closeRemoveConfirm} type="button" aria-label="Close modal">
                ×
              </button>
            </div>

            <div className="admin-modal-body">
              <p className="admin-preview-copy">
                Are you sure you want to remove{' '}
                <strong>
                  {confirmRemoval.type === 'existing'
                    ? 'this existing image'
                    : confirmRemoval.file?.name || 'this selected image'}
                </strong>
                ?
              </p>
              <div className="admin-modal-actions">
                <button className="admin-action-btn admin-action-btn--ghost" type="button" onClick={closeRemoveConfirm}>
                  Cancel
                </button>
                <button className="admin-action-btn" type="button" onClick={confirmRemoveImage}>
                  Remove image
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}
