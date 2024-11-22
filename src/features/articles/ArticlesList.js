import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchArticles, handleDelete } from './articlesSlice';
import { AddArticleForm } from './AddArticleForm';
import { UpdateArticleForm } from './UpdateArticleForm';
import RemoveCategoryForm from './RemoveCategoryForm';
import AssignNewCategoryForm from './AssignNewCategoryForm';
import './ArticlesList.css';

const ArticleExcerpt = ({ article }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showRemoveCategoryForm, setShowRemoveCategoryForm] = useState(false);
  const [showAssignCategoryForm, setShowAssignCategoryForm] = useState(false);

  const updateFormRef = useRef(null);
  const removeCategoryRef = useRef(null);
  const assignCategoryRef = useRef(null);

  const dispatch = useDispatch();

  // Handle Update button click
  const handleUpdate = () => setShowEditForm(true);

  // Handle Delete button click
  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      dispatch(handleDelete(id));
    }
  };

  // Handle form toggles
  const handleToggleForm = (form) => {
    if (form === 'remove') setShowRemoveCategoryForm(true);
    if (form === 'assign') setShowAssignCategoryForm(true);
  };

  const scrollIntoView = (ref) => {
    if (ref.current) ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (showEditForm) scrollIntoView(updateFormRef);
  }, [showEditForm]);

  useEffect(() => {
    if (showRemoveCategoryForm) scrollIntoView(removeCategoryRef);
  }, [showRemoveCategoryForm]);

  useEffect(() => {
    if (showAssignCategoryForm) scrollIntoView(assignCategoryRef);
  }, [showAssignCategoryForm]);

  return (
    <article className="article-excerpt" key={article.article_id}>
      <h2>{article.name}</h2>
      <p><strong>ID:</strong> {article.article_id}</p>
      <p>{article.description}</p>
      
      <div className="article-images">
      <img
        src={
          article.image_1 
            ? `http://localhost:5000/assets/images/${article.image_1}`
            : '/assets/images/placeholder.jpg'  // Fallback image if image_1 is missing
        }
        alt={`${article.name} - image_1`}
      />
      <img
        src={
          article.image_2 
            ? `http://localhost:5000/assets/images/${article.image_2}`
            : '/assets/images/placeholder.jpg'  // Fallback image if image_2 is missing
        }
        alt={`${article.name} - image_2`}
      />
      </div>

      <p><strong>Promoted on Homepage:</strong> {article.promotion_at_homepage_level === '1' ? 'Yes' : 'No'}</p>
      <p><strong>Promoted in Department:</strong> {article.promotion_at_department_level === '1' ? 'Yes' : 'No'}</p>

      {showEditForm ? (
        <div ref={updateFormRef}>
          <UpdateArticleForm article={article} setShowEditForm={setShowEditForm} />
        </div>
      ) : (
        <div className="article-actions">
          <button onClick={handleUpdate} className="button-update">Update</button>
          <button onClick={() => handleDeleteClick(article.article_id)} className="button-delete">Delete</button>
          <button onClick={() => handleToggleForm('remove')} className="button-remove">Remove Categories</button>
          <button onClick={() => handleToggleForm('assign')} className="button-assign">Assign New Categories</button>
        </div>
      )}

      {showRemoveCategoryForm && (
        <div ref={removeCategoryRef}>
          <RemoveCategoryForm article={article} setShowRemoveCategoryForm={setShowRemoveCategoryForm} />
        </div>
      )}

      {showAssignCategoryForm && (
        <div ref={assignCategoryRef}>
          <AssignNewCategoryForm article={article} setShowAssignCategoryForm={setShowAssignCategoryForm} />
        </div>
      )}
    </article>
  );
};

export const ArticlesList = () => {
  const dispatch = useDispatch();
  const articles = useSelector((state) => state.articles.articles);
  const status = useSelector((state) => state.articles.status);
  const error = useSelector((state) => state.articles.error);

  const [showAddArticleForm, setShowAddArticleForm] = useState(false);
  const addArticleFormRef = useRef(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchArticles());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (showAddArticleForm && addArticleFormRef.current) {
      addArticleFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showAddArticleForm]);

  const handleCancel = () => setShowAddArticleForm(false);

  let content;

  // Handle loading states
  if (status === 'loading') {
    content = <h1>Loading...</h1>;
  } else if (status === 'succeeded') {
    content = articles.length > 0 ? (
      articles.map((article) => <ArticleExcerpt key={article.article_id} article={article} />)
    ) : (
      <div>No articles available.</div>
    );
  } else if (status === 'failed') {
    content = <div className="error-message">Error: {error}</div>;
  }

  return (
    <section className="articles-list">
      <h1>Articles</h1>
      <button
        className={`button-add-article ${showAddArticleForm ? 'button-cancel' : ''}`}
        onClick={() => setShowAddArticleForm(!showAddArticleForm)}
      >
        {showAddArticleForm ? 'Cancel' : 'Add Article'}
      </button>

      {showAddArticleForm && (
        <div ref={addArticleFormRef}>
          <AddArticleForm onCancel={handleCancel} />
        </div>
      )}

      {content}
    </section>
  );
};  