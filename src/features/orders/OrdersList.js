import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, deleteOrder, updateOrderStatus } from './ordersSlice';
import { AddOrderForm } from './AddOrderForm';
import { UpdateOrderForm } from './UpdateOrderForm';
import './OrdersList.css';

// OrderExcerpt Component - Displays each order
const OrderExcerpt = ({ order, handleDeleteOrder }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [newStatus, setNewStatus] = useState(order.status);
  const dispatch = useDispatch();
  const editFormRef = useRef(null);

  const handleUpdate = () => {
    setShowEditForm(true);
  };

  useEffect(() => {
    if (showEditForm && editFormRef.current) {
      editFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showEditForm]);

  // Handle status update
  const handleStatusChange = async () => {
    await dispatch(updateOrderStatus({ order_id: order.order_id, status: newStatus }));
    alert('Status changed.');
  };

  // Fetch and download invoice PDF
  const handleDownloadInvoice = async () => {
    try {
      console.log("Downloading invoice for Order ID:", order.order_id);
      alert(`Invoice #${order.order_id} downloading.`);
      const response = await fetch(`http://localhost:5000/invoice/${order.order_id}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to download invoice");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice_${order.order_id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Replace alert with a small notification (better UX)
      alert(`Invoice #${order.order_id} downloaded.`);
    } catch (error) {
      console.error("Error downloading invoice:", error);
    }
  };

  return (
    <div className="order-card">
      <h3>Order #{order.order_id}</h3>
      <p>User ID: {order.user_id}</p>
      <p>
        Status: 
        <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
        <button onClick={handleStatusChange} className="button-update">Update Status</button>
      </p>
      <p>Total Amount: ${order.total_amount}</p>
      {showEditForm ? (
        <div ref={editFormRef}>
          <UpdateOrderForm order={order} setShowEditForm={setShowEditForm} />
        </div>
      ) : (
        <>
          <button onClick={handleUpdate} className="button-update">Update</button>
          <button onClick={() => handleDeleteOrder(order.order_id)} className="button-delete">
            Delete
          </button>
          <button onClick={handleDownloadInvoice} className="button-invoice">
            Invoice
          </button>
        </>
      )}
    </div>
  );
};

// OrdersList Component - Displays the list of orders
export const OrdersList = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);
  console.log(orders)
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