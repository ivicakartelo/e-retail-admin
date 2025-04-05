import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchPendingComments,
  fetchPendingCommentsForArticle,
  approveComment,
  deleteComment,
} from './commentsSlice';
import './CommentsList.css';

const CommentExcerpt = ({ comment, handleApprove, handleDelete }) => {
  return (
    <div className={`comment-card ${!comment.is_approved ? 'pending' : ''}`}>
      <div className="comment-header">
        <span className="comment-author">User #{comment.user_id}</span>
        {comment.rating && (
          <span className="comment-rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < comment.rating ? 'star-filled' : 'star-empty'}>★</span>
            ))}
          </span>
        )}
      </div>
      <p className="comment-text">{comment.comment_text}</p>
      <div className="comment-footer">
        <span className="comment-date">
          {new Date(comment.created_at).toLocaleString()}
          {comment.updated_at && ` (edited)`}
        </span>
        <div className="comment-actions">
          {!comment.is_approved && (
            <button
              className="approve-btn"
              onClick={() => handleApprove(comment)}
            >
              ✅ Approve
            </button>
          )}
          <button
            className="delete-btn"
            onClick={() => handleDelete(comment)}
          >
            ❌ Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export const CommentsList = ({ mode = 'admin', articleId = null }) => {
  const dispatch = useDispatch();
  const { comments, status, error } = useSelector((state) => state.comments);

  useEffect(() => {
    if (status === 'idle') {
      if (mode === 'admin') {
        dispatch(fetchPendingComments());
      } else if (mode === 'article' && articleId) {
        dispatch(fetchPendingCommentsForArticle(articleId));
      }
    }
  }, [dispatch, status, mode, articleId]);

  const refreshComments = () => {
    if (mode === 'admin') {
      dispatch(fetchPendingComments());
    } else if (mode === 'article' && articleId) {
      dispatch(fetchPendingCommentsForArticle(articleId));
    }
  };

  const handleApprove = (comment) => {
    dispatch(approveComment({
      articleId: comment.article_id,
      commentId: comment.comment_id,
    })).then(() => refreshComments());
  };

  const handleDelete = (comment) => {
    dispatch(deleteComment({
      articleId: comment.article_id,
      commentId: comment.comment_id,
    })).then(() => refreshComments());
  };

  let content;
  if (status === 'loading') {
    content = <div className="loading">Loading comments...</div>;
  } else if (status === 'failed') {
    content = <div className="error">Error: {error}</div>;
  } else if (!comments.length) {
    content = <div className="no-comments">No comments to display.</div>;
  } else {
    content = comments.map((comment) => (
      <CommentExcerpt
        key={comment.comment_id}
        comment={comment}
        handleApprove={handleApprove}
        handleDelete={handleDelete}
      />
    ));
  }

  return (
    <section className="comments-container">
      <h3>
        {mode === 'admin'
          ? 'All Pending Comments'
          : `Pending Comments for Article #${articleId}`}
      </h3>
      <div className="comments-list">{content}</div>
    </section>
  );
};