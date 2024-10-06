import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories, handleDelete } from './categoriesSlice';
import { AddCategoryForm } from './AddCategoryForm';
import { UpdateCategoryForm } from './UpdateCategoryForm';
import './CategoriesList.css'; // Make sure to include the CSS file

const CategoryExcerpt = ({ category }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [updateId, setUpdateId] = useState('');
  const dispatch = useDispatch();

  const handleUpdate = (id) => {
    setUpdateId(id);
    setShowEditForm(true);
  };

  const onDeleteClick = (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this category? This will also remove all associated records in the category_article table.'
    );
    if (confirmDelete) {
      dispatch(handleDelete(id));
    }
  };
  

  return (
    <article className="category-card">
      <h3>{category.name}</h3>
      <p>{category.description}</p>

      {showEditForm && updateId === category.category_id ? (
        <UpdateCategoryForm
          category={category}
          setShowEditForm={setShowEditForm}
        />
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

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  let content;

  if (status === 'loading') {
    content = <h1 className="loading-message">Loading categories...</h1>;
  } else if (status === 'succeeded') {
    content = categories.map(category => <CategoryExcerpt key={category.category_id} category={category} />);
  } else if (status === 'failed') {
    content = <div className="error-message">Error: {error}</div>;
  }

  return (
    <section className="categories-list-container">
      <h2>Categories</h2>
      <AddCategoryForm />
      <div className="categories-list">{content}</div>
    </section>
  );
};