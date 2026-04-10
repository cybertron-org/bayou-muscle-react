import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';

const categorySeed = {
	supplement: ['Protein', 'Pre-Workout', 'Recovery', 'Vitamins'],
	merchandise: ['T-Shirts', 'Hoodies', 'Accessories', 'Gym Bags'],
};

export default function AdminCategories() {
	const [selectedCategory, setSelectedCategory] = useState('supplement');
	const [subcategoryInput, setSubcategoryInput] = useState('');
	const [categories, setCategories] = useState(categorySeed);

	const currentSubcategories = categories[selectedCategory];

	const handleAddSubcategory = () => {
		const value = subcategoryInput.trim();
		if (!value) {
			return;
		}

		const exists = currentSubcategories.some((item) => item.toLowerCase() === value.toLowerCase());
		if (exists) {
			setSubcategoryInput('');
			return;
		}

		setCategories((prev) => ({
			...prev,
			[selectedCategory]: [...prev[selectedCategory], value],
		}));
		setSubcategoryInput('');
	};

	const handleRemoveSubcategory = (value) => {
		setCategories((prev) => ({
			...prev,
			[selectedCategory]: prev[selectedCategory].filter((item) => item !== value),
		}));
	};

	const categoryCards = [
		{
			key: 'supplement',
			title: 'Supplement',
			subtitle: 'Protein, pre-workout, recovery, vitamins and related product trees.',
			count: categories.supplement.length,
			accent: 'admin-category-card--supplement',
		},
		{
			key: 'merchandise',
			title: 'Merchandise',
			subtitle: 'Apparel, gym bags, accessories, and branded lifestyle products.',
			count: categories.merchandise.length,
			accent: 'admin-category-card--merchandise',
		},
	];

	return (
		<AdminLayout title="Categories" subtitle="Manage the two core product groups and their subcategories.">
			<section className="admin-card">
				<div className="admin-card-head">
					<div>
						<div className="admin-card-kicker">Catalog structure</div>
						<div className="admin-card-title">Category manager</div>
						<div className="admin-card-subtitle">
							Select a parent category, then add and remove subcategories underneath it.
						</div>
					</div>
					<div className="admin-chip">UI only</div>
				</div>

				<div className="admin-category-grid">
					{categoryCards.map((item) => (
						<button
							className={`admin-category-card ${item.accent} ${selectedCategory === item.key ? 'is-active' : ''}`}
							key={item.key}
							onClick={() => setSelectedCategory(item.key)}
							type="button"
						>
							<div className="admin-category-card-top">
								<div>
									<div className="admin-category-card-label">Parent category</div>
									<div className="admin-category-card-title">{item.title}</div>
								</div>
								<div className="admin-category-card-pill">{item.count} subcategories</div>
							</div>
							<div className="admin-category-card-copy">{item.subtitle}</div>
						</button>
					))}
				</div>

				<div className="admin-create-layout admin-category-layout">
					<div className="admin-card" style={{ padding: '18px' }}>
						<div className="admin-form-section-title">Selected category</div>
						<div className="admin-list-item">
							<div className="admin-list-copy">
								<div className="admin-list-title">
									{selectedCategory === 'supplement' ? 'Supplement' : 'Merchandise'}
								</div>
								<div className="admin-list-subtitle">
									Add new subcategories directly under this parent category.
								</div>
							</div>
							<span className="admin-status admin-status--neutral">
								{currentSubcategories.length} items
							</span>
						</div>

						<div className="admin-field-group" style={{ marginTop: '16px' }}>
							<label className="admin-field-label" htmlFor="subcategoryInput">New subcategory</label>
							<div className="admin-inline-field">
								<input
									className="admin-field"
									id="subcategoryInput"
									placeholder={`Add a ${selectedCategory} subcategory`}
									type="text"
									value={subcategoryInput}
									onChange={(event) => setSubcategoryInput(event.target.value)}
									onKeyDown={(event) => {
										if (event.key === 'Enter') {
											event.preventDefault();
											handleAddSubcategory();
										}
									}}
								/>
								<button className="admin-action-btn" onClick={handleAddSubcategory} type="button">
									Add
								</button>
							</div>
						</div>

						<div className="admin-tags-wrap admin-tags-wrap--space">
							{currentSubcategories.map((item) => (
								<button className="admin-tag" key={item} onClick={() => handleRemoveSubcategory(item)} type="button">
									{item} ×
								</button>
							))}
						</div>
					</div>

					<div className="admin-card" style={{ padding: '18px' }}>
						<div className="admin-form-section-title">Structure preview</div>
						<div className="admin-placeholder admin-placeholder--compact">
							<div>
								<strong>{selectedCategory === 'supplement' ? 'Supplement' : 'Merchandise'}</strong>
								<div>
									{currentSubcategories.length
										? currentSubcategories.join(' · ')
										: 'No subcategories created yet.'}
								</div>
							</div>
						</div>

						<div className="admin-preview-copy" style={{ marginTop: '16px' }}>
							Clicking a category on the left switches the active parent. The right panel acts as the working editor
							for that selection.
						</div>
					</div>
				</div>
			</section>
		</AdminLayout>
	);
}
