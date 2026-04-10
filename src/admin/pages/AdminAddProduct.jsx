import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('supplement');
  const [summary, setSummary] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [subcategoryInput, setSubcategoryInput] = useState('');
  const [subcategories, setSubcategories] = useState(['Whey', 'Muscle Gain']);
  const [mainImage, setMainImage] = useState(null);
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

  const addSubcategory = () => {
    const value = subcategoryInput.trim();
    if (!value) {
      return;
    }
    if (subcategories.some((item) => item.toLowerCase() === value.toLowerCase())) {
      setSubcategoryInput('');
      return;
    }
    setSubcategories((prev) => [...prev, value]);
    setSubcategoryInput('');
  };

  const removeSubcategory = (value) => {
    setSubcategories((prev) => prev.filter((item) => item !== value));
  };

  const onMainImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setMainImage(file);
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

  return (
    <AdminLayout
      title="Add Product"
      subtitle="UI-only product creation form with interactive fields and image previews."
    >
      <section className="admin-card">
        <div className="admin-card-head">
          <div>
            <div className="admin-card-kicker">Catalog</div>
            <div className="admin-card-title">Create new product</div>
            <div className="admin-card-subtitle">
              Fill details below and preview how your product data is structured.
            </div>
          </div>
          <button className="admin-action-btn admin-action-btn--ghost" onClick={() => navigate('/admin/products')} type="button">
            Back to Products
          </button>
        </div>

        <div className="admin-create-layout">
          <div className="admin-card" style={{ padding: '18px' }}>
            <div className="admin-form-section-title">Basic details</div>
            <div className="admin-form-grid">
              <div className="admin-field-group admin-field-group--full">
                <label className="admin-field-label" htmlFor="productName">Product Name</label>
                <input
                  className="admin-field"
                  id="productName"
                  placeholder="Ex: Bayou Nitro Whey"
                  type="text"
                  value={productName}
                  onChange={(event) => setProductName(event.target.value)}
                />
              </div>

              <div className="admin-field-group">
                <label className="admin-field-label" htmlFor="productCategory">Category</label>
                <select
                  className="admin-field"
                  id="productCategory"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  <option value="supplement">Supplement</option>
                  <option value="merchandise">Merchandise</option>
                </select>
              </div>

              <div className="admin-field-group">
                <label className="admin-field-label" htmlFor="subcategoryInput">Sub Categories</label>
                <div className="admin-inline-field">
                  <input
                    className="admin-field"
                    id="subcategoryInput"
                    placeholder="Ex: Pre-Workout"
                    type="text"
                    value={subcategoryInput}
                    onChange={(event) => setSubcategoryInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        addSubcategory();
                      }
                    }}
                  />
                  <button className="admin-action-btn" onClick={addSubcategory} type="button">Add</button>
                </div>
                <div className="admin-tags-wrap">
                  {subcategories.length ? (
                    subcategories.map((item) => (
                      <button className="admin-tag" key={item} onClick={() => removeSubcategory(item)} type="button">
                        {item} ×
                      </button>
                    ))
                  ) : (
                    <span className="admin-inline-note">No sub category added yet.</span>
                  )}
                </div>
              </div>

              <div className="admin-field-group admin-field-group--full">
                <label className="admin-field-label" htmlFor="summary">Summary</label>
                <textarea
                  className="admin-field admin-field--textarea admin-field--small"
                  id="summary"
                  placeholder="Short summary for cards and quick previews..."
                  value={summary}
                  onChange={(event) => setSummary(event.target.value)}
                />
              </div>

              <div className="admin-field-group admin-field-group--full">
                <label className="admin-field-label" htmlFor="longDescription">Long Description</label>
                <textarea
                  className="admin-field admin-field--textarea"
                  id="longDescription"
                  placeholder="Full product description, ingredients, usage, size details, etc."
                  value={longDescription}
                  onChange={(event) => setLongDescription(event.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="admin-card" style={{ padding: '18px' }}>
            <div className="admin-form-section-title">Images</div>

            <div className="admin-upload-block">
              <label className="admin-field-label" htmlFor="mainImage">Main Image (Thumbnail)</label>
              <input className="admin-field" id="mainImage" accept="image/*" type="file" onChange={onMainImageChange} />
              {mainPreview ? (
                <img alt="Main product preview" className="admin-thumb-preview" src={mainPreview} />
              ) : (
                <div className="admin-inline-note">Upload one main image.</div>
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
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="admin-inline-note">Add as many gallery images as you want.</div>
                )}
              </div>
            </div>
          </div>
        </div>

      </section>
    </AdminLayout>
  );
}