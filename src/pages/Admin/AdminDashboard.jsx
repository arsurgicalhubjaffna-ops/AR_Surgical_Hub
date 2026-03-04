import React, { useState, useEffect } from 'react';
import insforge from '../../lib/insforge';
import { ShoppingBag, Users, Package, DollarSign, TrendingUp, Clock } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                // Fetch counts in parallel
                const [productsRes, usersRes, ordersRes] = await Promise.all([
                    insforge.db.from('products').select('id', { count: 'exact', head: true }),
                    insforge.db.from('users').select('id', { count: 'exact', head: true }),
                    insforge.db.from('orders').select('id, total_amount, payment_status'),
                ]);

                const totalOrders = ordersRes.data?.length || 0;
                const revenue = (ordersRes.data || [])
                    .filter(o => o.payment_status === 'paid')
                    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

                setStats({
                    products: productsRes.count || 0,
                    users: usersRes.count || 0,
                    orders: totalOrders,
                    revenue: revenue,
                });

                // Fetch recent orders with user info
                const { data: recentOrders } = await insforge.db
                    .from('orders')
                    .select('*, users(full_name, email)')
                    .order('created_at', { ascending: false })
                    .limit(5);

                const mapped = (recentOrders || []).map(o => ({
                    ...o,
                    full_name: o.users?.full_name || null,
                    email: o.users?.email || null,
                }));
                setOrders(mapped);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

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
