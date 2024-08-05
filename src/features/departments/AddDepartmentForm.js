import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNewDepartment } from './departmentsSlice';

export const AddDepartmentForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [addRequestStatus, setAddRequestStatus] = useState('idle');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const canSave = Boolean(name) && Boolean(addRequestStatus === 'idle');

  const onSaveDepartmentClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus('pending');
        await dispatch(addNewDepartment({ name, description })).unwrap();
        setName('');
        setDescription('');
        setError(null);
      } catch (err) {
        console.error('Failed to save the department: ', err);
        setError('Error saving the department');
      } finally {
        setAddRequestStatus('idle');
      }
    }
  };

  return (
    <div>
      <h3>Add New Department</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Department Name"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <button onClick={onSaveDepartmentClicked} disabled={!canSave}>
        Save Department
      </button>
      {error && <div>{error}</div>}
    </div>
  );
};