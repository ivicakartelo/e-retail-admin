// Import necessary dependencies
import React, { useEffect, useState } from 'react';
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
  const dispatch = useDispatch();

  // Handle article update
  const handleUpdate = () => setShowEditForm(true);

  // Handle article deletion
  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      dispatch(handleDelete(id));
    }
  };

  // Handle Remove Categories button (opens the form)
  const handleRemoveCategories = () => {
    setShowRemoveCategoryForm(true);
  };

  // Handle Assign New Categories button
  const handleAssignNewCategories = () => setShowAssignCategoryForm(true);

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
        <UpdateArticleForm article={article} setShowEditForm={setShowEditForm} />
      ) : (
        <div className="article-actions">
          <button onClick={handleUpdate} className="button-update">Update</button>
          <button onClick={() => handleDeleteClick(article.article_id)} className="button-delete">Delete</button>
          <button onClick={handleRemoveCategories} className="button-remove">Remove Categories</button>
          <button onClick={handleAssignNewCategories} className="button-assign">Assign New Categories</button>
        </div>
      )}

      {showRemoveCategoryForm && (
        <RemoveCategoryForm
          article={article}
          setShowRemoveCategoryForm={setShowRemoveCategoryForm}
        />
      )}

      {showAssignCategoryForm && (
        <AssignNewCategoryForm
          article={article}
          setShowAssignCategoryForm={setShowAssignCategoryForm}
        />
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

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchArticles());
    }
  }, [status, dispatch]);

  let content;

  // Handle different loading states
  if (status === 'loading') {
    content = <h1>Loading...</h1>;
  } else if (status === 'succeeded') {
    // Ensure that each article has a unique key
    const uniqueArticles = Array.from(new Set(articles.map(article => article.article_id)))
      .map(id => articles.find(article => article.article_id === id));

    content = uniqueArticles.length > 0 ? (
      uniqueArticles.map((article) => (
        <ArticleExcerpt key={`${article.article_id}-${article.name}`} article={article} />
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
      <AddArticleForm />
      {content}
    </section>
  );
};