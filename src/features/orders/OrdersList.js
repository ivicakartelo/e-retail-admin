import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, deleteOrder } from './ordersSlice';
import { AddOrderForm } from './AddOrderForm';
import { UpdateOrderForm } from './UpdateOrderForm';
import './OrdersList.css';

const OrderExcerpt = ({ order, handleDeleteOrder }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const editFormRef = useRef(null);

  const handleUpdate = () => {
    setShowEditForm(true);
  };

  useEffect(() => {
    if (showEditForm && editFormRef.current) {
      editFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showEditForm]);

  return (
    <div className="order-card">
      <h3>Order #{order.order_id}</h3>
      <p>User ID: {order.user_id}</p>
      <p>Status: {order.status}</p>
      <p>Total Amount: ${order.total_amount}</p>
      {showEditForm ? (
        <div ref={editFormRef}>
          <UpdateOrderForm order={order} setShowEditForm={setShowEditForm} />
        </div>
      ) : (
        <>
          <button onClick={handleUpdate} className="button-update">
            Update
          </button>
          <button
            onClick={() => handleDeleteOrder(order.order_id)}
            className="button-delete"
            style={{ backgroundColor: 'red', color: 'white' }}
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export const OrdersList = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);
  const status = useSelector((state) => state.orders.status);
  const error = useSelector((state) => state.orders.error);

  const [showAddOrderForm, setShowAddOrderForm] = useState(false);
  const addOrderFormRef = useRef(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchOrders());
    }
  }, [status, dispatch]);

  const handleDeleteOrder = async (orderId) => {
    await dispatch(deleteOrder(orderId));
  };

  useEffect(() => {
    if (showAddOrderForm && addOrderFormRef.current) {
      addOrderFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showAddOrderForm]);

  let content;

  if (status === 'loading') {
    content = <h2>Loading orders...</h2>;
  } else if (status === 'succeeded') {
    content = orders.map((order) => (
      <OrderExcerpt key={order.order_id} order={order} handleDeleteOrder={handleDeleteOrder} />
    ));
  } else if (status === 'failed') {
    content = <div>Error: {error}</div>;
  }

  return (
    <section className="orders-container">
      <h2>Orders</h2>
      <button onClick={() => setShowAddOrderForm(!showAddOrderForm)}>
        {showAddOrderForm ? 'Cancel' : 'Add Order'}
      </button>
      {showAddOrderForm && (
        <div ref={addOrderFormRef}>
          <AddOrderForm />
        </div>
      )}
      <div className="orders-list">{content}</div>
    </section>
  );
};