import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewArticle } from './articlesSlice';
import { fetchCategories } from '../categories/categoriesSlice';
import { fetchArticles } from './articlesSlice';
import './AddArticleForm.css';

export const AddArticleForm = ({ onCancel = () => {} }) => {
  // Defining the state as a single object representing the article
  const [newArticle, setNewArticle] = useState({
    name: '',
    description: '',
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

  // Check if the form can be submitted
  const canSave =
    Boolean(newArticle.name) &&
    Boolean(newArticle.description) &&
    newArticle.category_ids.length > 0 &&
    addRequestStatus === 'idle';

  // Handle form submission
  const onSaveArticleClicked = async (e) => {
    e.preventDefault();

    if (canSave) {
      try {
        setAddRequestStatus('pending');
        
        console.log('New Article Data:', newArticle); // Check data before sending

        // Create FormData object and append fields and files
        const formData = new FormData();
        formData.append('name', newArticle.name);
        formData.append('description', newArticle.description);

        // Append images only if they are selected
        if (newArticle.image_1) formData.append('image_1', newArticle.image_1);
        if (newArticle.image_2) formData.append('image_2', newArticle.image_2);

        formData.append('promotion_at_homepage_level', newArticle.promotion_at_homepage_level);
        formData.append('promotion_at_department_level', newArticle.promotion_at_department_level);
        
        // Log FormData after appending each field to check it
console.log("FormData after append:", formData);
        
        // Console log selectedCategoryIds before adding it to formData
        console.log('selectedCategoryIds:', newArticle.category_ids);
        formData.append('category_ids', JSON.stringify(newArticle.category_ids)); // Array as JSON string
        console.log('FormData:', formData); // Ensure this contains all fields before dispatch
        
        for (let pair of formData.entries()) {
          console.log(pair[0]+ ', ' + pair[1]);
        }
        
        // Dispatch the thunk with FormData
        await dispatch(addNewArticle(formData)).unwrap();
        
        // Refetch articles and reset form after successful save
        dispatch(fetchArticles());
        resetForm();
        setError(null);
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

  // Handle category selection
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

  // Reset form to default state
  const resetForm = () => {
    setNewArticle({
      name: '',
      description: '',
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

      {/* Article Name Input */}
      <label htmlFor="articleName">Article Name</label>
      <input
        id="articleName"
        type="text"
        value={newArticle.name}
        onChange={(e) => setNewArticle({ ...newArticle, name: e.target.value })}
        placeholder="Enter article name"
        required
      />

      {/* Description Input */}
      <label htmlFor="articleDescription">Description</label>
      <textarea
        id="articleDescription"
        value={newArticle.description}
        onChange={(e) => setNewArticle({ ...newArticle, description: e.target.value })}
        placeholder="Enter description"
        required
      />

      {/* Image 1 Input */}
      <label htmlFor="image1">Image 1</label>
      <input
        id="image1"
        type="file"
        onChange={(e) => setNewArticle({ ...newArticle, image_1: e.target.files[0] })}
        required
      />

      {/* Image 2 Input */}
      <label htmlFor="image2">Image 2</label>
      <input
        id="image2"
        type="file"
        onChange={(e) => setNewArticle({ ...newArticle, image_2: e.target.files[0] })}
        required
      />

      {/* Promotion at Homepage Level */}
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

      {/* Promotion at Department Level */}
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

      {/* Category Selection */}
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
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddArticleForm;