import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCategory } from './categoriesSlice';
import './UpdateCategoryForm.css'; // Import CSS for styling

export const UpdateCategoryForm = ({ category, setShowEditForm }) => {
  // Initialize state for all fields
  const [departmentId, setDepartmentId] = useState(category.department_id);
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  // Determine if the form can be submitted
  const canSave = Boolean(departmentId) && Boolean(name) && Boolean(description);

  // Handle form submission
  const onUpdateCategoryClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      try {
        await dispatch(updateCategory({
          id: category.category_id,
          department_id: departmentId,
          name: name,
          description: description,
        })).unwrap();
        setShowEditForm(false);
      } catch (err) {
        setError('Error updating category');
      }
    } else {
      setError('Please fill out all fields');
    }
  };

  return (
    <form className="update-category-form" onSubmit={onUpdateCategoryClicked}>
      <h3>Update Category</h3>

      {error && <div className="form-error">{error}</div>}

      <label htmlFor="categoryDepartmentIdEdit">Department ID</label>
      <input
        id="categoryDepartmentIdEdit"
        name="categoryDepartmentIdEdit"
        type="number"
        placeholder="Edit department ID"
        value={departmentId}
        onChange={(e) => setDepartmentId(e.target.value)}
        required
      />

      <label htmlFor="categoryNameEdit">Name</label>
      <input
        id="categoryNameEdit"
        name="categoryNameEdit"
        placeholder="Edit category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label htmlFor="categoryDescriptionEdit">Description</label>
      <textarea
        id="categoryDescriptionEdit"
        name="categoryDescriptionEdit"
        placeholder="Edit category description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <div className="form-actions">
        <button type="submit" className="button-update" disabled={!canSave}>
          Update
        </button>
        <button type="button" className="button-cancel" onClick={() => setShowEditForm(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UpdateCategoryForm;