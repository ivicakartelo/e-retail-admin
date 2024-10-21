import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewArticle } from './articlesSlice'; // Action to add a new article
import { fetchCategories } from '../categories/categoriesSlice'; // Action to fetch categories
import { fetchArticles } from './articlesSlice'; // Action to fetch articles after adding a new one
import './AddArticleForm.css'; // Import CSS for styling

export const AddArticleForm = ({ onCancel = () => {} }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [promotionAtHomepageLevel, setPromotionAtHomepageLevel] = useState(0); // Default to 'No' (0)
  const [promotionAtDepartmentLevel, setPromotionAtDepartmentLevel] = useState(0); // Default to 'No' (0)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]); // For multiple categories
  const [addRequestStatus, setAddRequestStatus] = useState('idle');
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories); // Fetch categories from Redux store
  const categoryStatus = useSelector((state) => state.categories.status);

  useEffect(() => {
    if (categoryStatus === 'idle') {
      dispatch(fetchCategories()); // Fetch categories when form loads
    }
  }, [categoryStatus, dispatch]);

  const canSave = Boolean(name) && Boolean(description) && selectedCategoryIds.length > 0 && addRequestStatus === 'idle';

  const onSaveArticleClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      try {
        setAddRequestStatus('pending');
        
        // Create a new article object
        const newArticle = {
          name,
          description,
          image_1: image1,
          image_2: image2,
          promotion_at_homepage_level: promotionAtHomepageLevel,
          promotion_at_department_level: promotionAtDepartmentLevel,
          category_ids: selectedCategoryIds, // Send an array of category IDs
        };

        // Dispatch the action to add the new article
        await dispatch(addNewArticle(newArticle)).unwrap();

        // Fetch the updated list of articles after adding the new article
        dispatch(fetchArticles());

        // Clear form fields after successful submission
        resetForm();
        setError(null);
      } catch (err) {
        console.error('Failed to save the article: ', err);
        setError('Error saving the article');
      } finally {
        setAddRequestStatus('idle');
      }
    } else {
      setError('Please fill out all required fields');
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

  // Reset form fields
  const resetForm = () => {
    setName('');
    setDescription('');
    setImage1('');
    setImage2('');
    setPromotionAtHomepageLevel(0); // Reset to 'No'
    setPromotionAtDepartmentLevel(0); // Reset to 'No'
    setSelectedCategoryIds([]); // Clear the selected categories
  };

  // Handle cancel button click
  const handleCancel = () => {
    resetForm(); // Reset form fields
    onCancel();   // Call onCancel function
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

      {/* Radio button group for Promotion at Homepage Level */}
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

      {/* Radio button group for Promotion at Department Level */}
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

      {/* Category multiple selection dropdown */}
      <label htmlFor="categorySelect">Select Categories</label>
      <select
        id="categorySelect"
        value={selectedCategoryIds}
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
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'} // Hover effect
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'} // Reset background
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddArticleForm;