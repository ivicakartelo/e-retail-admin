import { useState } from 'react';
import { updateDepartment } from './departmentsSlice';
import { useDispatch } from 'react-redux';

export const UpdateDepartmentForm = ({ department, setShowEditForm }) => {
  const [name, setName] = useState(department.name)
  const [description, setDescription] = useState(department.description)
  const dispatch = useDispatch()

  const canSave = Boolean(name) && Boolean(description);

  const onUpdateDepartmentClicked = async (e) => {
    e.preventDefault()
    if (canSave) {
        dispatch(updateDepartment({ id: department.department_id, name: name, description: description }))
        console.log(department.department_id, name, description)
        setShowEditForm(false)
    }
  }
  return (
    <form onSubmit={onUpdateDepartmentClicked}>
      <label htmlFor="departmentNameEdit">Name</label>
      <input  
        id="departmentNameEdit"
        name="departmentNameEdit"
        placeholder="Edit your name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} />

      <label htmlFor="departmentDescriptionEdit">Content</label>
      <textarea  
      id="departmentDescriptionEdit"
      name="departmentDescriptionEdit"
        placeholder="Edit your description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button type="submit" disabled={!canSave}>
        Update
      </button>
      <button type="button" onClick={() => setShowEditForm(false)}>
        Cancel
      </button>
    </form>
  );
};

export default UpdateDepartmentForm