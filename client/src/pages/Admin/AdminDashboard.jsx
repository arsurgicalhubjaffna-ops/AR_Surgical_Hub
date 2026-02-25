import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Users, Package, DollarSign, TrendingUp, Clock } from 'lucide-react';

const API = 'http://localhost:5000/api';

const AdminDashboard = ({ token }) => {
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const headers = { Authorization: `Bearer ${token}` };
        Promise.all([
            axios.get(`${API}/admin/stats`, { headers }),
            axios.get(`${API}/admin/orders`, { headers }),
        ]).then(([statsRes, ordersRes]) => {
            setStats(statsRes.data);
            setOrders(ordersRes.data.slice(0, 5));
        }).catch(console.error).finally(() => setLoading(false));
    }, [token]);

    if (loading) return <div className="admin-loading">Loading dashboard...</div>;

    return (
        <div>
            <div className="admin-stats-grid">
                <div className="stat-card">
                    <div className="stat-icon blue"><Package size={24} /></div>
                    <div className="stat-info">
                        <h3>Products</h3>
                        <p>{stats?.products || 0}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green"><Users size={24} /></div>
                    <div className="stat-info">
                        <h3>Users</h3>
                        <p>{stats?.users || 0}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon purple"><ShoppingBag size={24} /></div>
                    <div className="stat-info">
                        <h3>Orders</h3>
                        <p>{stats?.orders || 0}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon yellow"><DollarSign size={24} /></div>
                    <div className="stat-info">
                        <h3>Revenue</h3>
                        <p>${Number(stats?.revenue || 0).toFixed(0)}</p>
                    </div>
                </div>
            </div>

            <div className="admin-table-card">
                <div className="admin-table-header">
                    <h2>Recent Orders</h2>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Last 5 orders</span>
                </div>
                {orders.length === 0 ? (
                    <div className="empty-state">No orders yet.</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(o => (
                                <tr key={o.id}>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{o.id.slice(0, 8)}...</td>
                                    <td>{o.full_name || o.email || 'Guest'}</td>
                                    <td>${Number(o.total_amount).toFixed(2)}</td>
                                    <td><span className={`badge badge-${o.status}`}>{o.status}</span></td>
                                    <td>{new Date(o.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
