import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchComments, deleteComment, approveComment } from './commentsSlice';
import { AddCommentForm } from './AddCommentForm';
import { UpdateCommentForm } from './UpdateCommentForm';
import './CommentsList.css';

const CommentExcerpt = ({ comment, articleId }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const editFormRef = useRef(null);
  const dispatch = useDispatch();

  const handleUpdate = () => {
    setShowEditForm(true);
  };

  const handleApprove = () => {
    dispatch(approveComment({ articleId, commentId: comment.comment_id }));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      dispatch(deleteComment({ articleId, commentId: comment.comment_id }));
    }
  };

  useEffect(() => {
    if (showEditForm && editFormRef.current) {
      editFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showEditForm]);

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
        
        {showEditForm ? (
          <div ref={editFormRef}>
            <UpdateCommentForm 
              comment={comment} 
              articleId={articleId}
              setShowEditForm={setShowEditForm} 
            />
          </div>
        ) : (
          <div className="comment-actions">
            <button onClick={handleUpdate} className="button-update">
              Edit
            </button>
            <button onClick={handleDelete} className="button-delete">
              Delete
            </button>
            {!comment.is_approved && (
              <button onClick={handleApprove} className="button-approve">
                Approve
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const CommentsList = ({ articleId }) => {
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.comments.comments);
  const status = useSelector((state) => state.comments.status);
  const error = useSelector((state) => state.comments.error);

  const [showAddCommentForm, setShowAddCommentForm] = useState(false);
  const addCommentFormRef = useRef(null);

  useEffect(() => {
    dispatch(fetchComments(articleId));
  }, [articleId, dispatch]);

  useEffect(() => {
    if (showAddCommentForm && addCommentFormRef.current) {
      addCommentFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showAddCommentForm]);

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
        articleId={articleId}
      />
    ));
  }

  return (
    <section className="comments-container">
      <h3>Comments ({comments.length})</h3>
      
      <button 
        onClick={() => setShowAddCommentForm(!showAddCommentForm)}
        className="add-comment-button"
      >
        {showAddCommentForm ? 'Cancel' : 'Add Comment'}
      </button>
      
      {showAddCommentForm && (
        <div ref={addCommentFormRef}>
          <AddCommentForm articleId={articleId} />
        </div>
      )}
      
      <div className="comments-list">
        {content}
      </div>
    </section>
  );
};