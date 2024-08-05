import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDepartments } from './departmentsSlice';
import { UpdateDepartmentForm } from './UpdateDepartmentForm'

const DepartmentExcerpt = ({ department }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [updateId, setUpdateId] = useState('')
  

  const handleUpdate = (id) => {
      setUpdateId(id);
      console.log(id)
      setShowEditForm(true);
    }
    
  return (
      <article key={department.department_id}>
          <h1>{department.department_id}</h1>
          <h3>{department.name}</h3>
          <p>{department.description}</p>

          {showEditForm && updateId === department.department_id ? (
              <UpdateDepartmentForm
                  department={department}
                  setShowEditForm={setShowEditForm}
              />
              ) : (
              <button onClick={() => handleUpdate(department.department_id)}>
                  Update
              </button>
          )}
          
          
          
      </article>
  )
}

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

  let content
    
status === 'loading' ? (
    content = <h1>Loading...</h1>
) : status === 'succeeded' ? (
    content = departments.map(department => <DepartmentExcerpt key={department.department_id} department={department} />)
) : (
    content = <div>Error: {error}</div>
)
  return (
    <section>
      <h2>Departments</h2>
      
      {content}
    </section>
  );
};