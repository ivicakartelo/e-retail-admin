import React, { useState } from 'react';
import { DepartmentsList } from './features/departments/DepartmentsList';
import { CategoriesList } from './features/categories/CategoriesList';
import { ArticlesList } from './features/articles/ArticlesList';
import { UsersList } from './features/users/UsersList';
import { OrdersList } from './features/orders/OrdersList';
import { OrderItemsList } from './features/orderitems/OrderItemsList';
import { CommentsList } from './features/comments/CommentsList';
import './App.css';

const App = () => {
    const [activeTab, setActiveTab] = useState('Departments');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedArticleId, setSelectedArticleId] = useState(null);
    const [navigationHistory, setNavigationHistory] = useState(['Departments']);

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
        setNavigationHistory(prev => [...prev, tabName]);
        if (window.innerWidth <= 768) {
            setSidebarOpen(false);
        }
    };

    const handleArticleSelect = (articleId) => {
        setSelectedArticleId(articleId);
        handleTabClick('Comments');
    };

    const handleBack = () => {
        if (navigationHistory.length > 1) {
            const newHistory = [...navigationHistory];
            newHistory.pop();
            setNavigationHistory(newHistory);
            setActiveTab(newHistory[newHistory.length - 1]);
        }
    };

    const handleViewAllComments = () => {
        setSelectedArticleId(null);
        handleTabClick('Comments');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Departments':
                return <DepartmentsList />;
            case 'Categories':
                return <CategoriesList />;
            case 'Articles':
                return (
                    <>
                        <button 
                            onClick={handleViewAllComments}
                            className="view-all-comments-button"
                        >
                            View All Comments
                        </button>
                        <ArticlesList onArticleSelect={handleArticleSelect} />
                    </>
                );
            case 'Users':
                return <UsersList />;
            case 'Orders':
                return <OrdersList />;
            case 'OrderItems':
                return <OrderItemsList />;
            case 'Comments':
                return (
                    <div className="comments-view-container">
                        <button 
                            onClick={handleBack}
                            className="back-button"
                        >
                            ← Back to {navigationHistory[navigationHistory.length - 2] || 'Dashboard'}
                        </button>
                        {selectedArticleId ? (
                            <CommentsList 
                                articleId={selectedArticleId} 
                                onBackToList={() => handleTabClick('Articles')}
                            />
                        ) : (
                            <div className="no-article-selected">
                                <p>All Article Comments</p>
                                <button 
                                    onClick={() => handleTabClick('Articles')}
                                    className="browse-articles-button"
                                >
                                    Browse Articles
                                </button>
                            </div>
                        )}
                    </div>
                );
            default:
                return <DepartmentsList />;
        }
    };

    return (
        <div className="admin-container">
            <button 
                className="toggle-sidebar" 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle sidebar"
            >
                ☰
            </button>

            <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <h2>Admin Panel</h2>
                <ul>
                    {['Departments', 'Categories', 'Articles', 'Users', 'Orders', 'OrderItems', 'Comments'].map((tab) => (
                        <li
                            key={tab}
                            onClick={() => handleTabClick(tab)}
                            className={activeTab === tab ? 'active' : ''}
                            aria-current={activeTab === tab ? 'page' : undefined}
                        >
                            {tab}
                        </li>
                    ))}
                </ul>
            </nav>
            
            <div className="main-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default App;