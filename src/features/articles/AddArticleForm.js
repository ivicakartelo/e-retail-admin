import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNewArticle } from './articlesSlice';

export const AddArticleForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image_1, setImage1] = useState('');
  const [image_2, setImage2] = useState('');
  const [promotionAtHomepageLevel, setPromotionAtHomepageLevel] = useState('');
  const [promotionAtDepartmentLevel, setPromotionAtDepartmentLevel] = useState('');
  const [addRequestStatus, setAddRequestStatus] = useState('idle');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const canSave = Boolean(name) && Boolean(description) && Boolean(addRequestStatus === 'idle');

  const onSaveArticleClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus('pending');
        await dispatch(addNewArticle({
          name,
          description,
          image_1,
          image_2,
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
    }
  };

  return (
    <div>
      <h3>Add New Article</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Article Name"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <input
        type="text"
        value={image_1}
        onChange={(e) => setImage1(e.target.value)}
        placeholder="Image 1 URL"
      />
      <input
        type="text"
        value={image_2}
        onChange={(e) => setImage2(e.target.value)}
        placeholder="Image 2 URL"
      />
      <input
        type="text"
        value={promotionAtHomepageLevel}
        onChange={(e) => setPromotionAtHomepageLevel(e.target.value)}
        placeholder="Promotion at Homepage Level"
      />
      <input
        type="text"
        value={promotionAtDepartmentLevel}
        onChange={(e) => setPromotionAtDepartmentLevel(e.target.value)}
        placeholder="Promotion at Department Level"
      />
      <button onClick={onSaveArticleClicked} disabled={!canSave}>
        Save Article
      </button>
      {error && <div>{error}</div>}
    </div>
  );
};