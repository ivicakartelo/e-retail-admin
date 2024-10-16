import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateArticle } from './articlesSlice'; // Ensure the path is correct
import { fetchCategories } from '../categories/categoriesSlice'; // Fetch categories action
import './AssignNewCategoryForm.css'; // Optional CSS import

const AssignNewCategoryForm = ({ articleId, setShowAssignCategoryForm }) => {
  const [selectedNewCategories, setSelectedNewCategories] = useState([]);
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories); // Get all categories from the Redux store
  const categoryStatus = useSelector((state) => state.categories.status); // Fetching status for categories
  const [articleCategories, setArticleCategories] = useState([]); // Store associated categories

  // Fetch all categories and article categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      // Fetch categories when the component loads
      if (categoryStatus === 'idle') {
        await dispatch(fetchCategories());
      }

      // Fetch article details to get associated categories
      try {
        const response = await fetch(`/articles/${articleId}`);
        const data = await response.json();
        setArticleCategories(data.category_ids); // Set the associated categories for the article

        // **Log associated categories to check**
        console.log('Associated Categories (from article):', data.category_ids);

      } catch (err) {
        console.error('Failed to fetch article details: ', err);
      }
    };

    fetchData();
  }, [categoryStatus, dispatch, articleId]);

  // **Log all available categories to check**
  console.log('All Categories (from Redux):', categories);

  // Filter out categories that are already associated with the article
  const filteredCategories = categories.filter(
    (category) => !articleCategories.includes(Number(category.category_id)) // Ensure both are numbers
  );

  // **Log the filtered categories to verify the logic**
  console.log('Filtered Categories (for dropdown):', filteredCategories);

  // Handle form submission for assigning new categories
  const handleAssignCategories = async (e) => {
    e.preventDefault();

    if (selectedNewCategories.length === 0) {
      alert('Please select at least one category to assign.');
      return;
    }

    try {
      const updatedCategories = [...new Set([...articleCategories, ...selectedNewCategories])]; // Combine and remove duplicates

      await dispatch(
        updateArticle({
          id: articleId,
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
    const selectedIds = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
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
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.name}
            </option>
          ))
        ) : (
          <option disabled>No new categories available</option>
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