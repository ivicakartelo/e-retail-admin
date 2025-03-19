import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderDetails } from './ordersSlice';
import './Invoice.css';

const Invoice = ({ orderId, onClose }) => {
  const dispatch = useDispatch();
  const order = useSelector((state) => state.orders.orderDetails[orderId]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchOrderDetails(orderId)).then(() => setLoading(false));
  }, [dispatch, orderId]);

  if (loading) {
    return <p>Loading invoice...</p>;
  }

  if (!order) {
    return <p>Order not found.</p>;
  }

  return (
    <div className="invoice-container">
      <button className="close-button" onClick={onClose}>Close</button>
      <h2>Invoice #{order.order_id}</h2>
      <p><strong>Customer:</strong> {order.user.name} ({order.user.email})</p>
      <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
      <p><strong>Status:</strong> {order.status}</p>
      
      <h3>Billing Address</h3>
      <p>{order.billing_address.street}, {order.billing_address.city}, {order.billing_address.zip}</p>
      
      <h3>Delivery Address</h3>
      <p>{order.delivery_address.street}, {order.delivery_address.city}, {order.delivery_address.zip}</p>
      
      <h3>Order Items</h3>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.article_id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>${(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Total Amount: ${order.total_amount.toFixed(2)}</h3>
    </div>
  );
};

export default Invoice;