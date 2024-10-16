import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateArticle } from './articlesSlice'; // Assuming this is the correct path
import './AssignNewCategoryForm.css'; // Optional: style the form if needed

const AssignNewCategoryForm = ({ article, allCategories = [], setShowAssignNewCategoryForm }) => {
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
      // Dispatch update article action to assign the new categories
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
          category_ids: updatedCategories, // Update the category IDs with new ones added
        })
      ).unwrap();

      setShowAssignNewCategoryForm(false); // Close the form after successful update
    } catch (err) {
      console.error('Failed to update article: ', err);
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
          onClick={() => {
            console.log('Cancel button clicked'); // Debugging log
            setShowAssignNewCategoryForm(false); // Close the form on cancel
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AssignNewCategoryForm;