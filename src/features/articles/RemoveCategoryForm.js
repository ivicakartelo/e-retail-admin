import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateArticle } from './articlesSlice';

const RemoveCategoryForm = ({ article, setShowRemoveCategoryForm }) => {
  const [associatedCategories, setAssociatedCategories] = useState([]); // State to store the associated categories
  const [selectedCategories, setSelectedCategories] = useState([]); // State to store selected categories for removal
  const dispatch = useDispatch();

  // Fetch associated categories from the server when the component loads
  useEffect(() => {
    const fetchAssociatedCategories = async () => {
      try {
        console.log('Fetching associated categories for article ID:', article.article_id); // Debug log
        const response = await fetch(`http://localhost:5000/articles/${article.article_id}/categories`);
        console.log('API Response:', response); // Log the response object

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`); // Log HTTP errors
        }

        const data = await response.json();
        console.log('Fetched Data:', data); // Log the fetched data

        if (data.category_ids) {
          setAssociatedCategories(data.category_ids); // Assuming data contains associated category IDs
        } else {
          console.error('No category_ids found in the response.');
        }
      } catch (error) {
        console.error('Error fetching associated categories:', error);
      }
    };

    fetchAssociatedCategories(); // Call the function to fetch categories
  }, [article.article_id]);

  // Handle form submission to remove selected categories
  const handleUpdateCategories = async (e) => {
    e.preventDefault();

    if (selectedCategories.length === 0) {
      alert('Please select at least one category to remove.');
      return;
    }

    try {
      // Filter out the selected categories to be removed
      const updatedCategories = associatedCategories.filter(
        (categoryId) => !selectedCategories.includes(categoryId)
      );

      // Dispatch action to update article with the new category list
      await dispatch(
        updateArticle({
          id: article.article_id,
          category_ids: updatedCategories, // Send updated category list without removed categories
        })
      ).unwrap();

      setShowRemoveCategoryForm(false); // Close form after update
    } catch (err) {
      console.error('Failed to update article: ', err);
    }
  };

  // Handle selection of categories to be removed
  const handleCategoryChange = (e) => {
    const options = e.target.options;
    const selectedIds = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);
    setSelectedCategories(selectedIds);
  };

  return (
    <form onSubmit={handleUpdateCategories}>
      <h3>Remove Categories</h3>

      <label htmlFor="removeCategoriesSelect">Select Categories to Remove:</label>
      <select
        id="removeCategoriesSelect"
        value={selectedCategories}
        onChange={handleCategoryChange}
        multiple
      >
        {associatedCategories.map((categoryId) => (
          <option key={categoryId} value={categoryId}>
            Category {categoryId} {/* Replace with category name if available */}
          </option>
        ))}
      </select>

      <div className="form-actions">
        <button type="submit">Remove</button>
        <button
          type="button"
          onClick={() => setShowRemoveCategoryForm(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default RemoveCategoryForm;