import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addOrder } from './ordersSlice';
import './AddOrderForm.css';

export const AddOrderForm = () => {
  const [user_id, setUserId] = useState('');
  const [total_amount, setTotalAmount] = useState('');
  const dispatch = useDispatch();

  const canSave = Boolean(user_id) && Boolean(total_amount);

  const onSaveOrderClicked = async () => {
    if (canSave) {
      await dispatch(addOrder({ user_id, total_amount }));
      setUserId('');
      setTotalAmount('');
    }
  };

  return (
    <form>
      <label>User ID</label>
      <input value={user_id} onChange={(e) => setUserId(e.target.value)} />
      <label>Total Amount</label>
      <input value={total_amount} onChange={(e) => setTotalAmount(e.target.value)} />
      <button type="button" onClick={onSaveOrderClicked} disabled={!canSave}>
        Add Order
      </button>
    </form>
  );
};