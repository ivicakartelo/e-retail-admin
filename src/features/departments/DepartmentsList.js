// src/features/departments/DepartmentsList.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDepartments, handleDelete } from './departmentsSlice';
import { AddCategoryForm } from '../categories/AddCategoryForm'; // Import the AddCategoryForm
import { AddDepartmentForm } from './AddDepartmentForm';
import { UpdateDepartmentForm } from './UpdateDepartmentForm';
import './DepartmentsList.css';

const DepartmentExcerpt = ({ department, onDelete }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false); // State to show/hide AddCategoryForm

  const handleUpdate = () => {
    setShowEditForm(true);
  };

  const handleAddCategory = () => {
    setShowAddCategoryForm(!showAddCategoryForm); // Toggle AddCategoryForm
  };

  return (
    <div className="department-card">
      <h3>{department.name}</h3>
      <p>{department.description}</p>

      {showEditForm ? (
        <UpdateDepartmentForm department={department} setShowEditForm={setShowEditForm} />
      ) : (
        <>
          <button className="button-update" onClick={handleUpdate}>
            Update
          </button>
          <button className="button-delete" onClick={() => onDelete(department.department_id)}>
            Delete
          </button>
          <button className="button-add-category" onClick={handleAddCategory}>
            {showAddCategoryForm ? "Cancel" : "Add Category"}
          </button>
        </>
      )}

      {/* Show AddCategoryForm if toggled */}
      {showAddCategoryForm && (
        <AddCategoryForm departmentId={department.department_id} /> // Pass department_id to the form
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

  const handleDeleteDepartment = (departmentId) => {
    const userConfirmed = window.confirm("Deleting this department will also delete all associated categories. Do you want to proceed?");
    if (userConfirmed) {
      dispatch(handleDelete(departmentId)); // Proceed with deletion
    }
  };

  let content;

  if (status === 'loading') {
    content = <h2 className="loading-message">Loading departments...</h2>;
  } else if (status === 'succeeded') {
    content = departments.map((department) => (
      <DepartmentExcerpt 
        key={department.department_id} 
        department={department} 
        onDelete={handleDeleteDepartment} // Pass the delete handler
      />
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
