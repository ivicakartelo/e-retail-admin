import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  articles: [],
  status: 'idle',
  error: null,
};

// Async thunk to fetch all articles
export const fetchArticles = createAsyncThunk('articles/fetchArticles', async () => {
  const response = await axios.get('http://localhost:5000/articles');
  return response.data;
});

// Async thunk to add a new article with file uploads
export const addNewArticle = createAsyncThunk(
  'articles/addNewArticle',
  async (formData, { rejectWithValue }) => {
    try {
      // Log contents of formData for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axios.post('http://localhost:5000/articles', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred while adding the article');
    }
  }
);

// Async thunk to delete an article by ID
export const handleDelete = createAsyncThunk('articles/handleDelete', async (id) => {
  await axios.delete(`http://localhost:5000/articles/${id}`);
  return { id };
});

// Async thunk to update an article by ID with file uploads
export const updateArticle = createAsyncThunk(
  'articles/updateArticle',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // Log FormData contents for debugging
      for (let [key, value] of data.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axios.put(`http://localhost:5000/articles/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Backend Response:', response.data); // Debugging backend response
      return { id, ...response.data };
    } catch (error) {
      console.error('Update Article Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || 'An error occurred while updating the article');
    }
  }
);

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetching articles
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

      // Handle adding new article
      .addCase(addNewArticle.fulfilled, (state, action) => {
        state.articles.push(action.payload);
      })

      // Handle deleting article
      .addCase(handleDelete.fulfilled, (state, action) => {
        state.articles = state.articles.filter((article) => article.article_id !== action.payload.id);
      })

      // Handle updating article
      .addCase(updateArticle.fulfilled, (state, action) => {
        const { id, ...updatedData } = action.payload;
        const existingArticle = state.articles.find((article) => article.article_id === id);
        if (existingArticle) {
          Object.assign(existingArticle, updatedData);
        }
      })

      // Handle rejected cases for adding/updating
      .addCase(addNewArticle.rejected, (state, action) => {
        state.error = action.payload || 'An error occurred while adding the article';
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.error = action.payload || 'An error occurred while updating the article';
      });
  },
});

export default articlesSlice.reducer;