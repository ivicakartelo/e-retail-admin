import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPendingComments } from './pendingCommentsSlice'; // new slice
import './CommentsList.css';
import axios from 'axios';

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

export const PendingCommentsList = () => {
  const dispatch = useDispatch();
  const { items: comments, status, error } = useSelector((state) => state.pendingComments);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPendingComments());
    }
  }, [dispatch, status]);

  const refreshComments = () => {
    dispatch(fetchPendingComments());
  };

  const handleApprove = async (comment) => {
    try {
      await axios.patch(
        `http://localhost:5000/articles/${comment.article_id}/comments/${comment.comment_id}/approve`,
        { approved: true }
      );
      refreshComments();
    } catch (error) {
      console.error("Failed to approve comment:", error);
    }
  };
  

  const handleDelete = async (comment) => {
    try {
      await axios.delete(
        `http://localhost:5000/articles/${comment.article_id}/comments/${comment.comment_id}`
      );
      refreshComments();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
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
      <h3>All Pending Comments</h3>
      <div className="comments-list">{content}</div>
    </section>
  );
};