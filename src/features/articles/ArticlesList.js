// Import necessary dependencies
import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchArticles, handleDelete } from './articlesSlice';
import { AddArticleForm } from './AddArticleForm';
import { UpdateArticleForm } from './UpdateArticleForm';
import RemoveCategoryForm from './RemoveCategoryForm'; // Assuming this component exists
import AssignNewCategoryForm from './AssignNewCategoryForm'; // Assuming this component exists
import './ArticlesList.css'; // Import the CSS file

// ArticleExcerpt component
const ArticleExcerpt = ({ article }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showRemoveCategoryForm, setShowRemoveCategoryForm] = useState(false);
  const [showAssignCategoryForm, setShowAssignCategoryForm] = useState(false);

  const updateFormRef = useRef(null); // Ref for Update form
  const removeCategoryRef = useRef(null); // Ref for Remove Category form
  const assignCategoryRef = useRef(null); // Ref for Assign Category form

  const dispatch = useDispatch();

  // Handle article update
  const handleUpdate = () => {
    setShowEditForm(true);
  };

  // Handle article deletion
  const handleDeleteClick = (id) => {
    const userConfirmed = window.confirm('Are you sure you want to delete this article?');
    if (userConfirmed) {
      dispatch(handleDelete(id));
    }
  };

  // Handle Remove Categories button
  const handleRemoveCategories = () => {
    setShowRemoveCategoryForm(true);
  };

  // Handle Assign New Categories button
  const handleAssignNewCategories = () => {
    setShowAssignCategoryForm(true);
  };

  // Scroll into view when the update form is shown
  useEffect(() => {
    if (showEditForm && updateFormRef.current) {
      updateFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showEditForm]);

  // Scroll into view when the remove category form is shown
  useEffect(() => {
    if (showRemoveCategoryForm && removeCategoryRef.current) {
      removeCategoryRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showRemoveCategoryForm]);

  // Scroll into view when the assign category form is shown
  useEffect(() => {
    if (showAssignCategoryForm && assignCategoryRef.current) {
      assignCategoryRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showAssignCategoryForm]);

  return (
    <article className="article-excerpt" key={article.article_id}>
      <h2>{article.name}</h2>
      <p><strong>ID:</strong> {article.article_id}</p>
      <p>{article.description}</p>
      <div className="article-images">
        {article.image_1 && <img src={article.image_1} alt={article.name} />}
        {article.image_2 && <img src={article.image_2} alt={article.name} />}
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
          <button onClick={handleRemoveCategories} className="button-remove">Remove Categories</button>
          <button onClick={handleAssignNewCategories} className="button-assign">Assign New Categories</button>
        </div>
      )}

      {showRemoveCategoryForm && (
        <div ref={removeCategoryRef}>
          <RemoveCategoryForm
            article={article}
            setShowRemoveCategoryForm={setShowRemoveCategoryForm}
          />
        </div>
      )}

      {showAssignCategoryForm && (
        <div ref={assignCategoryRef}>
          <AssignNewCategoryForm
            article={article}
            setShowAssignCategoryForm={setShowAssignCategoryForm}
          />
        </div>
      )}
    </article>
  );
};

// ArticlesList component
export const ArticlesList = () => {
  const dispatch = useDispatch();
  const articles = useSelector((state) => state.articles.articles);
  const status = useSelector((state) => state.articles.status);
  const error = useSelector((state) => state.articles.error);

  // State for showing/hiding the AddArticleForm
  const [showAddArticleForm, setShowAddArticleForm] = useState(false);
  const addArticleFormRef = useRef(null); // Ref for Add Article form

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchArticles());
    }
  }, [status, dispatch]);

  // Scroll to AddArticleForm when shown
  useEffect(() => {
    if (showAddArticleForm && addArticleFormRef.current) {
      addArticleFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showAddArticleForm]);

  let content;

  // Handle different loading states
  if (status === 'loading') {
    content = <h1>Loading...</h1>;
  } else if (status === 'succeeded') {
    // Ensure that each article has a unique key
    const uniqueArticles = Array.from(new Set(articles.map((article) => article.article_id)))
      .map((id) => articles.find((article) => article.article_id === id));

    content = uniqueArticles.length > 0 ? (
      uniqueArticles.map((article) => (
        <ArticleExcerpt key={article.article_id} article={article} />
      ))
    ) : (
      <div>No articles available.</div>
    );
  } else if (status === 'failed') {
    content = <div className="error-message">Error: {error}</div>;
  }

  return (
    <section className="articles-list">
      <h1>Articles</h1>

      {/* Button to toggle AddArticleForm */}
      <button
        className="button-add-article"
        onClick={() => setShowAddArticleForm(!showAddArticleForm)}
      >
        {showAddArticleForm ? 'Cancel' : 'Add Article'}
      </button>

      {/* Conditionally show AddArticleForm */}
      {showAddArticleForm && (
        <div ref={addArticleFormRef}>
          <AddArticleForm />
        </div>
      )}

      {content}
    </section>
  );
};