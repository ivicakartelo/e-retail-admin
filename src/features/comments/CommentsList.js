import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPendingCommentsForArticle, approveComment, deleteComment } from './commentsSlice'; // Updated import
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
            <button
              className="approve-btn"
              onClick={() => onApprove(comment)}
            >
              ✅ Approve
            </button>
          )}
          <button
            className="delete-btn"
            onClick={() => onDelete(comment)}
          >
            ❌ Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export const CommentsList = ({ articleId }) => {
  console.log("CommentsList rendered");

  const dispatch = useDispatch();
  const comments = useSelector((state) => state.comments.comments);
  const status = useSelector((state) => state.comments.status);
  const error = useSelector((state) => state.comments.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPendingCommentsForArticle(articleId)); // Fetch comments for this specific article
    }
  }, [status, dispatch, articleId]);

  const handleApprove = (comment) => {
    console.log("Dispatching approveComment", comment);
    dispatch(approveComment({ 
      articleId: comment.article_id, 
      commentId: comment.comment_id 
    })).then(() => {
      dispatch(fetchPendingCommentsForArticle(articleId)); // Refresh the list after approving
    });
  };

  const handleDelete = (comment) => {
    console.log("Dispatching deleteComment", comment);
    dispatch(deleteComment({ 
      articleId: comment.article_id, 
      commentId: comment.comment_id 
    })).then(() => {
      dispatch(fetchPendingCommentsForArticle(articleId)); // Refresh the list after deleting
    });
  };

  let content;
  if (status === 'loading') {
    content = <div className="loading">Loading comments...</div>;
  } else if (status === 'failed') {
    content = <div className="error">Error: {error}</div>;
  } else if (comments.length === 0) {
    content = <div className="no-comments">No comments yet</div>;
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
      <h3>Pending Comments ({comments.length})</h3>
      <div className="comments-list">
        {content}
      </div>
    </section>
  );
};