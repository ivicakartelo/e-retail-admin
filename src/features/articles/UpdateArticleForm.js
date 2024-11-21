import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateArticle } from './articlesSlice';
import './UpdateArticleForm.css';

export const UpdateArticleForm = ({ article, setShowEditForm }) => {
  // Initialize state variables for form fields
  const [name, setName] = useState(article.name);
  const [description, setDescription] = useState(article.description);
  const [image1, setImage1] = useState(article.image_1);
  const [image2, setImage2] = useState(article.image_2);
  
  const [promotionAtHomepageLevel, setPromotionAtHomepageLevel] = useState(
    article.promotion_at_homepage_level !== undefined ? Number(article.promotion_at_homepage_level) : 0
  );
  const [promotionAtDepartmentLevel, setPromotionAtDepartmentLevel] = useState(
    article.promotion_at_department_level !== undefined ? Number(article.promotion_at_department_level) : 0
  );
  
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  // Ensure that the form can be submitted only when the required fields are filled
  const canSave = Boolean(name) && Boolean(description);

  // Handle form submission to update the article
  const onUpdateArticleClicked = async (e) => {
    e.preventDefault();

    if (canSave) {
      try {
        await dispatch(updateArticle({
          id: article.article_id,
          name,
          description,
          image_1: image1,
          image_2: image2,
          promotion_at_homepage_level: promotionAtHomepageLevel,
          promotion_at_department_level: promotionAtDepartmentLevel
        })).unwrap();
        setShowEditForm(false);
      } catch (err) {
        setError('Error updating article');
      }
    } else {
      setError('Please fill out all required fields.');
    }
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