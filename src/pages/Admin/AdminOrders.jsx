import React, { useState, useEffect } from 'react';
import insforge from '../../lib/insforge';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            const { data, error } = await insforge.db
                .from('orders')
                .select('*, users(full_name, email)')
                .order('created_at', { ascending: false });
            if (error) throw error;
            const mapped = (data || []).map(o => ({
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

    useEffect(() => { load(); }, []);

    const updateStatus = async (id, status) => {
        try {
            const { error } = await insforge.db
                .from('orders')
                .update({ status })
                .eq('id', id);
            if (error) throw error;
            load();
        } catch (err) {
            alert('Failed to update order status');
        }
    };

    if (loading) return <div className="admin-loading">Loading orders...</div>;

    return (
        <div className="admin-table-card">
            <div className="admin-table-header">
                <h2>All Orders ({orders.length})</h2>
            </div>
            {orders.length === 0 ? (
                <div className="empty-state">No orders found.</div>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Payment</th>
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
                                <td><span className={`badge badge-${o.payment_status === 'paid' ? 'delivered' : 'pending'}`}>{o.payment_status}</span></td>
                                <td>
                                    <select
                                        className="status-select"
                                        value={o.status}
                                        onChange={e => updateStatus(o.id, e.target.value)}
                                    >
                                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </td>
                                <td>{new Date(o.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminOrders;
