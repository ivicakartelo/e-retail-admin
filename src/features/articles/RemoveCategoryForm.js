import React, { useState, useEffect } from 'react';
import './RemoveCategoryForm.css'; // Import the CSS for styling

const RemoveCategoryForm = ({ article, setShowRemoveCategoryForm }) => {
  const [associatedCategories, setAssociatedCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Fetch categories when the component loads
  useEffect(() => {
    const fetchAssociatedCategories = async () => {
      try {
        const response = await fetch(`http://localhost:5000/articles/${article.article_id}/categories`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setAssociatedCategories(data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchAssociatedCategories();
  }, [article.article_id]);

  // Handle form submission to remove selected categories
  const handleRemoveCategories = async (e) => {
    e.preventDefault();
    if (selectedCategories.length === 0) {
      alert('Please select at least one category to remove.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/articles/${article.article_id}/remove-categories`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category_ids: selectedCategories }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove categories');
      }

      window.alert('Selected categories have been removed successfully.');
      setShowRemoveCategoryForm(false); // Close the form on success
    } catch (error) {
      console.error('Error removing categories:', error);
      window.alert('There was an error removing the categories.');
    }
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    const options = e.target.options;
    const selectedIds = Array.from(options)
      .filter(option => option.selected)
      .map(option => Number(option.value));
    setSelectedCategories(selectedIds);
  };

  return (
    <form onSubmit={handleRemoveCategories} className="remove-category-form">
      <h3>Remove Categories</h3>
      <label htmlFor="removeCategoriesSelect">Select Categories to Remove:</label>
      <select
        id="removeCategoriesSelect"
        value={selectedCategories}
        onChange={handleCategoryChange}
        multiple
        className="remove-category-select"
      >
        {associatedCategories.map((category) => (
          <option key={category.category_id} value={category.category_id}>
            {category.category_name}
          </option>
        ))}
      </select>

      <div className="form-actions">
        <button type="submit" className="button-update">Remove</button>
        <button type="button" className="button-cancel" onClick={() => setShowRemoveCategoryForm(false)}>Cancel</button>
      </div>
    </form>
  );
};

export default RemoveCategoryForm;