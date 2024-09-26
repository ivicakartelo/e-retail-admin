// src/features/categories/AddCategoryForm.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewCategory } from './categoriesSlice';
import { fetchDepartments } from '../departments/departmentsSlice'; // To get departments
import './AddCategoryForm.css';

export const AddCategoryForm = ({ departmentId }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(departmentId || ''); // Default to departmentId prop
  const [addRequestStatus, setAddRequestStatus] = useState('idle');
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const departments = useSelector((state) => state.departments.departments);
  const departmentStatus = useSelector((state) => state.departments.status);

  useEffect(() => {
    if (departmentStatus === 'idle') {
      dispatch(fetchDepartments());
    }
  }, [departmentStatus, dispatch]);

  const canSave = Boolean(name) && Boolean(description) && Boolean(selectedDepartmentId) && addRequestStatus === 'idle';

  const onSaveCategoryClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus('pending');
        await dispatch(addNewCategory({ name, description, department_id: selectedDepartmentId })).unwrap();
        setName('');
        setDescription('');
        setSelectedDepartmentId(''); // Clear the selected department
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

      {/* Dropdown for selecting department */}
      <select
        value={selectedDepartmentId}
        onChange={(e) => setSelectedDepartmentId(e.target.value)}
        className="form-select"
      >
        <option value="">Select Department</option>
        {departments.map((department) => (
          <option key={department.department_id} value={department.department_id}>
            {department.name}
          </option>
        ))}
      </select>

      <button onClick={onSaveCategoryClicked} disabled={!canSave} className="submit-button">
        Save Category
      </button>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};