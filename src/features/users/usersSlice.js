import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  users: [],
  status: 'idle',
  error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get('http://localhost:5000/users');
  return response.data;
});

export const addUser = createAsyncThunk('users/addUser', async (newUser) => {
  const response = await axios.post('http://localhost:5000/users', newUser);
  return response.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id) => {
  await axios.delete(`http://localhost:5000/users/${id}`);
  return { id };
});

export const updateUser = createAsyncThunk('users/updateUser', async (updatedUser) => {
  console.log("Updating user:", updatedUser); // Debugging
  const { user_id, ...data } = updatedUser;
  await axios.put(`http://localhost:5000/users/${user_id}`, data);
  return updatedUser;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.user_id !== action.payload.id);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const { user_id, name, email, role, delivery_address, billing_address } = action.payload;
        const existingUser = state.users.find((user) => user.user_id === user_id);
        if (existingUser) {
          existingUser.name = name;
          existingUser.email = email;
          existingUser.role = role;
          existingUser.delivery_address = delivery_address;
          existingUser.billing_address = billing_address;
        }
      });
  },
});

export default usersSlice.reducer;