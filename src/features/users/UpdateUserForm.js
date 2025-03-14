import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUser } from './usersSlice';
import './UpdateUserForm.css';

export const UpdateUserForm = ({ user, setShowEditForm }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [delivery_address, setDelivery_address] = useState(user.delivery_address);
  const [billing_address, setBilling_address] = useState(user.billing_address);
  const dispatch = useDispatch();

  const canSave = Boolean(name) && Boolean(email);

  const onSaveChangesClicked = async () => {
    if (canSave) {
      await dispatch(updateUser({ user_id: user.user_id, name, email, role, delivery_address, billing_address }));
      setShowEditForm(false);
    }
  };

  return (
    <form>
      <label>Name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <label>Email</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      
      <label>Delivery Address</label>
      <input value={delivery_address} onChange={(e) => setDelivery_address(e.target.value)} />
        
      <label>Billing Address</label>
      <input value={billing_address} onChange={(e) => setBilling_address(e.target.value)} />
      
      
      <label>Role</label>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="customer">Customer</option>
        <option value="admin">Admin</option>
      </select>
      <button type="button" onClick={onSaveChangesClicked} disabled={!canSave}>
        Save Changes
      </button>
    </form>
  );
};