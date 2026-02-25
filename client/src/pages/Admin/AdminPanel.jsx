import React, { useState } from 'react';
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import './Admin.css';

const NAV_ITEMS = [
    { key: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    { key: 'products', label: 'Products', Icon: Package },
    { key: 'orders', label: 'Orders', Icon: ShoppingBag },
    { key: 'users', label: 'Users', Icon: Users },
];

const PAGE_TITLES = {
    dashboard: 'Dashboard',
    products: 'Product Management',
    orders: 'Order Management',
    users: 'User Management',
};

const AdminPanel = () => {
    const [activePage, setActivePage] = useState('dashboard');
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const renderPage = () => {
        const props = { token };
        switch (activePage) {
            case 'dashboard': return <AdminDashboard {...props} />;
            case 'products': return <AdminProducts {...props} />;
            case 'orders': return <AdminOrders {...props} />;
            case 'users': return <AdminUsers {...props} />;
            default: return <AdminDashboard {...props} />;
        }
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src="/ar.svg" alt="AR Surgical Hub" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
                        <div>
                            <h2>AR Surgical Hub</h2>
                            <span>Admin Panel</span>
                        </div>
                    </div>
                </div>
                <nav className="admin-nav">
                    {NAV_ITEMS.map(({ key, label, Icon }) => (
                        <button
                            key={key}
                            className={`admin-nav-item ${activePage === key ? 'active' : ''}`}
                            onClick={() => setActivePage(key)}
                        >
                            <Icon size={18} />
                            {label}
                        </button>
                    ))}
                </nav>
                <div className="admin-sidebar-footer">
                    <button className="admin-nav-item" onClick={handleLogout}>
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <div className="admin-topbar">
                    <h1>{PAGE_TITLES[activePage]}</h1>
                    <div className="admin-user-badge">
                        👤 {user?.full_name || user?.email}
                        <span style={{ background: 'rgba(99,179,237,0.2)', borderRadius: '20px', padding: '2px 8px', fontSize: '0.72rem', color: '#63b3ed' }}>Admin</span>
                    </div>
                </div>
                <div className="admin-content">
                    {renderPage()}
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;
