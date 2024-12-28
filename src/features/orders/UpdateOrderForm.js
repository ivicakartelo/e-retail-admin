import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateOrder } from './ordersSlice';
import './UpdateOrderForm.css';

export const UpdateOrderForm = ({ order, setShowEditForm }) => {
  const [status, setStatus] = useState(order.status);
  const [total_amount, setTotalAmount] = useState(order.total_amount);
  const dispatch = useDispatch();

  const canSave = Boolean(status) && Boolean(total_amount);

  const onSaveChangesClicked = async () => {
    if (canSave) {
      await dispatch(updateOrder({ order_id: order.order_id, status, total_amount }));
      setShowEditForm(false);
    }
  };

  return (
    <form>
      <label>Status</label>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <label>Total Amount</label>
      <input value={total_amount} onChange={(e) => setTotalAmount(e.target.value)} />
      <button type="button" onClick={onSaveChangesClicked} disabled={!canSave}>
        Save Changes
      </button>
    </form>
  );
};