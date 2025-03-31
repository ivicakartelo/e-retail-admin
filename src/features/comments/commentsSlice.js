import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  comments: [],
  status: 'idle',
  error: null
};

export const fetchPendingComments = createAsyncThunk(
  'comments/fetchPendingComments',
  async () => {
    const response = await axios.get('http://localhost:5000/admin/comments/pending');
    return response.data;
  }
);


export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (articleId) => {
    const response = await axios.get(`http://localhost:5000/articles/${articleId}/comments`);
    return response.data;
  }
);

export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ articleId, commentData }) => {
    const response = await axios.post(
      `http://localhost:5000/articles/${articleId}/comments`,
      commentData
    );
    return response.data;
  }
);

export const updateComment = createAsyncThunk(
    'comments/updateComment',
    async ({ articleId, commentId, comment_text, rating }, { rejectWithValue }) => {
      try {
        const response = await axios.put(
          `http://localhost:5000/articles/${articleId}/comments/${commentId}`,
          { comment_text, rating: rating || null }  // Explicitly send these fields
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async ({ articleId, commentId }) => {
    await axios.delete(`http://localhost:5000/articles/${articleId}/comments/${commentId}`);
    return { commentId };
  }
);

export const approveComment = createAsyncThunk(
  'comments/approveComment',
  async ({ articleId, commentId }) => {
    const response = await axios.patch(
      `http://localhost:5000/articles/${articleId}/comments/${commentId}/approve`,
      { approved: true }
    );
    return response.data;
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchPendingComments.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(fetchPendingComments.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.comments = action.payload;
    })
    .addCase(fetchPendingComments.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    })
      .addCase(fetchComments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          comment => comment.comment_id === action.payload.comment_id
        );
        if (index !== -1) {
          state.comments[index] = {
            ...state.comments[index],
            ...action.payload,
            updated_at: new Date().toISOString()
          };
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          comment => comment.comment_id !== action.payload.commentId
        );
      })
      .addCase(approveComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          comment => comment.comment_id === action.payload.comment_id
        );
        if (index !== -1) {
          state.comments[index].is_approved = true;
        }
      });
  }
});

export default commentsSlice.reducer;