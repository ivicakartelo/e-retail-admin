import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrderItems, deleteOrderItem } from './orderItemsSlice'; // Redux slice
import { AddOrderItemForm } from './AddOrderItemForm';
import { UpdateOrderItemForm } from './UpdateOrderItemForm';
import './OrderItemsList.css';

const OrderItemExcerpt = ({ orderItem, handleDeleteOrderItem, handleUpdateOrderItem }) => {
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
    <div className="order-item-card">
      <h3>Order Item #{orderItem.order_item_id}</h3>
      <p>Order ID: {orderItem.order_id}</p>
      <p>Article ID: {orderItem.article_id}</p>
      <p>Quantity: {orderItem.quantity}</p>
      <p>Price: ${orderItem.price}</p>
      {showEditForm ? (
        <div ref={editFormRef}>
          <UpdateOrderItemForm
            orderItem={orderItem}
            setShowEditForm={setShowEditForm}
            fetchOrderItems={handleUpdateOrderItem} // Fetch updated items after updating an item
          />
        </div>
      ) : (
        <>
          <button onClick={handleUpdate} className="button-update">
            Update
          </button>
          <button
            onClick={() => handleDeleteOrderItem(orderItem.order_item_id)}
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

export const OrderItemsList = () => {
  const dispatch = useDispatch();
  const orderItems = useSelector((state) => state.orderItems.items);
  const status = useSelector((state) => state.orderItems.status);
  const error = useSelector((state) => state.orderItems.error);

  const [showAddOrderItemForm, setShowAddOrderItemForm] = useState(false);
  const addOrderItemFormRef = useRef(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchOrderItems());
    }
  }, [status, dispatch]);

  const handleDeleteOrderItem = async (orderItemId) => {
    await dispatch(deleteOrderItem(orderItemId));
    dispatch(fetchOrderItems()); // Refresh order items list after deletion
  };

  const handleUpdateOrderItem = () => {
    dispatch(fetchOrderItems()); // Refresh order items list after update
  };

  useEffect(() => {
    if (showAddOrderItemForm && addOrderItemFormRef.current) {
      addOrderItemFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showAddOrderItemForm]);

  let content;

  if (status === 'loading') {
    content = <h2>Loading order items...</h2>;
  } else if (status === 'succeeded') {
    content = orderItems.map((orderItem) => (
      <OrderItemExcerpt
        key={orderItem.order_item_id}
        orderItem={orderItem}
        handleDeleteOrderItem={handleDeleteOrderItem}
        handleUpdateOrderItem={handleUpdateOrderItem}
      />
    ));
  } else if (status === 'failed') {
    content = <div>Error: {error}</div>;
  }

  return (
    <section className="order-items-container">
      <h2>Order Items</h2>
      <button onClick={() => setShowAddOrderItemForm(!showAddOrderItemForm)}>
        {showAddOrderItemForm ? 'Cancel' : 'Add Order Item'}
      </button>
      {showAddOrderItemForm && (
        <div ref={addOrderItemFormRef}>
          <AddOrderItemForm />
        </div>
      )}
      <div className="order-items-list">{content}</div>
    </section>
  );
};