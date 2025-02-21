import React, { useState } from 'react';
import { DepartmentsList } from './features/departments/DepartmentsList';
import { CategoriesList } from './features/categories/CategoriesList';
import { ArticlesList } from './features/articles/ArticlesList';
import { UsersList } from './features/users/UsersList';
import { OrdersList } from './features/orders/OrdersList';
import { OrderItemsList } from './features/orderitems/OrderItemsList';
import './App.css';

const App = () => {
    const [activeTab, setActiveTab] = useState('Departments');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
        // Close sidebar after clicking an option on mobile view
        if (window.innerWidth <= 768) {
            setSidebarOpen(false);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Departments':
                return <DepartmentsList />;
            case 'Categories':
                return <CategoriesList />;
            case 'Articles':
                return <ArticlesList />;
            case 'Users':
                return <UsersList />;
            case 'Orders':
                return <OrdersList />;
            case 'OrderItems':
                return <OrderItemsList />;
            default:
                return <DepartmentsList />;
        }
    };

    return (
        <div className="admin-container">
            {/* Toggle button for mobile view */}
            <button className="toggle-sidebar" onClick={() => setSidebarOpen(!sidebarOpen)}>
                ☰
            </button>

            {/* Conditional rendering for sidebar based on screen size */}
            <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <h2>Admin Panel</h2>
                <ul>
                    <li
                        onClick={() => handleTabClick('Departments')}
                        className={activeTab === 'Departments' ? 'active' : ''}
                    >
                        Departments
                    </li>
                    <li
                        onClick={() => handleTabClick('Categories')}
                        className={activeTab === 'Categories' ? 'active' : ''}
                    >
                        Categories
                    </li>
                    <li
                        onClick={() => handleTabClick('Articles')}
                        className={activeTab === 'Articles' ? 'active' : ''}
                    >
                        Articles
                    </li>
                    <li
                        onClick={() => handleTabClick('Users')}
                        className={activeTab === 'Users' ? 'active' : ''}
                    >
                        Users
                    </li>
                    <li
                        onClick={() => handleTabClick('Orders')}
                        className={activeTab === 'Orders' ? 'active' : ''}
                    >
                        Orders
                    </li>
                    <li
                        onClick={() => handleTabClick('OrderItems')}
                        className={activeTab === 'OrderItems' ? 'active' : ''}
                    >
                        OrderItems
                    </li>
                </ul>
            </nav>
            <div className="main-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default App;