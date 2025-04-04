import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchArticles, handleDelete, cleanupImages } from './articlesSlice';
import { fetchPendingCommentsForArticle } from '../comments/commentsSlice'; // Updated to the new thunk
import { AddArticleForm } from './AddArticleForm';
import { UpdateArticleForm } from './UpdateArticleForm';
import RemoveCategoryForm from './RemoveCategoryForm';
import AssignNewCategoryForm from './AssignNewCategoryForm';
import './ArticlesList.css';

const ArticleExcerpt = ({ article, onViewComments }) => {
  const [visibleForm, setVisibleForm] = useState(null);
  const formRefs = {
    update: useRef(null),
    removeCategory: useRef(null),
    assignCategory: useRef(null)
  };

  const dispatch = useDispatch();

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      dispatch(handleDelete(id));
    }
  };

  useEffect(() => {
    if (visibleForm && formRefs[visibleForm]?.current) {
      formRefs[visibleForm].current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [visibleForm]);

  return (
    <article className="article-excerpt">
      <h2>{article.name}</h2>
      <p><strong>ID:</strong> {article.article_id}</p>
      <p>{article.description}</p>
      <p><strong>Price:</strong> {article.price ? `$${Number(article.price).toFixed(2)}` : 'N/A'}</p>

      <div className="article-images">
        {[article.image_1, article.image_2].map((img, index) => (
          <img
            key={index}
            src={img ? `http://localhost:5000/assets/images/${img}` : '/assets/images/placeholder.jpg'}
            alt={article.name}
          />
        ))}
      </div>

      <p><strong>Promoted:</strong> {article.promotion_at_homepage_level === '1' ? 'Yes' : 'No'}</p>
      <p><strong>In Department:</strong> {article.promotion_at_department_level === '1' ? 'Yes' : 'No'}</p>

      {visibleForm === 'update' ? (
        <div ref={formRefs.update}>
          <UpdateArticleForm article={article} setShowEditForm={() => setVisibleForm(null)} />
        </div>
      ) : (
        <div className="article-actions">
          <button onClick={() => setVisibleForm('update')} className="button-update">Update</button>
          <button onClick={() => handleDeleteClick(article.article_id)} className="button-delete">Delete</button>
          <button onClick={() => setVisibleForm('removeCategory')} className="button-remove">Remove Categories</button>
          <button onClick={() => setVisibleForm('assignCategory')} className="button-assign">Assign Categories</button>
          <button onClick={() => onViewComments(article.article_id)} className="button-comments">View Comments</button>
        </div>
      )}

      {visibleForm === 'removeCategory' && (
        <div ref={formRefs.removeCategory}>
          <RemoveCategoryForm article={article} setShowRemoveCategoryForm={() => setVisibleForm(null)} />
        </div>
      )}
      {visibleForm === 'assignCategory' && (
        <div ref={formRefs.assignCategory}>
          <AssignNewCategoryForm article={article} setShowAssignCategoryForm={() => setVisibleForm(null)} />
        </div>
      )}
    </article>
  );
};

export const ArticlesList = ({ onArticleSelect }) => {
  console.log("ArticlesList rendered")
  const dispatch = useDispatch();
  const { articles, status, error } = useSelector(state => state.articles);
  const [showAddArticleForm, setShowAddArticleForm] = useState(false);
  const addArticleFormRef = useRef(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchArticles());
    }
  }, [status, dispatch]);

  const handleViewComments = (articleId) => {
    console.log("Fetching pending comments for article", articleId);
    dispatch(fetchPendingCommentsForArticle(articleId)); // Dispatch the new thunk to fetch pending comments
  };

  useEffect(() => {
    if (showAddArticleForm) {
      addArticleFormRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showAddArticleForm]);

  const handleCleanup = () => {
    if (window.confirm('Are you sure you want to clean up unused images?')) {
      dispatch(cleanupImages());
    }
  };

  return (
    <article className="articles-list">
      <h1>Articles</h1>
      <button className="button-cleanup" onClick={handleCleanup}>Clean Up Images</button>
      <button
        className={`button-add-article ${showAddArticleForm ? 'button-cancel' : ''}`}
        onClick={() => setShowAddArticleForm(!showAddArticleForm)}
      >
        {showAddArticleForm ? 'Cancel' : 'Add Article'}
      </button>

      {showAddArticleForm && (
        <div ref={addArticleFormRef}>
          <AddArticleForm onCancel={() => setShowAddArticleForm(false)} />
        </div>
      )}

      {status === 'loading' && <h1>Loading...</h1>}
      {status === 'failed' && <div className="error-message">Error: {error}</div>}
      {status === 'succeeded' && (
        articles.length > 0 ? articles.map((article) => (
          <ArticleExcerpt key={article.article_id} article={article} onViewComments={handleViewComments} />
        )) : <div>No articles available.</div>
      )}
    </article>
  );
};