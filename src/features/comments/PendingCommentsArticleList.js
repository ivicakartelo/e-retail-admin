// PendingCommentsArticleList.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { fetchPendingCommentsByArticle } from './pendingCommentsArticleSlice';
import { selectArticleComments } from './pendingCommentsArticleSlice';
import './CommentsList.css';

const CommentExcerpt = ({ comment, handleApprove, handleDelete }) => {
  return (
    <div className="comment-card">
      <div className="comment-header">
        <span className="comment-author">{comment.user_name}</span>
        <span className="comment-article">on <strong>{comment.article_name}</strong></span>
      </div>
      <p className="comment-text">{comment.comment_text}</p>
      <div className="comment-footer">
        <span className="comment-date">
          {new Date(comment.created_at).toLocaleString()}
        </span>
        <div className="comment-actions">
          <button className="approve-btn" onClick={() => handleApprove(comment)}>
            ✅ Approve
          </button>
          <button className="delete-btn" onClick={() => handleDelete(comment)}>
            ❌ Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export const PendingCommentsArticleList = ({ articleId }) => {
  const dispatch = useDispatch();

  // Use the memoized selector to get the pending comments for the current article
  const comments = useSelector(selectArticleComments(articleId));
  const status = useSelector((state) => state.pendingCommentsArticle.statusByArticleId[articleId] || 'idle');
  const error = useSelector((state) => state.pendingCommentsArticle.errorByArticleId[articleId]);

  useEffect(() => {
    if (articleId) {
      dispatch(fetchPendingCommentsByArticle(articleId));
    }
  }, [dispatch, articleId]);

  const refreshComments = () => {
    dispatch(fetchPendingCommentsByArticle(articleId));
  };

  const handleApprove = async (comment) => {
    try {
      await axios.patch(
        `http://localhost:5000/articles/${comment.article_id}/comments/${comment.comment_id}/approve`,
        { approved: true }
      );
      refreshComments();
    } catch (err) {
      console.error('Approve failed:', err);
    }
  };

  const handleDelete = async (comment) => {
    try {
      await axios.delete(
        `http://localhost:5000/articles/${comment.article_id}/comments/${comment.comment_id}`
      );
      refreshComments();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // Handle loading, error, and empty state
  if (status === 'loading') return <div>Loading comments...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;
  if (!comments.length) return <div>No pending comments for this article.</div>;

  return (
    <div className="comments-container">
      <h3>Pending Comments for Article #{articleId}</h3>
      {comments.map((comment) => (
        <CommentExcerpt
          key={comment.comment_id}
          comment={comment}
          handleApprove={handleApprove}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  );
};