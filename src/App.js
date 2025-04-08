import React, { useState } from 'react';
import { DepartmentsList } from './features/departments/DepartmentsList';
import { CategoriesList } from './features/categories/CategoriesList';
import { ArticlesList } from './features/articles/ArticlesList';
import { UsersList } from './features/users/UsersList';
import { OrdersList } from './features/orders/OrdersList';
import { OrderItemsList } from './features/orderitems/OrderItemsList';
import { PendingCommentsList } from './features/comments/PendingCommentsList';
import './App.css';

const Sidebar = ({ activeTab, onTabClick, sidebarOpen, toggleSidebar }) => (
    <>
        <button className="toggle-sidebar" onClick={toggleSidebar}>
            ☰
        </button>
        <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <h2>Admin Panel</h2>
            <ul>
                {['Departments', 'Categories', 'Articles', 'Users', 'Orders', 'OrderItems', 'PendingComments'].map((tab) => (
                    <li
                        key={tab}
                        onClick={() => onTabClick(tab)}
                        className={activeTab === tab ? 'active' : ''}
                    >
                        {tab}
                    </li>
                ))}
            </ul>
        </nav>
    </>
);

const App = () => {
    const [activeTab, setActiveTab] = useState('Departments');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
        setSidebarOpen(window.innerWidth <= 768 ? false : sidebarOpen);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Departments': return <DepartmentsList />;
            case 'Categories': return <CategoriesList />;
            case 'Articles': return <ArticlesList />;
            case 'Users': return <UsersList />;
            case 'Orders': return <OrdersList />;
            case 'OrderItems': return <OrderItemsList />;
            case 'PendingComments': return <PendingCommentsList />;
            default: return <DepartmentsList />;
        }
    };

    return (
        <div className="admin-container">
            <Sidebar activeTab={activeTab} onTabClick={handleTabClick} sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="main-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default App;