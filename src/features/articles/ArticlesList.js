// ArticlesList.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchArticles, handleDelete } from './articlesSlice';
import { AddArticleForm } from './AddArticleForm';
import { UpdateArticleForm } from './UpdateArticleForm';
import './ArticlesList.css'; // Import the CSS file

const ArticleExcerpt = ({ article }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const dispatch = useDispatch();

  const handleUpdate = () => {
    setShowEditForm(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this article? This will also remove associated records in the category_article table.')) {
      dispatch(handleDelete(id));
    }
  };

  return (
    <article className="article-excerpt" key={article.article_id}>
      <h2>{article.name}</h2>
      <p><strong>ID:</strong> {article.article_id}</p>
      <p>{article.description}</p>
      <div className="article-images">
        {article.image_1 && <p>{article.image_1}</p>}
        {article.image_2 && <p>{article.image_2}</p>}
      </div>
      <p><strong>Promoted on Homepage:</strong> {article.promotion_at_homepage_level === '1' ? 'Yes' : 'No'}</p>
      <p><strong>Promoted in Department:</strong> {article.promotion_at_department_level === '1' ? 'Yes' : 'No'}</p>

      {showEditForm ? (
        <UpdateArticleForm article={article} setShowEditForm={setShowEditForm} />
      ) : (
        <div className="article-actions">
          <button onClick={handleUpdate} className="button-update">Update</button>
          <button onClick={() => handleDeleteClick(article.article_id)} className="button-delete">Delete</button>
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

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchArticles());
    }
  }, [status, dispatch]);

  let content;

  if (status === 'loading') {
    content = <h1>Loading...</h1>;
  } else if (status === 'succeeded') {
    content = articles.map((article) => (
      <ArticleExcerpt key={article.article_id} article={article} /> // Unique key prop added
    ));
  } else {
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
