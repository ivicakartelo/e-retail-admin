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


export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, department_id, name, description }) => {
    console.log(id, department_id, name, description);
    const response = await axios.put(`http://localhost:5000/categories/${id}`, {
      department_id,
      name,
      description,
    });
    console.log(response.data);
    return response.data;
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
        console.log(state.categories)
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
        console.log(state.categories)
      })
      /*
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id, department_id, name, description } = action.payload;
        //const existingCategory = state.categories.find((category) => category.category_id === id);
        const existingCategory = state.categories.find((category) => category.id === id);

        if (existingCategory) {
          console.log(existingCategory)
          existingCategory.department_id = department_id;  // Update department_id
          existingCategory.name = name;
          existingCategory.description = description;
        }
      })
      */
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id, department_id, name, description } = action.payload;
        console.log(id, department_id, name, description)
        console.log(action.payload)
        console.log(id)      
        const existingCategory = state.categories.find((category) => category.category_id === id);
        console.log(state.categories)
        console.log(existingCategory)
        if (existingCategory) {
          console.log(existingCategory)
          existingCategory.department_id = department_id;
          existingCategory.name = name;
          console.log(existingCategory.name)
          console.log(existingCategory.name)
          existingCategory.description = description;
          console.log(existingCategory.description)
        }
      });
  },
});

export default categoriesSlice.reducer;