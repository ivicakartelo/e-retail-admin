import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewCategory } from './categoriesSlice';
import { fetchDepartments } from '../departments/departmentsSlice'; // To get departments
import './AddCategoryForm.css';

export const AddCategoryForm = ({ departmentId, onCancel = () => {} }) => {
  // State for form inputs and request status
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(departmentId || '');
  const [addRequestStatus, setAddRequestStatus] = useState('idle');
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const departments = useSelector((state) => state.departments.departments);
  const departmentStatus = useSelector((state) => state.departments.status);

  // Fetch departments if status is idle
  useEffect(() => {
    if (departmentStatus === 'idle') {
      dispatch(fetchDepartments());
    }
  }, [departmentStatus, dispatch]);

  // Check if the form can be saved
  const canSave = Boolean(name) && Boolean(description) && Boolean(selectedDepartmentId) && addRequestStatus === 'idle';

  // Handle category save
  const onSaveCategoryClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus('pending');
        await dispatch(addNewCategory({ name, description, department_id: selectedDepartmentId })).unwrap();
        resetForm();
      } catch (err) {
        console.error('Failed to save the category: ', err);
        setError('Error saving the category');
      } finally {
        setAddRequestStatus('idle');
      }
    }
  };

  // Reset form fields
  const resetForm = () => {
    setName('');
    setDescription('');
    setSelectedDepartmentId(departmentId || ''); // Reset to the original departmentId if available
    setError(null);
  };

  // Handle cancel button click
  const handleCancel = () => {
    resetForm(); // Reset form fields
    onCancel();   // Call onCancel function
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

      <div className="button-group">
        <button onClick={onSaveCategoryClicked} disabled={!canSave} className="submit-button">
          Save Category
        </button>
        <button 
          onClick={handleCancel} 
          className="cancel-button"
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'} // Hover effect
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'} // Reset background
        >
          Cancel
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};