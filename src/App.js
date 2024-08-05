import React from 'react';
import { DepartmentsList } from './features/departments/DepartmentsList';
import { CategoriesList } from './features/categories/CategoriesList';
import { ArticlesList } from './features/articles/ArticlesList';
import { AddDepartmentForm } from './features/departments/AddDepartmentForm';
const App = () => {
    return (
        <div>
            <AddDepartmentForm />
            <DepartmentsList />
            <CategoriesList />
            <ArticlesList />
        </div>
    );
};

export default App;