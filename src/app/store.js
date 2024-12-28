import { configureStore } from '@reduxjs/toolkit';
import departmentsReducer from '../features/departments/departmentsSlice';
import categoriesReducer from '../features/categories/categoriesSlice';
import articlesReducer from '../features/articles/articlesSlice';
import usersReducer from '../features/users/usersSlice';
import ordersReducer from '../features/orders/ordersSlice';
import orderItemsReducer from '../features/orderitems/orderItemsSlice';

export const store = configureStore({
  reducer: {
    departments: departmentsReducer,
    categories: categoriesReducer,
    articles: articlesReducer,
    users: usersReducer,
    orders: ordersReducer,
    orderItems: orderItemsReducer,
  },
});