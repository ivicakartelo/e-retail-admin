import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateArticle } from './articlesSlice';
import { fetchArticles } from './articlesSlice';
import './UpdateArticleForm.css';

export const UpdateArticleForm = ({ article, setShowEditForm }) => {
  // Initialize state variables for form fields
  const [name, setName] = useState(article.name);
  const [description, setDescription] = useState(article.description);
  const [price, setPrice] = useState(article.price || ''); // Add price
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [promotionAtHomepageLevel, setPromotionAtHomepageLevel] = useState(
    article.promotion_at_homepage_level !== undefined ? Number(article.promotion_at_homepage_level) : 0
  );
  const [promotionAtDepartmentLevel, setPromotionAtDepartmentLevel] = useState(
    article.promotion_at_department_level !== undefined ? Number(article.promotion_at_department_level) : 0
  );

  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  // Ensure the form can be submitted only when required fields are filled
  const canSave = Boolean(name) && Boolean(description) && Boolean(price);

  // Handle form submission to update the article
  const onUpdateArticleClicked = async (e) => {
    e.preventDefault();

    if (canSave) {
      try {
        const formData = new FormData();

        // Append form fields
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price); // Add price to form data

        // Append new files if provided
        if (image1) formData.append('image_1', image1);
        if (image2) formData.append('image_2', image2);

        // Append radio values
        formData.append('promotion_at_homepage_level', promotionAtHomepageLevel);
        formData.append('promotion_at_department_level', promotionAtDepartmentLevel);

        // Dispatch the updateArticle action
        await dispatch(updateArticle({ id: article.article_id, data: formData })).unwrap();
        dispatch(fetchArticles());
        setShowEditForm(false);
      } catch (err) {
        console.error('Error updating article:', err);
        setError('Error updating article');
      }
    } else {
      setError('Please fill out all required fields.');
    }
  };

  // Handle file selection
  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
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

      <label htmlFor="articlePriceEdit">Price</label>
      <input
        id="articlePriceEdit"
        name="articlePriceEdit"
        type="number"
        placeholder="Enter price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      <label htmlFor="articleImage1Edit">Image 1</label>
      <input
        id="articleImage1Edit"
        name="articleImage1Edit"
        type="file"
        onChange={(e) => handleFileChange(e, setImage1)}
      />
      {article.image_1 && !image1 && <p>Current: {article.image_1}</p>}

      <label htmlFor="articleImage2Edit">Image 2</label>
      <input
        id="articleImage2Edit"
        name="articleImage2Edit"
        type="file"
        onChange={(e) => handleFileChange(e, setImage2)}
      />
      {article.image_2 && !image2 && <p>Current: {article.image_2}</p>}

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