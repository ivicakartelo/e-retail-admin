import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDepartments, handleDelete } from './departmentsSlice';
import { AddDepartmentForm } from './AddDepartmentForm';
import { UpdateDepartmentForm } from './UpdateDepartmentForm';
import './DepartmentsList.css';

const DepartmentExcerpt = ({ department }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [updateId, setUpdateId] = useState('');
  const dispatch = useDispatch();

  const handleUpdate = (id) => {
    setUpdateId(id);
    setShowEditForm(true);
  };

  return (
    <div className="department-card">
      <h3>{department.name}</h3>
      <p>{department.description}</p>
      
      {showEditForm && updateId === department.department_id ? (
        <UpdateDepartmentForm department={department} setShowEditForm={setShowEditForm} />
      ) : (
        <>
          <button className="button-update" onClick={() => handleUpdate(department.department_id)}>
            Update
          </button>
          <button className="button-delete" onClick={() => dispatch(handleDelete(department.department_id))}>
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export const DepartmentsList = () => {
  const dispatch = useDispatch();
  const departments = useSelector((state) => state.departments.departments);
  const status = useSelector((state) => state.departments.status);
  const error = useSelector((state) => state.departments.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDepartments());
    }
  }, [status, dispatch]);

  let content;

  if (status === 'loading') {
    content = <h2 className="loading-message">Loading departments...</h2>;
  } else if (status === 'succeeded') {
    content = departments.map((department) => (
      <DepartmentExcerpt key={department.department_id} department={department} />
    ));
  } else if (status === 'failed') {
    content = <div className="error-message">Error: {error}</div>;
  }

  return (
    <section className="departments-container">
      <h2>Departments</h2>
      <AddDepartmentForm />
      <div className="departments-list">{content}</div>
    </section>
  );
};
