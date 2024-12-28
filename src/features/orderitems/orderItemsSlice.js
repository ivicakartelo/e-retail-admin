import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // Replace with your API client if different

const API_URL = 'http://localhost:5000/order-items'; // Replace with the correct endpoint for order_items

// Async Thunks

export const fetchOrderItems = createAsyncThunk('orderItems/fetchOrderItems', async () => {
  const response = await axios.get(API_URL);
  return response.data; // Assuming the API returns an array of order items
});

export const addOrderItem = createAsyncThunk('orderItems/addOrderItem', async (newOrderItem) => {
  const response = await axios.post(API_URL, newOrderItem);
  return response.data; // Assuming the API returns the created order item
});

export const updateOrderItem = createAsyncThunk('orderItems/updateOrderItem', async (updatedOrderItem) => {
  const { order_item_id, ...updates } = updatedOrderItem;
  const response = await axios.put(`${API_URL}/${order_item_id}`, updates);
  return response.data; // Assuming the API returns the updated order item
});

export const deleteOrderItem = createAsyncThunk('orderItems/deleteOrderItem', async (orderItemId) => {
  await axios.delete(`${API_URL}/${orderItemId}`);
  return orderItemId; // Return the ID of the deleted item to remove it from the state
});

// Slice Definition

const orderItemsSlice = createSlice({
  name: 'orderItems',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Order Items
      .addCase(fetchOrderItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrderItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; // Replace the current items with the fetched data
      })
      .addCase(fetchOrderItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Add Order Item
      .addCase(addOrderItem.fulfilled, (state, action) => {
        state.items.push(action.payload); // Add the new item to the state
      })

      // Update Order Item
      .addCase(updateOrderItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.order_item_id === action.payload.order_item_id
        );
        if (index !== -1) {
          state.items[index] = action.payload; // Update the item in the state
        }
      })

      // Delete Order Item
      .addCase(deleteOrderItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.order_item_id !== action.payload);
      });
  },
});

export default orderItemsSlice.reducer;