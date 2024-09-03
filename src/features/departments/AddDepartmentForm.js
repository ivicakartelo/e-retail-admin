import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNewDepartment } from './departmentsSlice';
import './AddDepartmentForm.css';

export const AddDepartmentForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [addRequestStatus, setAddRequestStatus] = useState('idle');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const canSave = Boolean(name) && Boolean(description) && addRequestStatus === 'idle';

  const onSaveDepartmentClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus('pending');
        setError(null);
        await dispatch(addNewDepartment({ name, description })).unwrap();
        setName('');
        setDescription('');
      } catch (err) {
        console.error('Failed to save the department: ', err);
        setError('Failed to save the department. Please try again.');
      } finally {
        setAddRequestStatus('idle');
      }
    }
  };

  return (
    <div className="form-container">
      <h3>Add New Department</h3>
      <form>
        <div className="form-group">
          <label htmlFor="departmentName">Department Name</label>
          <input
            type="text"
            id="departmentName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter department name"
            className={error ? 'input-error' : ''}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter department description"
            className={error ? 'input-error' : ''}
          />
        </div>
        <button
          type="button"
          onClick={onSaveDepartmentClicked}
          disabled={!canSave}
          className={canSave ? 'button-save' : 'button-disabled'}
        >
          {addRequestStatus === 'pending' ? 'Saving...' : 'Save Department'}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};
