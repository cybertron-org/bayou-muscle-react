import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import useProducts from '../../hooks/useProducts';
import { getProduct } from '../../services/productsService';
import AdminLayout from '../layouts/AdminLayout';

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const isEditMode = Boolean(productId);
  const { addProduct, editProduct } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);

  // Basic Info
  const [categoryId, setCategoryId] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [sku, setSku] = useState('');
  const [gender, setGender] = useState('unisex');

  // Description Fields
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  // Product Flags
  const [isActive, setIsActive] = useState(1);
  const [bestSeller, setBestSeller] = useState(0);
  const [isFeatured, setIsFeatured] = useState(0);
  const [clearance, setClearance] = useState(0);

  // Images
  const [mainImage, setMainImage] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);

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
            setQuantity(product.quantity || '');
            setSku(product.sku || '');
            setGender(product.gender || 'unisex');
            setSummary(product.summary || '');
            setDescription(product.description || '');
            setAdditionalInfo(product.additional_info || '');
            setIsActive(product.is_active ? 1 : 0);
            setBestSeller(product.best_seller ? 1 : 0);
            setIsFeatured(product.is_featured ? 1 : 0);
            setClearance(product.clearance ? 1 : 0);
            // Note: Images are not pre-populated; user must re-upload to change them
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
    setMainImage(file);
    if (file) {
      setMainImageIndex(0);
    }
  };

  const onGalleryImagesChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) {
      return;
    }
    setGalleryImages((prev) => [...prev, ...files]);
    event.target.value = '';
  };

  const removeGalleryImage = (index) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

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
    if (!quantity || Number(quantity) < 0) {
      errors.push('Valid quantity is required');
    }
    if (!sku.trim()) {
      errors.push('SKU is required');
    }
    if (!summary.trim()) {
      errors.push('Summary is required');
    }
    if (!description.trim()) {
      errors.push('Description is required');
    }
    if (!additionalInfo.trim()) {
      errors.push('Additional info is required');
    }
    if (allImages.length === 0) {
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
      formData.append('quantity', String(quantity));
      formData.append('summary', summary);
      formData.append('description', description);
      formData.append('additional_info', additionalInfo);
      formData.append('gender', gender);
      formData.append('is_active', String(isActive));
      formData.append('main_image_index', String(mainImageIndex));
      formData.append('sku', sku);
      formData.append('best_seller', String(bestSeller));
      formData.append('is_featured', String(isFeatured));
      formData.append('clearance', String(clearance));

      // Add all images only if there are new images
      if (allImages.length > 0) {
        allImages.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
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
      toast.error(err?.message || `Failed to ${isEditMode ? 'update' : 'create'} product`);
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
      <form onSubmit={handleSubmit}>
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

          <div className="admin-create-layout">
            {/* Basic Information Section */}
            <div className="admin-card" style={{ padding: '18px' }}>
              <div className="admin-form-section-title">Basic Information</div>
              <div className="admin-form-grid">
                <div className="admin-field-group">
                  <label className="admin-field-label" htmlFor="categoryId">Category ID *</label>
                  <input
                    className="admin-field"
                    id="categoryId"
                    placeholder="Ex: 1"
                    type="number"
                    value={categoryId}
                    onChange={(event) => setCategoryId(event.target.value)}
                    required
                    disabled={isSubmitting}
                  />
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
                  <label className="admin-field-label" htmlFor="quantity">Quantity *</label>
                  <input
                    className="admin-field"
                    id="quantity"
                    placeholder="Ex: 99"
                    type="number"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
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

                <div className="admin-field-group admin-field-group--full">
                  <label className="admin-field-label" htmlFor="description">Description *</label>
                  <textarea
                    className="admin-field admin-field--textarea"
                    id="description"
                    placeholder="Full product description, ingredients, usage details..."
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="admin-field-group admin-field-group--full">
                  <label className="admin-field-label" htmlFor="additionalInfo">Additional Information *</label>
                  <textarea
                    className="admin-field admin-field--textarea admin-field--small"
                    id="additionalInfo"
                    placeholder="Additional details like warnings, certifications, etc..."
                    value={additionalInfo}
                    onChange={(event) => setAdditionalInfo(event.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Product Flags Section */}
            <div className="admin-card" style={{ padding: '18px' }}>
              <div className="admin-form-section-title">Product Flags</div>
              <div className="admin-form-grid">
                <div className="admin-field-group">
                  <label className="admin-field-label">
                    <input
                      type="checkbox"
                      checked={isActive === 1}
                      onChange={(event) => setIsActive(event.target.checked ? 1 : 0)}
                      disabled={isSubmitting}
                    />
                    {' '}Active
                  </label>
                </div>

                <div className="admin-field-group">
                  <label className="admin-field-label">
                    <input
                      type="checkbox"
                      checked={bestSeller === 1}
                      onChange={(event) => setBestSeller(event.target.checked ? 1 : 0)}
                      disabled={isSubmitting}
                    />
                    {' '}Best Seller
                  </label>
                </div>

                <div className="admin-field-group">
                  <label className="admin-field-label">
                    <input
                      type="checkbox"
                      checked={isFeatured === 1}
                      onChange={(event) => setIsFeatured(event.target.checked ? 1 : 0)}
                      disabled={isSubmitting}
                    />
                    {' '}Featured
                  </label>
                </div>

                <div className="admin-field-group">
                  <label className="admin-field-label">
                    <input
                      type="checkbox"
                      checked={clearance === 1}
                      onChange={(event) => setClearance(event.target.checked ? 1 : 0)}
                      disabled={isSubmitting}
                    />
                    {' '}Clearance
                  </label>
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="admin-card" style={{ padding: '18px' }}>
              <div className="admin-form-section-title">Images</div>

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
                {mainPreview ? (
                  <img alt="Main product preview" className="admin-thumb-preview" src={mainPreview} />
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
                  {galleryPreviews.length ? (
                    galleryPreviews.map(({ file, src }, index) => (
                      <div className="admin-gallery-item" key={`${file.name}-${index}`}>
                        <img alt={file.name} src={src} />
                        <button
                          className="admin-gallery-remove"
                          onClick={() => removeGalleryImage(index)}
                          type="button"
                          disabled={isSubmitting}
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="admin-inline-note">Add additional product images (optional).</div>
                  )}
                </div>
              </div>

              <div className="admin-inline-note">
                Total images: {allImages.length} (Main: 1 + Gallery: {galleryImages.length})
              </div>
            </div>
          </div>

          <div className="admin-card" style={{ padding: '18px', marginTop: '16px' }}>
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
    </AdminLayout>
  );
}