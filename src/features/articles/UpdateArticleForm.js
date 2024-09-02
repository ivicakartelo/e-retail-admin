import { useState } from 'react';
import { updateArticle } from './articlesSlice';
import { useDispatch } from 'react-redux';

export const UpdateArticleForm = ({ article, setShowEditForm }) => {
  const [name, setName] = useState(article.name);
  const [description, setDescription] = useState(article.description);
  const [image_1, setImage1] = useState(article.image_1);
  const [image_2, setImage2] = useState(article.image_2);
  const [promotionAtHomepageLevel, setPromotionAtHomepageLevel] = useState(article.promotion_at_homepage_level);
  const [promotionAtDepartmentLevel, setPromotionAtDepartmentLevel] = useState(article.promotion_at_department_level);
  
  const dispatch = useDispatch();

  const canSave = Boolean(name) && Boolean(description);

  const onUpdateArticleClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      dispatch(updateArticle({
        id: article.article_id,
        name,
        description,
        image_1,
        image_2,
        promotion_at_homepage_level: promotionAtHomepageLevel,
        promotion_at_department_level: promotionAtDepartmentLevel
      }));
      setShowEditForm(false);
    }
  };

  return (
    <form onSubmit={onUpdateArticleClicked}>
      <label htmlFor="articleNameEdit">Name</label>
      <input  
        id="articleNameEdit"
        name="articleNameEdit"
        placeholder="Edit article name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />

      <label htmlFor="articleDescriptionEdit">Description</label>
      <textarea  
        id="articleDescriptionEdit"
        name="articleDescriptionEdit"
        placeholder="Edit article description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label htmlFor="articleImage1Edit">Image 1</label>
      <input  
        id="articleImage1Edit"
        name="articleImage1Edit"
        placeholder="Edit image 1 URL" 
        value={image_1} 
        onChange={(e) => setImage1(e.target.value)} 
      />

      <label htmlFor="articleImage2Edit">Image 2</label>
      <input  
        id="articleImage2Edit"
        name="articleImage2Edit"
        placeholder="Edit image 2 URL" 
        value={image_2} 
        onChange={(e) => setImage2(e.target.value)} 
      />

      <label htmlFor="promotionAtHomepageLevelEdit">Promotion at Homepage Level</label>
      <select
        id="promotionAtHomepageLevelEdit"
        name="promotionAtHomepageLevelEdit"
        value={promotionAtHomepageLevel}
        onChange={(e) => setPromotionAtHomepageLevel(e.target.value)}
      >
        <option value="1">Yes</option>
        <option value="0">No</option>
      </select>

      <label htmlFor="promotionAtDepartmentLevelEdit">Promotion at Department Level</label>
      <select
        id="promotionAtDepartmentLevelEdit"
        name="promotionAtDepartmentLevelEdit"
        value={promotionAtDepartmentLevel}
        onChange={(e) => setPromotionAtDepartmentLevel(e.target.value)}
      >
        <option value="1">Yes</option>
        <option value="0">No</option>
      </select>

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
