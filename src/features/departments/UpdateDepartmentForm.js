import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateDepartment } from './departmentsSlice';
import './UpdateDepartmentForm.css';

export const UpdateDepartmentForm = ({ department, setShowEditForm }) => {
  const [name, setName] = useState(department.name);
  const [description, setDescription] = useState(department.description);
  const dispatch = useDispatch();

  const canSave = Boolean(name) && Boolean(description);

  const onUpdateDepartmentClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await dispatch(updateDepartment({ id: department.department_id, name, description }));
      setShowEditForm(false);
    }
  };

  return (
    <div className="update-form-container">
      <h3>Edit Department</h3>
      <form onSubmit={onUpdateDepartmentClicked} className="update-form">
        <div className="form-group">
          <label htmlFor="departmentNameEdit">Name</label>
          <input
            type="text"
            id="departmentNameEdit"
            name="departmentNameEdit"
            placeholder="Edit department name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label htmlFor="departmentDescriptionEdit">Description</label>
          <textarea
            id="departmentDescriptionEdit"
            name="departmentDescriptionEdit"
            placeholder="Edit department description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea-field"
          />
        </div>
        <div className="form-buttons">
          <button type="submit" disabled={!canSave} className={canSave ? 'button-save' : 'button-disabled'}>
            Update
          </button>
          <button type="button" onClick={() => setShowEditForm(false)} className="button-cancel">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateDepartmentForm;
