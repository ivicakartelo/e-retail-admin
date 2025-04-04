import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const initialState = {
  comments: [],
  status: 'idle',
  error: null,
};

export const fetchPendingCommentsForArticle = createAsyncThunk(
  'comments/fetchPendingCommentsForArticle',
  async (articleId) => {
    const response = await axios.get(`http://localhost:5000/admin/comments/pending/${articleId}`); // Your Express API endpoint
    return response.data;
  }
);

// Helper function to handle API errors
const handleApiError = (error) => error.response?.data || 'An error occurred';

// Fetch pending comments (optionally filtered by article)
export const fetchPendingComments = createAsyncThunk(
  'comments/fetchPending',
  async () => {
    const response = await fetch('http://localhost:5000/admin/comments/pending');
    if (!response.ok) throw new Error('Failed to fetch pending comments');
    return await response.json();
  }
);

// Fetch comments for a specific article
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (articleId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/articles/${articleId}/comments`);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Add a new comment
export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ articleId, commentData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/articles/${articleId}/comments`, commentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Update an existing comment
export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ articleId, commentId, comment_text, rating }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/articles/${articleId}/comments/${commentId}`,
        { comment_text, rating: rating || null }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Delete a comment
export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async ({ articleId, commentId }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/articles/${articleId}/comments/${commentId}`);
      return { commentId };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Approve a comment
export const approveComment = createAsyncThunk(
  'comments/approveComment',
  async ({ articleId, commentId }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/articles/${articleId}/comments/${commentId}/approve`,
        { approved: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Comments slice
const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle the lifecycle of fetchPendingComments
      .addCase(fetchPendingCommentsForArticle.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPendingCommentsForArticle.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments = action.payload; // Store comments in state
      })
      .addCase(fetchPendingCommentsForArticle.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchPendingComments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPendingComments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments = action.payload;
        console.log(action.payload)
      })
      .addCase(fetchPendingComments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Handle the lifecycle of fetchComments
      .addCase(fetchComments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Handle the lifecycle of addComment
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })

      // Handle the lifecycle of updateComment
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (comment) => comment.comment_id === action.payload.comment_id
        );
        if (index !== -1) {
          state.comments[index] = {
            ...state.comments[index],
            ...action.payload,
            updated_at: new Date().toISOString(),
          };
        }
      })

      // Handle the lifecycle of deleteComment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (comment) => comment.comment_id !== action.payload.commentId
        );
      })

      // Handle the lifecycle of approveComment
      .addCase(approveComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (comment) => comment.comment_id !== action.payload.comment_id
        );
      });
  },
});

export default commentsSlice.reducer;