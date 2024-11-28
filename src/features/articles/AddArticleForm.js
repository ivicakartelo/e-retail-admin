import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewArticle } from './articlesSlice';
import { fetchCategories } from '../categories/categoriesSlice';
import { fetchArticles } from './articlesSlice';
import './AddArticleForm.css';

export const AddArticleForm = ({ onCancel = () => {} }) => {
  // Updated state to include `price`
  const [newArticle, setNewArticle] = useState({
    name: '',
    description: '',
    price: '', // Added price to state
    image_1: null,
    image_2: null,
    promotion_at_homepage_level: 0,
    promotion_at_department_level: 0,
    category_ids: [],
  });

  const [addRequestStatus, setAddRequestStatus] = useState('idle');
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories);
  const categoryStatus = useSelector((state) => state.categories.status);

  useEffect(() => {
    if (categoryStatus === 'idle') {
      dispatch(fetchCategories());
    }
  }, [categoryStatus, dispatch]);

  const canSave =
    Boolean(newArticle.name) &&
    Boolean(newArticle.description) &&
    Boolean(newArticle.price) && // Ensure price is filled
    newArticle.category_ids.length > 0 &&
    addRequestStatus === 'idle';

  const onSaveArticleClicked = async (e) => {
    e.preventDefault();

    if (canSave) {
      try {
        setAddRequestStatus('pending');

        // Create FormData object and append fields
        const formData = new FormData();
        formData.append('name', newArticle.name);
        formData.append('description', newArticle.description);
        formData.append('price', newArticle.price); // Append price

        if (newArticle.image_1) formData.append('image_1', newArticle.image_1);
        if (newArticle.image_2) formData.append('image_2', newArticle.image_2);

        formData.append('promotion_at_homepage_level', newArticle.promotion_at_homepage_level);
        formData.append('promotion_at_department_level', newArticle.promotion_at_department_level);
        formData.append('category_ids', JSON.stringify(newArticle.category_ids));

        await dispatch(addNewArticle(formData)).unwrap();

        dispatch(fetchArticles());
        resetForm();
        setError(null);
        onCancel();
      } catch (err) {
        console.error('Failed to save the article:', err);
        setError('Error saving the article');
      } finally {
        setAddRequestStatus('idle');
      }
    } else {
      setError('Please fill out all required fields');
    }
  };

  const handleCategoryChange = (e) => {
    const options = e.target.options;
    const selectedIds = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedIds.push(options[i].value);
      }
    }
    setNewArticle((prev) => ({
      ...prev,
      category_ids: selectedIds,
    }));
  };

  const resetForm = () => {
    setNewArticle({
      name: '',
      description: '',
      price: '', // Reset price
      image_1: null,
      image_2: null,
      promotion_at_homepage_level: 0,
      promotion_at_department_level: 0,
      category_ids: [],
    });
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  return (
    <form className="add-article-form" onSubmit={onSaveArticleClicked}>
      <h3>Add New Article</h3>

      {error && <div className="form-error">{error}</div>}

      <label htmlFor="articleName">Article Name</label>
      <input
        id="articleName"
        type="text"
        value={newArticle.name}
        onChange={(e) => setNewArticle({ ...newArticle, name: e.target.value })}
        placeholder="Enter article name"
        required
      />

      <label htmlFor="articleDescription">Description</label>
      <textarea
        id="articleDescription"
        value={newArticle.description}
        onChange={(e) => setNewArticle({ ...newArticle, description: e.target.value })}
        placeholder="Enter description"
        required
      />

      {/* New Input for Price */}
      <label htmlFor="articlePrice">Price</label>
      <input
        id="articlePrice"
        type="number"
        step="0.01"
        value={newArticle.price}
        onChange={(e) => setNewArticle({ ...newArticle, price: e.target.value })}
        placeholder="Enter price"
        required
      />

      <label htmlFor="image1">Image 1</label>
      <input
        id="image1"
        type="file"
        onChange={(e) => setNewArticle({ ...newArticle, image_1: e.target.files[0] })}
      />

      <label htmlFor="image2">Image 2</label>
      <input
        id="image2"
        type="file"
        onChange={(e) => setNewArticle({ ...newArticle, image_2: e.target.files[0] })}
      />

      <label>Promotion at Homepage Level</label>
      <div className="radio-group">
        <div>
          <input
            type="radio"
            id="promotionHomepageYes"
            name="promotionAtHomepageLevel"
            value={1}
            checked={newArticle.promotion_at_homepage_level === 1}
            onChange={() => setNewArticle({ ...newArticle, promotion_at_homepage_level: 1 })}
          />
          <label htmlFor="promotionHomepageYes">Yes</label>
        </div>
        <div>
          <input
            type="radio"
            id="promotionHomepageNo"
            name="promotionAtHomepageLevel"
            value={0}
            checked={newArticle.promotion_at_homepage_level === 0}
            onChange={() => setNewArticle({ ...newArticle, promotion_at_homepage_level: 0 })}
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
            checked={newArticle.promotion_at_department_level === 1}
            onChange={() => setNewArticle({ ...newArticle, promotion_at_department_level: 1 })}
          />
          <label htmlFor="promotionDepartmentYes">Yes</label>
        </div>
        <div>
          <input
            type="radio"
            id="promotionDepartmentNo"
            name="promotionAtDepartmentLevel"
            value={0}
            checked={newArticle.promotion_at_department_level === 0}
            onChange={() => setNewArticle({ ...newArticle, promotion_at_department_level: 0 })}
          />
          <label htmlFor="promotionDepartmentNo">No</label>
        </div>
      </div>

      <label htmlFor="categorySelect">Select Categories</label>
      <select
        id="categorySelect"
        value={newArticle.category_ids}
        onChange={handleCategoryChange}
        className="form-select"
        multiple
        required
      >
        {categories.map((category) => (
          <option key={category.category_id} value={category.category_id}>
            {category.name}
          </option>
        ))}
      </select>

      <div className="form-actions">
        <button type="submit" className="button-save" disabled={!canSave}>
          Save Article
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="cancel-button"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddArticleForm;