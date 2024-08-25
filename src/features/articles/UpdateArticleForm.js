import { useState } from 'react';
import { updateArticle } from './articlesSlice'; // Adjust import based on your file structure
import { useDispatch } from 'react-redux';

export const UpdateArticleForm = ({ article, setShowEditForm }) => {
  const [name, setName] = useState(article.name);
  const [description, setDescription] = useState(article.description);
  const dispatch = useDispatch();

  const canSave = Boolean(name) && Boolean(description);

  const onUpdateArticleClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      dispatch(updateArticle({ id: article.article_id, name, description }));
      console.log(article.article_id, name, description);
      setShowEditForm(false);
    }
  };

  return (
    <form onSubmit={onUpdateArticleClicked}>
      <label htmlFor="articleNameEdit">Name</label>
      <input  
        id="articleNameEdit"
        name="articleNameEdit"
        placeholder="Edit the name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label htmlFor="articleDescriptionEdit">Description</label>
      <textarea  
        id="articleDescriptionEdit"
        name="articleDescriptionEdit"
        placeholder="Edit the description"
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

export default UpdateArticleForm;
