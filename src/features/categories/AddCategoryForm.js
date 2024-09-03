import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNewCategory } from './categoriesSlice';
import './AddCategoryForm.css'; // Make sure to include the CSS file

export const AddCategoryForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [departmentId, setDepartmentId] = useState('');  // State for department_id
  const [addRequestStatus, setAddRequestStatus] = useState('idle');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const canSave = Boolean(name) && Boolean(description) && Boolean(departmentId) && addRequestStatus === 'idle';

  const onSaveCategoryClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus('pending');
        await dispatch(addNewCategory({ name, description, department_id: departmentId })).unwrap();
        setName('');
        setDescription('');
        setDepartmentId('');  // Clear the department_id field
        setError(null);
      } catch (err) {
        console.error('Failed to save the category: ', err);
        setError('Error saving the category');
      } finally {
        setAddRequestStatus('idle');
      }
    }
  };

  return (
    <div className="add-category-form">
      <h3>Add New Category</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category Name"
        className="form-input"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="form-textarea"
      />
      <input
        type="text"
        value={departmentId}  // Input field for department_id
        onChange={(e) => setDepartmentId(e.target.value)}
        placeholder="Department ID"
        className="form-input"
      />
      <button onClick={onSaveCategoryClicked} disabled={!canSave} className="submit-button">
        Save Category
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};