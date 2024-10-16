import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateArticle } from './articlesSlice';
import './RemoveCategoryForm.css'; // Optional: style the form if needed

const RemoveCategoryForm = ({ article, setShowRemoveCategoryForm }) => {
  const [selectedCategories, setSelectedCategories] = useState(article.category_ids || []);
  const dispatch = useDispatch();

  // Handle form submission for removing selected categories
  const handleUpdateCategories = async (e) => {
    e.preventDefault();

    if (selectedCategories.length === 0) {
      alert('Please select at least one category to remove.');
      return;
    }

    try {
      // Dispatch update article action to remove the selected categories
      const updatedCategories = article.category_ids.filter(
        (categoryId) => !selectedCategories.includes(categoryId)
      );

      await dispatch(
        updateArticle({
          id: article.article_id,
          name: article.name,
          description: article.description,
          image_1: article.image_1,
          image_2: article.image_2,
          promotion_at_homepage_level: article.promotion_at_homepage_level,
          promotion_at_department_level: article.promotion_at_department_level,
          category_ids: updatedCategories, // Update the category IDs without the removed ones
        })
      ).unwrap();

      setShowRemoveCategoryForm(false); // Close the form after successful update
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
    setSelectedCategories(selectedIds);
  };

  return (
    <form className="remove-category-form" onSubmit={handleUpdateCategories}>
      <h3>Remove Categories</h3>

      <label htmlFor="removeCategoriesSelect">Select Categories to Remove:</label>
      <select
        id="removeCategoriesSelect"
        value={selectedCategories}
        onChange={handleCategoryChange}
        multiple
      >
        {(article.categories || []).map((category) => (
          <option key={category.category_id} value={category.category_id}>
            {category.name}
          </option>
        ))}
      </select>

      <div className="form-actions">
        <button type="submit" className="button-update">Update</button>
        <button
          type="button"
          className="button-cancel"
          onClick={() => setShowRemoveCategoryForm(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default RemoveCategoryForm;