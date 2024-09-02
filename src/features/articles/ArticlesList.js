import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchArticles, handleDelete } from './articlesSlice';
import { AddArticleForm } from './AddArticleForm';
import { UpdateArticleForm } from './UpdateArticleForm';

// ArticleExcerpt Component
const ArticleExcerpt = ({ article }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [updateId, setUpdateId] = useState('');
  const dispatch = useDispatch();

  const handleUpdate = (id) => {
    setUpdateId(id);
    setShowEditForm(true);
  };

  return (
    <article key={article.article_id}>
      <h1>{article.article_id}</h1>
      <h3>{article.name}</h3>
      <p>{article.description}</p>
      <img src={article.image_1} alt={`${article.name} image`} />
      <img src={article.image_2} alt={`${article.name} image`} />
      <p>Promoted on Homepage: {article.promotion_at_homepage_level === '1' ? 'Yes' : 'No'}</p>
      <p>Promoted in Department: {article.promotion_at_department_level === '1' ? 'Yes' : 'No'}</p>

      {showEditForm && updateId === article.article_id ? (
        <UpdateArticleForm article={article} setShowEditForm={setShowEditForm} />
      ) : (
        <button onClick={() => handleUpdate(article.article_id)}>Update</button>
      )}
      <button onClick={() => dispatch(handleDelete(article.article_id))}>Delete</button>
    </article>
  );
};

// ArticlesList Component
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
      <ArticleExcerpt key={article.article_id} article={article} />
    ));
  } else {
    content = <div>Error: {error}</div>;
  }

  return (
    <section>
      <h2>Articles</h2>
      <AddArticleForm />
      {content}
    </section>
  );
};