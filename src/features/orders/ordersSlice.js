import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  orders: [],
  status: 'idle',
  error: null,
};

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const response = await axios.get('http://localhost:5000/orders');
  return response.data;
});

export const addOrder = createAsyncThunk('orders/addOrder', async (newOrder) => {
  const response = await axios.post('http://localhost:5000/orders', newOrder);
  return response.data;
});

export const deleteOrder = createAsyncThunk('orders/deleteOrder', async (id) => {
  await axios.delete(`http://localhost:5000/orders/${id}`);
  return { id };
});

export const updateOrder = createAsyncThunk('orders/updateOrder', async (updatedOrder) => {
  const { order_id, ...data } = updatedOrder;
  await axios.put(`http://localhost:5000/orders/${order_id}`, data);
  return updatedOrder;
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((order) => order.order_id !== action.payload.id);
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        const { order_id, user_id, status, total_amount } = action.payload;
        const existingOrder = state.orders.find((order) => order.order_id === order_id);
        if (existingOrder) {
          existingOrder.user_id = user_id;
          existingOrder.status = status;
          existingOrder.total_amount = total_amount;
        }
      });
  },
});

export default ordersSlice.reducer;