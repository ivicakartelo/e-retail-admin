import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchPendingComments,
  fetchPendingCommentsForArticle,
  approveComment,
  deleteComment,
} from './commentsSlice';
import './CommentsList.css';

const CommentExcerpt = ({ comment, onApprove, onDelete }) => {
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
            <button className="approve-btn" onClick={() => onApprove(comment)}>
              ✅ Approve
            </button>
          )}
          <button className="delete-btn" onClick={() => onDelete(comment)}>
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

  // Fetch pending comments based on mode
  useEffect(() => {
    if (status === 'idle') {
      if (mode === 'admin') {
        dispatch(fetchPendingComments()); // Fetch all pending comments
      } else if (mode === 'article' && articleId) {
        dispatch(fetchPendingCommentsForArticle(articleId)); // Fetch pending comments for a specific article
      }
    }
  }, [dispatch, status, mode, articleId]);

  // Function to refresh comments after actions (approve/delete)
  const refreshComments = () => {
    if (mode === 'admin') {
      dispatch(fetchPendingComments());
    } else if (mode === 'article' && articleId) {
      dispatch(fetchPendingCommentsForArticle(articleId));
    }
  };

  // Handle comment approval
  const handleApprove = (comment) => {
    dispatch(approveComment({
      articleId: comment.article_id,
      commentId: comment.comment_id
    })).then(() => refreshComments());
  };

  // Handle comment deletion
  const handleDelete = (comment) => {
    dispatch(deleteComment({
      articleId: comment.article_id,
      commentId: comment.comment_id
    })).then(() => refreshComments());
  };

  // Render content based on status and available comments
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
        onApprove={handleApprove}
        onDelete={handleDelete}
      />
    ));
  }

  return (
    <section className="comments-container">
      <h3>
        {mode === 'admin' ? 'All Pending Comments' : `Pending Comments for Article #${articleId}`}
      </h3>
      <div className="comments-list">{content}</div>
    </section>
  );
};