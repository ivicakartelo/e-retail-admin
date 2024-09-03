import React, { useState } from 'react';
import { DepartmentsList } from './features/departments/DepartmentsList';
import { CategoriesList } from './features/categories/CategoriesList';
import { ArticlesList } from './features/articles/ArticlesList';
import './App.css';

const App = () => {
    const [activeTab, setActiveTab] = useState('Departments');

    const renderContent = () => {
        switch (activeTab) {
            case 'Departments':
                return <DepartmentsList />;
            case 'Categories':
                return <CategoriesList />;
            case 'Articles':
                return <ArticlesList />;
            default:
                return <DepartmentsList />;
        }
    };

    return (
        <div className="admin-container">
            <nav className="sidebar">
                <h2>Admin Panel</h2>
                <ul>
                    <li onClick={() => setActiveTab('Departments')} className={activeTab === 'Departments' ? 'active' : ''}>Departments</li>
                    <li onClick={() => setActiveTab('Categories')} className={activeTab === 'Categories' ? 'active' : ''}>Categories</li>
                    <li onClick={() => setActiveTab('Articles')} className={activeTab === 'Articles' ? 'active' : ''}>Articles</li>
                </ul>
            </nav>
            <div className="main-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default App;