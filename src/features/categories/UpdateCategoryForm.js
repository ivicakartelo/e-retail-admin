import { useState } from 'react';
import { updateCategory } from './categoriesSlice';
import { useDispatch } from 'react-redux';

export const UpdateCategoryForm = ({ category, setShowEditForm }) => {
  const [name, setName] = useState(category.name);
  const dispatch = useDispatch();

  const canSave = Boolean(name);

  const onUpdateCategoryClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      dispatch(updateCategory({ id: category.category_id, name: name }));
      setShowEditForm(false);
    }
    console.log("The UpdateCategoryForm.js rendered");
  };

  return (
    <form onSubmit={onUpdateCategoryClicked}>
      <label htmlFor="categoryNameEdit">Name</label>
      <input
        id="categoryNameEdit"
        name="categoryNameEdit"
        placeholder="Edit category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
