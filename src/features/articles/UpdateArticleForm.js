import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateArticle } from './articlesSlice';
import './UpdateArticleForm.css';

export const UpdateArticleForm = ({ article, setShowEditForm }) => {
  console.log('Initial article data:', article);
  console.log('Homepage Promotion:', article.promotion_at_homepage_level);
console.log('Department Promotion:', article.promotion_at_department_level);

  // Initialize state variables for form fields
  const [name, setName] = useState(article.name);
  const [description, setDescription] = useState(article.description);
  const [image1, setImage1] = useState(article.image_1);
  const [image2, setImage2] = useState(article.image_2);
  
  console.log('Homepage Promotion:', article.promotion_at_homepage_level);
console.log('Department Promotion:', article.promotion_at_department_level);
const [promotionAtHomepageLevel, setPromotionAtHomepageLevel] = useState(
  article.promotion_at_homepage_level !== undefined ? Number(article.promotion_at_homepage_level) : 0
);
const [promotionAtDepartmentLevel, setPromotionAtDepartmentLevel] = useState(
  article.promotion_at_department_level !== undefined ? Number(article.promotion_at_department_level) : 0
);
  
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(article.category_ids || []);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  // Ensure that the form can be submitted only when the required fields are filled
  const canSave = Boolean(name) && Boolean(description) && selectedCategoryIds.length > 0;

  // Handle form submission to update the article
  const onUpdateArticleClicked = async (e) => {
    e.preventDefault();

    if (canSave) {
      try {
        await dispatch(updateArticle({
          id: article.articleId,
          name,
          description,
          image_1: image1,
          image_2: image2,
          promotion_at_homepage_level: promotionAtHomepageLevel,
          promotion_at_department_level: promotionAtDepartmentLevel,
          category_ids: selectedCategoryIds,
        })).unwrap();
        setShowEditForm(false);
      } catch (err) {
        setError('Error updating article');
      }
    } else {
      setError('Please fill out all required fields.');
    }
  };

  // Handle multiple category selection
  const handleCategoryChange = (e) => {
    const options = e.target.options;
    const selectedIds = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedIds.push(options[i].value);
      }
    }
    setSelectedCategoryIds(selectedIds);
  };

  return (
    <form className="update-article-form" onSubmit={onUpdateArticleClicked}>
      <h3>Edit Article</h3>

      {error && <div className="form-error">{error}</div>}

      <label htmlFor="articleNameEdit">Name</label>
      <input
        id="articleNameEdit"
        name="articleNameEdit"
        placeholder="Edit article name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label htmlFor="articleDescriptionEdit">Description</label>
      <textarea
        id="articleDescriptionEdit"
        name="articleDescriptionEdit"
        placeholder="Edit article description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <label htmlFor="articleImage1Edit">Image 1</label>
      <input
        id="articleImage1Edit"
        name="articleImage1Edit"
        placeholder="Edit image 1 URL"
        value={image1}
        onChange={(e) => setImage1(e.target.value)}
      />

      <label htmlFor="articleImage2Edit">Image 2</label>
      <input
        id="articleImage2Edit"
        name="articleImage2Edit"
        placeholder="Edit image 2 URL"
        value={image2}
        onChange={(e) => setImage2(e.target.value)}
      />

      <label>Promotion at Homepage Level</label>
      <div className="radio-group">
        <div>
          <input
            type="radio"
            id="promotionHomepageYes"
            name="promotionAtHomepageLevel"
            value={1}
            checked={promotionAtHomepageLevel === 1}
            onChange={() => setPromotionAtHomepageLevel(1)}
          />
          <label htmlFor="promotionHomepageYes">Yes</label>
        </div>
        <div>
          <input
            type="radio"
            id="promotionHomepageNo"
            name="promotionAtHomepageLevel"
            value={0}
            checked={promotionAtHomepageLevel === 0}
            onChange={() => setPromotionAtHomepageLevel(0)}
          />
          <label htmlFor="promotionHomepageNo">No</label>
        </div>
      </div>

      <label>Promotion at Department Level</label>
      <div className="radio-group">
        <div>
          <input
            type="radio"
            id="promotionDepartmentYes"
            name="promotionAtDepartmentLevel"
            value={1}
            checked={promotionAtDepartmentLevel === 1}
            onChange={() => setPromotionAtDepartmentLevel(1)}
          />
          <label htmlFor="promotionDepartmentYes">Yes</label>
        </div>
        <div>
          <input
            type="radio"
            id="promotionDepartmentNo"
            name="promotionAtDepartmentLevel"
            value={0}
            checked={promotionAtDepartmentLevel === 0}
            onChange={() => setPromotionAtDepartmentLevel(0)}
          />
          <label htmlFor="promotionDepartmentNo">No</label>
        </div>
      </div>

      <label htmlFor="categorySelectEdit">Select Categories</label>
      <select
        id="categorySelectEdit"
        value={selectedCategoryIds}
        onChange={handleCategoryChange}
        multiple
        required
      >
        {/* Assuming categories are passed in as a prop or from a redux store */}
        {(article.categories || []).map((category) => (
          <option key={category.category_id} value={category.category_id}>
            {category.name}
          </option>
        ))}
      </select>

      <div className="form-actions">
        <button type="submit" className="button-update" disabled={!canSave}>
          Update
        </button>
        <button type="button" className="button-cancel" onClick={() => setShowEditForm(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UpdateArticleForm;