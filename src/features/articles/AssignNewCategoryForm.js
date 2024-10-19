import React, { useEffect, useState } from 'react';

const AssignNewCategoryForm = ({ article, setShowAssignCategoryForm }) => {
  const [noAssociateCategories, setNoAssociateCategories] = useState([]); // Categories not yet associated with the article
  const [selectedCategories, setSelectedCategories] = useState([]); // Categories selected for assignment

  // Fetch non-associated categories when the component loads
  useEffect(() => {
    const fetchNoAssociateCategories = async () => {
      try {
        const response = await fetch(`http://localhost:5000/articles/${article.article_id}/no-associate-categories`);
        if (!response.ok) {
          throw new Error('Failed to fetch non-associated categories');
        }
        const data = await response.json();
        setNoAssociateCategories(data.categories); // Assuming 'categories' is the array in the API response
      } catch (error) {
        console.error('Error fetching non-associated categories:', error);
      }
    };

    fetchNoAssociateCategories();
  }, [article.article_id]);

  // Handle form submission for assigning new categories
  const handleAssignCategories = async (e) => {
    e.preventDefault();

    if (selectedCategories.length === 0) {
      alert('Please select at least one category to assign.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/articles/${article.article_id}/assign-categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category_ids: selectedCategories }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign categories');
      }

      // Alert the user that categories were assigned successfully
      window.alert('Selected categories have been assigned successfully.');
      setShowAssignCategoryForm(false); // Close the form on success
    } catch (error) {
      console.error('Error assigning categories:', error);
      window.alert('There was an error assigning the categories.');
    }
  };

  // Handle category selection for assignment
  const handleCategoryChange = (e) => {
    const options = e.target.options;
    const selectedIds = Array.from(options)
      .filter(option => option.selected)
      .map(option => Number(option.value)); // Ensure that the IDs are numbers
    setSelectedCategories(selectedIds);
  };

  return (
    <form className="assign-category-form" onSubmit={handleAssignCategories}>
      <h3>Assign New Categories</h3>

      <label htmlFor="assignCategoriesSelect">Select Categories to Assign:</label>
      <select
        id="assignCategoriesSelect"
        value={selectedCategories}
        onChange={handleCategoryChange}
        multiple
        required
      >
        {noAssociateCategories.length > 0 ? (
          noAssociateCategories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.category_name}
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