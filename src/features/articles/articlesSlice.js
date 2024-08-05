import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  articles: [],
  status: 'idle',
  error: null,
};

export const fetchArticles = createAsyncThunk('articles/fetchArticles', async () => {
  const response = await axios.get('/api/articles'); // Adjust the API endpoint
  return response.data;
});

export const addNewArticle = createAsyncThunk('articles/addNewArticle', async (newArticle) => {
  const response = await axios.post('/api/articles', newArticle);
  return response.data;
});

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.articles = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewArticle.fulfilled, (state, action) => {
        state.articles.push(action.payload);
      });
  },
});

export default articlesSlice.reducer;