import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  categories: [],
  status: 'idle',
  error: null,
};

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  const response = await axios.get('http://localhost:5000/categories'); // Adjust the API endpoint
  console.log(response.data)
  return response.data;
});

export const addNewCategory = createAsyncThunk('categories/addNewCategory', async (newCategory) => {
  console.log(newCategory)
  const response = await axios.post('http://localhost:5000/categories', newCategory);
  console.log(response.data)
  return response.data;
});
/*
export const handleDelete = createAsyncThunk('categories/handleDelete', async (id) => {
  await axios.delete(`http://localhost:5000/categories/${id}`);
  console.log(id)
  return { id };
});
*/
export const handleDelete = createAsyncThunk('categories/handleDelete', async (id) => {
  await axios.delete(`http://localhost:5000/categories/${id}`);
  console.log(id)
  return { id };
});


export const updateCategory = createAsyncThunk('departments/updateDepartment', async ({ id, name, description }) => {
  console.log(id, name, description)
  await axios.put(`http://localhost:5000/departments/${id}`, { name, description });
  console.log(id, name, description)
  return { id, name, description };
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewCategory.fulfilled, (state, action) => {
        console.log(action.payload)
        state.categories.push(action.payload);
      })
      .addCase(handleDelete.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = state.categories.filter((category) => category.category_id !== action.payload.id);
      });
  },
});

export default categoriesSlice.reducer;