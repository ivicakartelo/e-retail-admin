// pendingCommentsArticleSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createSelector } from 'reselect';

// Thunk to fetch pending comments for a specific article
export const fetchPendingCommentsByArticle = createAsyncThunk(
  'pendingCommentsArticle/fetchPendingCommentsByArticle',
  async (articleId) => {
    const response = await axios.get(`http://localhost:5000/comments/pending/${articleId}`);
    return response.data;
  }
);

// Initial state structure
const initialState = {
  itemsByArticleId: {},
  statusByArticleId: {},
  errorByArticleId: {},
};

// Slice to manage pending comments state
const pendingCommentsArticleSlice = createSlice({
  name: 'pendingCommentsArticle',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingCommentsByArticle.pending, (state, action) => {
        const articleId = action.meta.arg;
        state.statusByArticleId[articleId] = 'loading';
        state.errorByArticleId[articleId] = null;
      })
      .addCase(fetchPendingCommentsByArticle.fulfilled, (state, action) => {
        const articleId = action.meta.arg;
        state.itemsByArticleId[articleId] = action.payload;
        state.statusByArticleId[articleId] = 'succeeded';
      })
      .addCase(fetchPendingCommentsByArticle.rejected, (state, action) => {
        const articleId = action.meta.arg;
        state.statusByArticleId[articleId] = 'failed';
        state.errorByArticleId[articleId] = action.error.message;
      });
  },
});

// Memoized selector using reselect
const selectItemsByArticleId = (state) => state.pendingCommentsArticle.itemsByArticleId;
const selectArticleComments = (articleId) =>
  createSelector([selectItemsByArticleId], (itemsByArticleId) => {
    return itemsByArticleId[articleId] || [];
  });

// Export the selector for use in components
export { selectArticleComments };

export default pendingCommentsArticleSlice.reducer;