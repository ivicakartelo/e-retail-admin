import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to fetch all pending comments
export const fetchPendingComments = createAsyncThunk(
    'pendingcomments/fetchPendingComments',
    async () => {
      const response = await axios.get('http://localhost:5000/comments/pending');
      return response.data;
    }
  );

const pendingCommentsSlice = createSlice({
  name: 'pendingcomments',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingComments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPendingComments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPendingComments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default pendingCommentsSlice.reducer;