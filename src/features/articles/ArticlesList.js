import React, { useEffect, useState, useRef, useMemo  } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchArticles, handleDelete, cleanupImages } from './articlesSlice';
import { fetchPendingCommentsByArticle } from '../comments/pendingCommentsArticleSlice';
import { PendingCommentsArticleList } from '../comments/PendingCommentsArticleList';
import { AddArticleForm } from './AddArticleForm';
import { UpdateArticleForm } from './UpdateArticleForm';
import RemoveCategoryForm from './RemoveCategoryForm';
import AssignNewCategoryForm from './AssignNewCategoryForm';
import './ArticlesList.css';

const ArticleExcerpt = ({ article }) => {
  const [visibleForm, setVisibleForm] = useState(null);
  const [showComments, setShowComments] = useState(false);
  
  const updateRef = useRef(null);
  const removeCategoryRef = useRef(null);
  const assignCategoryRef = useRef(null);

  const formRefs = useMemo(() => ({
  update: updateRef,
  removeCategory: removeCategoryRef,
  assignCategory: assignCategoryRef
}), []);

  const dispatch = useDispatch();

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      dispatch(handleDelete(id));
    }
  };

  const handleViewCommentsClick = () => {
    if (!showComments) {
      dispatch(fetchPendingCommentsByArticle(article.article_id));
    }
    setShowComments(!showComments);
  };

  useEffect(() => {
    if (visibleForm && formRefs[visibleForm]?.current) {
      formRefs[visibleForm].current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [visibleForm, formRefs]);

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
          <button onClick={handleViewCommentsClick} className="button-comments">
            {showComments ? 'Hide Comments' : 'View Comments'}
          </button>
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

      {showComments && (
        <div style={{ marginTop: '1rem' }}>
          <h4>Pending Comments</h4>
          <PendingCommentsArticleList articleId={article.article_id} />
        </div>
      )}
    </article>
  );
};

export const ArticlesList = () => {
  const dispatch = useDispatch();
  const { articles, status, error } = useSelector(state => state.articles);
  const [showAddArticleForm, setShowAddArticleForm] = useState(false);
  const addArticleFormRef = useRef(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchArticles());
    }
  }, [status, dispatch]);

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
        articles.length > 0
          ? articles.map((article) => (
              <ArticleExcerpt key={article.article_id} article={article} />
            ))
          : <div>No articles available.</div>
      )}
    </article>
  );
};