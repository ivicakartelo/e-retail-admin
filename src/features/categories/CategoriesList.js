import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories, handleDelete  } from './categoriesSlice';
import { AddCategoryForm } from './AddCategoryForm';
import { UpdateCategoryForm } from './UpdateCategoryForm'

const CategoryExcerpt = ({ category }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [updateId, setUpdateId] = useState('')
  const dispatch = useDispatch()

  const handleUpdate = (id) => {
      setUpdateId(id);
      console.log(id)
      setShowEditForm(true);
    }
    
  return (
      <article key={category.category_id}>
          <h1>{category.category_id}</h1>
          <h3>{category.name}</h3>
          <p>{category.description}</p>

          {showEditForm && updateId === category.category_id ? (
              <UpdateCategoryForm
                  category={category}
                  setShowEditForm={setShowEditForm}
              />
              ) : (
              <button onClick={() => handleUpdate(category.category_id)}>
                  Update
              </button>
          )}
          <button onClick={() => dispatch(handleDelete(category.category_id))}>Delete</button>
          
      </article>
  )
}

export const CategoriesList = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories);
  const status = useSelector((state) => state.categories.status);
  const error = useSelector((state) => state.categories.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  let content
    
status === 'loading' ? (
    content = <h1>Loading...</h1>
) : status === 'succeeded' ? (
    content = categories.map(category => <CategoryExcerpt key={category.category_id} category={category} />)
) : (
    content = <div>Error: {error}</div>
)
  return (
    <section>
      <h2>Categories</h2>
      <AddCategoryForm />
      {content}
    </section>
  );
};