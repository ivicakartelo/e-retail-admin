// src/features/departments/DepartmentsList.js

import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDepartments, handleDelete } from './departmentsSlice';
import { AddCategoryForm } from '../categories/AddCategoryForm'; // Import the AddCategoryForm
import { AddDepartmentForm } from './AddDepartmentForm';
import { UpdateDepartmentForm } from './UpdateDepartmentForm';
import './DepartmentsList.css';

const DepartmentExcerpt = ({ department, handleDeleteDepartment }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false); // State to show/hide AddCategoryForm
  const editFormRef = useRef(null); // Ref for the update form
  const addCategoryFormRef = useRef(null); // Ref for the add category form

  // Handle showing the update form
  const handleUpdate = () => {
    setShowEditForm(true);
  };

  // Handle toggling the AddCategoryForm
  const handleAddCategory = () => {
    setShowAddCategoryForm(!showAddCategoryForm);
  };

  // Scroll to the update form when it's visible
  useEffect(() => {
    if (showEditForm && editFormRef.current) {
      editFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showEditForm]);

  // Scroll to the add category form when it's visible
  useEffect(() => {
    if (showAddCategoryForm && addCategoryFormRef.current) {
      addCategoryFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showAddCategoryForm]);

  return (
    <div className="department-card">
      <h3>{department.name}</h3>
      <p>{department.description}</p>

      {showEditForm ? (
        <div ref={editFormRef}>
          <UpdateDepartmentForm department={department} setShowEditForm={setShowEditForm} />
        </div>
      ) : (
        <>
          <button className="button-update" onClick={handleUpdate}>
            Update
          </button>
          <button className="button-delete" onClick={() => handleDeleteDepartment(department.department_id)}>
            Delete
          </button>
          <button className="button-add-category" onClick={handleAddCategory}>
            {showAddCategoryForm ? "Cancel" : "Add Category"}
          </button>
        </>
      )}

      {/* Show AddCategoryForm if toggled */}
      {showAddCategoryForm && (
        <div ref={addCategoryFormRef}>
          <AddCategoryForm 
            departmentId={department.department_id} // Pass department_id to the form
            onCancel={() => setShowAddCategoryForm(false)} // Pass onCancel prop to handle cancellation
          />
        </div>
      )}
    </div>
  );
};

export const DepartmentsList = () => {
  const dispatch = useDispatch();
  const departments = useSelector((state) => state.departments.departments);
  const status = useSelector((state) => state.departments.status);
  const error = useSelector((state) => state.departments.error);
  
  // State to show/hide AddDepartmentForm
  const [showAddDepartmentForm, setShowAddDepartmentForm] = useState(false);
  const addDepartmentFormRef = useRef(null); // Ref for scrolling to AddDepartmentForm

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDepartments());
    }
  }, [status, dispatch]);

  const handleDeleteDepartment = (departmentId) => {
    const userConfirmed = window.confirm(
      'Deleting this department will also delete all associated categories. Do you want to proceed?'
    );
    if (userConfirmed) {
      dispatch(handleDelete(departmentId)); // Proceed with deletion
    }
  };

  // Scroll to the AddDepartmentForm when it's shown
  useEffect(() => {
    if (showAddDepartmentForm && addDepartmentFormRef.current) {
      addDepartmentFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showAddDepartmentForm]);

  let content;

  if (status === 'loading') {
    content = <h2 className="loading-message">Loading departments...</h2>;
  } else if (status === 'succeeded') {
    content = departments.map((department) => (
      <DepartmentExcerpt
        key={department.department_id}
        department={department}
        handleDeleteDepartment={handleDeleteDepartment} // Pass the delete handler
      />
    ));
  } else if (status === 'failed') {
    content = <div className="error-message">Error: {error}</div>;
  }

  return (
    <section className="departments-container">
      <h2>Departments</h2>
      
      {/* Button to toggle AddDepartmentForm */}
      <button
        className="button-add-department"
        onClick={() => setShowAddDepartmentForm(!showAddDepartmentForm)}
      >
        {showAddDepartmentForm ? 'Cancel' : 'Add Department'}
      </button>

      {/* Conditionally show AddDepartmentForm */}
      {showAddDepartmentForm && (
        <div ref={addDepartmentFormRef}>
          <AddDepartmentForm />
        </div>
      )}

      <div className="departments-list">{content}</div>
    </section>
  );
};