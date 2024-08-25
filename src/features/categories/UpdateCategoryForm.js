import { useState } from 'react';
import { updateCategory } from './categoriesSlice';
import { useDispatch } from 'react-redux';

export const UpdateCategoryForm = ({ category, setShowEditForm }) => {
  // Initialize state for all fields
  const [departmentId, setDepartmentId] = useState(category.department_id);
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description);
  const dispatch = useDispatch();

  // Determine if the form can be submitted
  const canSave = Boolean(departmentId) && Boolean(name) && Boolean(description);

  // Handle form submission
  const onUpdateCategoryClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      // Dispatch update action with all fields
      dispatch(updateCategory({
        id: category.category_id,
        department_id: departmentId,
        name: name,
        description: description,
      }));
      setShowEditForm(false);
    }
    console.log("The UpdateCategoryForm.js rendered");
  };

  return (
    <form onSubmit={onUpdateCategoryClicked}>
      <label htmlFor="categoryDepartmentIdEdit">Department ID</label>
      <input
        id="categoryDepartmentIdEdit"
        name="categoryDepartmentIdEdit"
        type="number"
        placeholder="Edit department ID"
        value={departmentId}
        onChange={(e) => setDepartmentId(e.target.value)}
      />

      <label htmlFor="categoryNameEdit">Name</label>
      <input
        id="categoryNameEdit"
        name="categoryNameEdit"
        placeholder="Edit category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label htmlFor="categoryDescriptionEdit">Description</label>
      <textarea
        id="categoryDescriptionEdit"
        name="categoryDescriptionEdit"
        placeholder="Edit category description"
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

export default UpdateCategoryForm;
