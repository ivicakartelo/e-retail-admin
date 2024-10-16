import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateArticle } from './articlesSlice'; // Ensure the path is correct
import './AssignNewCategoryForm.css'; // Optional CSS import

const AssignNewCategoryForm = ({ article, allCategories = [], setShowAssignCategoryForm }) => {
  const [selectedNewCategories, setSelectedNewCategories] = useState([]);
  const dispatch = useDispatch();

  // Handle form submission for assigning new categories
  const handleAssignCategories = async (e) => {
    e.preventDefault();

    if (selectedNewCategories.length === 0) {
      alert('Please select at least one category to assign.');
      return;
    }

    try {
      const updatedCategories = [...new Set([...article.category_ids, ...selectedNewCategories])]; // Combine and remove duplicates

      await dispatch(
        updateArticle({
          id: article.article_id,
          name: article.name,
          description: article.description,
          image_1: article.image_1,
          image_2: article.image_2,
          promotion_at_homepage_level: article.promotion_at_homepage_level,
          promotion_at_department_level: article.promotion_at_department_level,
          category_ids: updatedCategories, // Add new categories
        })
      ).unwrap();

      setShowAssignCategoryForm(false); // Close the form on successful update
    } catch (err) {
      console.error('Failed to update article: ', err);
    }
  };

  // Handle multiple category selection
  const handleCategoryChange = (e) => {
    const options = e.target.options;
    const selectedIds = Array.from(options).filter(option => option.selected).map(option => option.value);
    setSelectedNewCategories(selectedIds);
  };

  return (
    <form className="assign-category-form" onSubmit={handleAssignCategories}>
      <h3>Assign New Categories</h3>

      <label htmlFor="assignCategoriesSelect">Select Categories to Assign:</label>
      <select
        id="assignCategoriesSelect"
        value={selectedNewCategories}
        onChange={handleCategoryChange}
        multiple
        required
      >
        {allCategories.length > 0 ? (
          allCategories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.name}
            </option>
          ))
        ) : (
          <option disabled>No categories available</option>
        )}
      </select>

      <div className="form-actions">
        <button type="submit" className="button-assign">Assign Categories</button>
        <button
          type="button"
          className="button-cancel"
          onClick={() => setShowAssignCategoryForm(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AssignNewCategoryForm;