import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateComment } from './commentsSlice';

export const UpdateCommentForm = ({ comment, articleId, setShowEditForm }) => {
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState(comment.comment_text);
  const [rating, setRating] = useState(comment.rating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await dispatch(updateComment({
        articleId,
        commentId: comment.comment_id,
        comment_text: commentText,
        rating: rating > 0 ? rating : null
      })).unwrap();
      
      setShowEditForm(false);
    } catch (error) {
      console.error('Failed to update comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <div className="form-group">
        <label htmlFor="commentText">Edit Comment</label>
        <textarea
          id="commentText"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Rating</label>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= rating ? 'selected' : ''}`}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>
      </div>
      
      <div className="form-actions">
        <button 
          type="button" 
          onClick={() => setShowEditForm(false)}
          className="cancel-button"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting || !commentText.trim()}
          className="submit-button"
        >
          {isSubmitting ? 'Updating...' : 'Update'}
        </button>
      </div>
    </form>
  );
};