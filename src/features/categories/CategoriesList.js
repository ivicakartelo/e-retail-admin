import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories, handleDelete } from './categoriesSlice';
import { AddCategoryForm } from './AddCategoryForm';
import { UpdateCategoryForm } from './UpdateCategoryForm';
import './CategoriesList.css'; // Ensure to include the CSS file

const CategoryExcerpt = ({ category }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [updateId, setUpdateId] = useState('');
  const updateFormRef = useRef(null); // Ref for smooth scrolling to the update form
  const dispatch = useDispatch();

  // Handle updating category
  const handleUpdate = (id) => {
    setUpdateId(id);
    setShowEditForm(true);
  };

  // Handle deletion of a category
  const onDeleteClick = (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this category? This will also remove all associated records in the category_article table.'
    );
    if (confirmDelete) {
      dispatch(handleDelete(id));
    }
  };

  // Scroll to the update form when it is shown
  useEffect(() => {
    if (showEditForm && updateFormRef.current) {
      updateFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showEditForm]);

  return (
    <article className="category-card">
      <h3>{category.name}</h3>
      <p>{category.description}</p>

      {showEditForm && updateId === category.category_id ? (
        <div ref={updateFormRef}>
          <UpdateCategoryForm
            category={category}
            setShowEditForm={setShowEditForm}
          />
        </div>
      ) : (
        <div className="category-actions">
          <button className="button-update" onClick={() => handleUpdate(category.category_id)}>
            Update
          </button>
          <button className="button-delete" onClick={() => onDeleteClick(category.category_id)}>
            Delete
          </button>
        </div>
      )}
    </article>
  );
};

export const CategoriesList = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories);
  const status = useSelector((state) => state.categories.status);
  const error = useSelector((state) => state.categories.error);

  // State for showing/hiding the AddCategoryForm
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const addCategoryFormRef = useRef(null); // Ref for scrolling to AddCategoryForm

  // Fetch categories when status is idle
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  // Scroll to AddCategoryForm when shown
  useEffect(() => {
    if (showAddCategoryForm && addCategoryFormRef.current) {
      addCategoryFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showAddCategoryForm]);

  // Handle cancel for the AddCategoryForm
  const handleCancel = () => {
    setShowAddCategoryForm(false); // Hide the form
  };

  let content;

  // Determine what content to display based on status
  if (status === 'loading') {
    content = <h1 className="loading-message">Loading categories...</h1>;
  } else if (status === 'succeeded') {
    content = categories.map((category) => (
      <CategoryExcerpt key={category.category_id} category={category} />
    ));
  } else if (status === 'failed') {
    content = <div className="error-message">Error: {error}</div>;
  }

  return (
    <section className="categories-list-container">
      <h2>Categories</h2>

      {/* Button to toggle AddCategoryForm */}
      <button
        className="button-add-category"
        onClick={() => setShowAddCategoryForm(!showAddCategoryForm)}
      >
        {showAddCategoryForm ? 'Cancel' : 'Add Category'}
      </button>

      {/* Conditionally show AddCategoryForm */}
      {showAddCategoryForm && (
        <div ref={addCategoryFormRef}>
          <AddCategoryForm onCancel={handleCancel} /> {/* Pass onCancel to AddCategoryForm */}
        </div>
      )}

      <div className="categories-list">{content}</div>
    </section>
  );
};