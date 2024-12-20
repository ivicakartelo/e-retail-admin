import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, deleteUser } from './usersSlice';
import { AddUserForm } from './AddUserForm';
import { UpdateUserForm } from './UpdateUserForm';
import './UsersList.css';

const UserExcerpt = ({ user, handleDeleteUser }) => {
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
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      {showEditForm ? (
        <div ref={editFormRef}>
          <UpdateUserForm user={user} setShowEditForm={setShowEditForm} />
        </div>
      ) : (
        <>
          <button onClick={handleUpdate} className="button-update">
            Update
          </button>
          <button
            onClick={() => handleDeleteUser(user.user_id)}
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

export const UsersList = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const status = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);

  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const addUserFormRef = useRef(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  const handleDeleteUser = async (userId) => {
    await dispatch(deleteUser(userId));
  };

  useEffect(() => {
    if (showAddUserForm && addUserFormRef.current) {
      addUserFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showAddUserForm]);

  let content;

  if (status === 'loading') {
    content = <h2>Loading users...</h2>;
  } else if (status === 'succeeded') {
    content = users.map((user) => (
      <UserExcerpt key={user.user_id} user={user} handleDeleteUser={handleDeleteUser} />
    ));
  } else if (status === 'failed') {
    content = <div>Error: {error}</div>;
  }

  return (
    <section className="users-container">
      <h2>Users</h2>
      <button onClick={() => setShowAddUserForm(!showAddUserForm)}>
        {showAddUserForm ? 'Cancel' : 'Add User'}
      </button>
      {showAddUserForm && (
        <div ref={addUserFormRef}>
          <AddUserForm />
        </div>
      )}
      <div className="users-list">{content}</div>
    </section>
  );
};