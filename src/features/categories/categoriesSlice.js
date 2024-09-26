import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  categories: [],
  status: 'idle',
  error: null,
};

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  const response = await axios.get('http://localhost:5000/categories');
  return response.data;
});

export const addNewCategory = createAsyncThunk('categories/addNewCategory', async (newCategory) => {
  const response = await axios.post('http://localhost:5000/categories', newCategory);
  return response.data;
});

export const handleDelete = createAsyncThunk('categories/handleDelete', async (id) => {
  await axios.delete(`http://localhost:5000/categories/${id}`);
  return { id };
});

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, department_id, name, description }) => {
    await axios.put(`http://localhost:5000/categories/${id}`, {
      department_id,
      name,
      description,
    });
    return { id, department_id, name, description };
  }
);

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
        state.categories.push(action.payload);
      })
      .addCase(handleDelete.fulfilled, (state, action) => {
        state.categories = state.categories.filter((category) => category.category_id !== action.payload.id);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const { id, department_id, name, description } = action.payload;
        const existingCategory = state.categories.find((category) => category.category_id === id);
        if (existingCategory) {
          existingCategory.department_id = department_id;
          existingCategory.name = name;
          existingCategory.description = description;
        }
      });
  },
});

export default categoriesSlice.reducer;