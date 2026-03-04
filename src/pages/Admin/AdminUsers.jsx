import React, { useState, useEffect } from 'react';
import insforge from '../../lib/insforge';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data, error } = await insforge.db
                    .from('users')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (error) throw error;
                setUsers(data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

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
