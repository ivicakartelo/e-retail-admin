import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateArticle } from './articlesSlice';
import { fetchCategories } from '../categories/categoriesSlice';
import './UpdateArticleForm.css';

export const UpdateArticleForm = ({ articleId, setShowEditForm }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image_1, setImage1] = useState('');
  const [image_2, setImage2] = useState('');
  const [promotionAtHomepageLevel, setPromotionAtHomepageLevel] = useState(0);
  const [promotionAtDepartmentLevel, setPromotionAtDepartmentLevel] = useState(0);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]); // Category IDs

  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories); // Fetch categories from Redux store
  const categoryStatus = useSelector((state) => state.categories.status);

  // Fetch article by ID when the form loads
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`http://localhost:5000/articles/${articleId}`);
        const data = await response.json();
        setName(data.name);
        setDescription(data.description);
        setImage1(data.image_1);
        setImage2(data.image_2);
        setPromotionAtHomepageLevel(data.promotion_at_homepage_level);
        setPromotionAtDepartmentLevel(data.promotion_at_department_level);
        setSelectedCategoryIds(data.category_ids); // Set preselected categories
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    };

    fetchArticle();
  }, [articleId]);

  // Fetch categories when form loads
  useEffect(() => {
    if (categoryStatus === 'idle') {
      dispatch(fetchCategories());
    }
  }, [categoryStatus, dispatch]);

  const canSave = Boolean(name) && Boolean(description) && selectedCategoryIds.length > 0;

  const onUpdateArticleClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      dispatch(updateArticle({
        id: articleId,
        name,
        description,
        image_1,
        image_2,
        promotion_at_homepage_level: promotionAtHomepageLevel,
        promotion_at_department_level: promotionAtDepartmentLevel,
        category_ids: selectedCategoryIds, // Send updated category IDs
      }));
      setShowEditForm(false); // Hide the edit form after updating
    }
  };

  // Handle multiple category selection
  const handleCategoryChange = (e) => {
    const options = e.target.options;
    const selectedIds = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedIds.push(options[i].value);
      }
    }
    setSelectedCategoryIds(selectedIds);
  };

  return (
    <form className="update-article-form" onSubmit={onUpdateArticleClicked}>
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

      {/* Category multiple selection dropdown */}
      <label htmlFor="categorySelectEdit">Select Categories</label>
      <select
        id="categorySelectEdit"
        value={selectedCategoryIds}
        onChange={handleCategoryChange}
        className="form-select"
        multiple
        required
      >
        {categories.map((category) => (
          <option key={category.category_id} value={category.category_id}>
            {category.name}
          </option>
        ))}
      </select>

      <button type="submit" className="button-update" disabled={!canSave}>
        Update
      </button>
      <button type="button" className="button-cancel" onClick={() => setShowEditForm(false)}>
        Cancel
      </button>
    </form>
  );
};

export default UpdateArticleForm;