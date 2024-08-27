import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  departments: [],
  status: 'idle',
  error: null,
};

export const fetchDepartments = createAsyncThunk('departments/fetchDepartments', async () => {
  const response = await axios.get('http://localhost:5000/departments');
  return response.data;
});

export const addNewDepartment = createAsyncThunk('departments/addNewDepartment', async (newDepartment) => {
  const response = await axios.post('http://localhost:5000/departments', newDepartment);
  console.log(response.data)
  return response.data;
});

export const handleDelete = createAsyncThunk('departments/handleDelete', async (id) => {
  await axios.delete(`http://localhost:5000/departments/${id}`);
  console.log(id)
  return { id };
});

export const updateDepartment = createAsyncThunk('departments/updateDepartment', async ({ id, name, description }) => {
  console.log(id, name, description)
  await axios.put(`http://localhost:5000/departments/${id}`, { name, description });
  console.log(id, name, description)
  return { id, name, description };
});


const departmentsSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewDepartment.fulfilled, (state, action) => {
        state.departments.push(action.payload);
      })
      .addCase(handleDelete.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.departments = state.departments.filter((department) => department.department_id !== action.payload.id);
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id, name, description } = action.payload;
        console.log(id, name, description)
        console.log(action.payload)
        const existingDepartment = state.departments.find((department) => department.department_id === id);
        console.log(existingDepartment)
        console.log(state.departments)
        if (existingDepartment) {
          existingDepartment.name = name;
          console.log(existingDepartment.name)
          existingDepartment.description = description;
          console.log(existingDepartment.description)
        }
      })
      },
    });

export default departmentsSlice.reducer;