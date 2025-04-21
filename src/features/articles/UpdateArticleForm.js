import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateArticle, fetchArticles } from './articlesSlice';
import './UpdateArticleForm.css';

export const UpdateArticleForm = ({ article, setShowEditForm }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState(article.name);
  const [description, setDescription] = useState(article.description);
  const [price, setPrice] = useState(article.price || '');
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [promotionAtHomepageLevel, setPromotionAtHomepageLevel] = useState(Number(article.promotion_at_homepage_level) || 0);
  const [promotionAtDepartmentLevel, setPromotionAtDepartmentLevel] = useState(Number(article.promotion_at_department_level) || 0);
  const [error, setError] = useState(null);

  const canSave = Boolean(name) && Boolean(description) && Boolean(price);

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!canSave) return setError('Please fill out all required fields.');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description); // raw HTML
      formData.append('price', price);
      if (image1) formData.append('image_1', image1);
      if (image2) formData.append('image_2', image2);
      formData.append('promotion_at_homepage_level', promotionAtHomepageLevel);
      formData.append('promotion_at_department_level', promotionAtDepartmentLevel);

      await dispatch(updateArticle({ id: article.article_id, data: formData })).unwrap();
      dispatch(fetchArticles());
      setShowEditForm(false);
    } catch (err) {
      console.error('Update failed:', err);
      setError('Error updating article');
    }
  };

  const handleImproveDescription = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/improve-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) throw new Error('Failed to improve description');

      const { updatedDescription } = await response.json();
      setDescription(updatedDescription.text || updatedDescription);
    } catch (err) {
      console.error('Improve failed:', err);
      setError('Error improving description');
    }
  };

  return (
    <form className="update-article-form" onSubmit={handleUpdate}>
      <h3>Edit Article</h3>
      {error && <div className="form-error">{error}</div>}

      <label htmlFor="name">Name</label>
      <input
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Article name"
        required
      />

      <label htmlFor="description">Description (HTML)</label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={10}
        required
      />
      <button type="button" onClick={handleImproveDescription} className="button-improve-description">
        Improve Description
      </button>

      {/* Optional Live Preview */}
      <div className="description-preview">
        <label>Live Preview:</label>
        <div className="html-preview" dangerouslySetInnerHTML={{ __html: description }} />
      </div>

      <label htmlFor="price">Price</label>
      <input
        id="price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Enter price"
        required
      />

      <label htmlFor="image1">Image 1</label>
      <input type="file" onChange={(e) => handleFileChange(e, setImage1)} />
      {article.image_1 && !image1 && <p>Current: {article.image_1}</p>}

      <label htmlFor="image2">Image 2</label>
      <input type="file" onChange={(e) => handleFileChange(e, setImage2)} />
      {article.image_2 && !image2 && <p>Current: {article.image_2}</p>}

      <fieldset>
        <legend>Promotion at Homepage Level</legend>
        <label>
          <input
            type="radio"
            name="homepagePromo"
            value={1}
            checked={promotionAtHomepageLevel === 1}
            onChange={() => setPromotionAtHomepageLevel(1)}
          />
          Yes
        </label>
        <label>
          <input
            type="radio"
            name="homepagePromo"
            value={0}
            checked={promotionAtHomepageLevel === 0}
            onChange={() => setPromotionAtHomepageLevel(0)}
          />
          No
        </label>
      </fieldset>

      <fieldset>
        <legend>Promotion at Department Level</legend>
        <label>
          <input
            type="radio"
            name="departmentPromo"
            value={1}
            checked={promotionAtDepartmentLevel === 1}
            onChange={() => setPromotionAtDepartmentLevel(1)}
          />
          Yes
        </label>
        <label>
          <input
            type="radio"
            name="departmentPromo"
            value={0}
            checked={promotionAtDepartmentLevel === 0}
            onChange={() => setPromotionAtDepartmentLevel(0)}
          />
          No
        </label>
      </fieldset>

      <div className="form-actions">
        <button type="submit" className="button-update" disabled={!canSave}>Update</button>
        <button type="button" className="button-cancel" onClick={() => setShowEditForm(false)}>Cancel</button>
      </div>
    </form>
  );
};

export default UpdateArticleForm;