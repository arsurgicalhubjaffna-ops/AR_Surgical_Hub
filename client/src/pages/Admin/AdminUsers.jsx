import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const AdminUsers = ({ token }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API}/admin/users`, { Authorization: `Bearer ${token}` }
            ? { headers: { Authorization: `Bearer ${token}` } }
            : {}
        ).then(r => setUsers(r.data)).finally(() => setLoading(false));
    }, [token]);

    if (loading) return <div className="admin-loading">Loading users...</div>;

    return (
        <div className="admin-table-card">
            <div className="admin-table-header">
                <h2>Registered Users ({users.length})</h2>
            </div>
            {users.length === 0 ? (
                <div className="empty-state">No users yet.</div>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td>{u.full_name}</td>
                                <td>{u.email}</td>
                                <td>{u.phone || '—'}</td>
                                <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                                <td>{new Date(u.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminUsers;
