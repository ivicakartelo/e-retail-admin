import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addComment } from './commentsSlice';

export const AddCommentForm = ({ articleId }) => {
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await dispatch(addComment({
        articleId,
        commentData: {
          comment_text: commentText,
          rating: rating > 0 ? rating : null,
          // For admin panel, we can auto-approve or set a default user_id
          is_approved: true,
          user_id: 1 // Temporary - replace with actual user when auth is added
        }
      })).unwrap();
      
      setCommentText('');
      setRating(0);
      setIsSubmitting(false);
    } catch (err) {
      console.error('Failed to add comment:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <div className="form-group">
        <label htmlFor="commentText">Add Comment</label>
        <textarea
          id="commentText"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Rating (optional)</label>
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
      
      <button type="submit" disabled={isSubmitting || !commentText.trim()}>
        {isSubmitting ? 'Submitting...' : 'Submit Comment'}
      </button>
    </form>
  );
};