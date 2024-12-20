import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUser } from './usersSlice';
import './AddUserForm.css';

export const AddUserForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const dispatch = useDispatch();

  const canSave = Boolean(name) && Boolean(email) && Boolean(password);

  const onSaveUserClicked = async () => {
    if (canSave) {
      await dispatch(addUser({ name, email, password, role }));
      setName('');
      setEmail('');
      setPassword('');
      setRole('customer');
    }
  };

  return (
    <form>
      <label>Name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <label>Email</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <label>Password</label>
      <input value={password} onChange={(e) => setPassword(e.target.value)} />
      <label>Role</label>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="customer">Customer</option>
        <option value="admin">Admin</option>
      </select>
      <button type="button" onClick={onSaveUserClicked} disabled={!canSave}>
        Save
      </button>
    </form>
  );
};