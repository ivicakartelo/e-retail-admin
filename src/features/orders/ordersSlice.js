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

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ order_id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:5000/orders/update-status/${order_id}`, { status });
      console.log(response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


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
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        console.log(updatedOrder)

        console.log("Updated Order ID:", updatedOrder.orderId, typeof updatedOrder.orderId);
        console.log("Existing Order IDs:", state.orders.map(order => [order.order_id, typeof order.order_id]));

        const existingOrder = state.orders.find(
          (order) => String(order.order_id) === String(updatedOrder.orderId)
      );
        console.log(updatedOrder.orderId)
        
        if (existingOrder) {
          console.log(existingOrder)
          existingOrder.status = updatedOrder.status; // Update the status in Redux state
          }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update order status';
      });
    
  },
});

export default ordersSlice.reducer;