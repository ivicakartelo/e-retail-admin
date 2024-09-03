import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNewArticle } from './articlesSlice';
import './AddArticleForm.css'; // Import CSS for styling

export const AddArticleForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [promotionAtHomepageLevel, setPromotionAtHomepageLevel] = useState('');
  const [promotionAtDepartmentLevel, setPromotionAtDepartmentLevel] = useState('');
  const [addRequestStatus, setAddRequestStatus] = useState('idle');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const canSave = Boolean(name) && Boolean(description) && addRequestStatus === 'idle';

  const onSaveArticleClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      try {
        setAddRequestStatus('pending');
        await dispatch(addNewArticle({
          name,
          description,
          image_1: image1,
          image_2: image2,
          promotion_at_homepage_level: promotionAtHomepageLevel,
          promotion_at_department_level: promotionAtDepartmentLevel
        })).unwrap();
        setName('');
        setDescription('');
        setImage1('');
        setImage2('');
        setPromotionAtHomepageLevel('');
        setPromotionAtDepartmentLevel('');
        setError(null);
      } catch (err) {
        console.error('Failed to save the article: ', err);
        setError('Error saving the article');
      } finally {
        setAddRequestStatus('idle');
      }
    } else {
      setError('Please fill out all fields');
    }
  };

  return (
    <form className="add-article-form" onSubmit={onSaveArticleClicked}>
      <h3>Add New Article</h3>

      {error && <div className="form-error">{error}</div>}

      <label htmlFor="articleName">Article Name</label>
      <input
        id="articleName"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter article name"
        required
      />

      <label htmlFor="articleDescription">Description</label>
      <textarea
        id="articleDescription"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter description"
        required
      />

      <label htmlFor="image1">Image 1 URL</label>
      <input
        id="image1"
        type="text"
        value={image1}
        onChange={(e) => setImage1(e.target.value)}
        placeholder="Enter image 1 URL"
      />

      <label htmlFor="image2">Image 2 URL</label>
      <input
        id="image2"
        type="text"
        value={image2}
        onChange={(e) => setImage2(e.target.value)}
        placeholder="Enter image 2 URL"
      />

      <label htmlFor="promotionHomepage">Promotion at Homepage Level</label>
      <input
        id="promotionHomepage"
        type="text"
        value={promotionAtHomepageLevel}
        onChange={(e) => setPromotionAtHomepageLevel(e.target.value)}
        placeholder="Enter homepage promotion level"
      />

      <label htmlFor="promotionDepartment">Promotion at Department Level</label>
      <input
        id="promotionDepartment"
        type="text"
        value={promotionAtDepartmentLevel}
        onChange={(e) => setPromotionAtDepartmentLevel(e.target.value)}
        placeholder="Enter department promotion level"
      />

      <div className="form-actions">
        <button type="submit" className="button-save" disabled={!canSave}>
          Save Article
        </button>
      </div>
    </form>
  );
};
