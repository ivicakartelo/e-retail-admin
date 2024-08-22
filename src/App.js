import React from 'react';
import { DepartmentsList } from './features/departments/DepartmentsList';
import { CategoriesList } from './features/categories/CategoriesList';
import { ArticlesList } from './features/articles/ArticlesList';

const App = () => {
    return (
        <div>
            <DepartmentsList />
            <CategoriesList />
            <ArticlesList />
        </div>
    );
};

export default App;