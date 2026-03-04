import React, { useState, useEffect } from 'react';
import insforge from '../../lib/insforge';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

const emptyForm = { name: '', description: '', image_url: '' };

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editId, setEditId] = useState(null);

    const load = async () => {
        try {
            const { data, error } = await insforge.db
                .from('categories')
                .select('*')
                .order('name', { ascending: true });
            if (error) throw error;
            setCategories(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => { setForm(emptyForm); setEditId(null); setModal(true); };
    const openEdit = (c) => {
        setForm({ name: c.name, description: c.description || '', image_url: c.image_url || '' });
        setEditId(c.id);
        setModal(true);
    };

    const save = async () => {
        try {
            const payload = {
                name: form.name,
                description: form.description || null,
                image_url: form.image_url || null,
            };

            if (editId) {
                const { error } = await insforge.db
                    .from('categories')
                    .update(payload)
                    .eq('id', editId);
                if (error) throw error;
            } else {
                const { error } = await insforge.db
                    .from('categories')
                    .insert([payload]);
                if (error) throw error;
            }
            setModal(false);
            load();
        } catch (err) {
            alert('Failed to save category');
        }
    };

    const del = async (id) => {
        if (!confirm('Delete this category? Products in this category might become unlinked.')) return;
        try {
            const { error } = await insforge.db.from('categories').delete().eq('id', id);
            if (error) throw error;
            load();
        } catch (err) {
            alert('Failed to delete category');
        }
    };

    if (loading) return <div className="admin-loading">Loading categories...</div>;

    return (
        <div>
            <div className="admin-table-card">
                <div className="admin-table-header">
                    <h2>Categories ({categories.length})</h2>
                    <button className="btn-primary action-btn action-btn-save" onClick={openAdd}>
                        <Plus size={16} /> Add Category
                    </button>
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(c => (
                            <tr key={c.id}>
                                <td>
                                    {c.image_url ? (
                                        <img src={c.image_url} alt={c.name} className="product-image-thumb" onError={(e) => e.target.style.display = 'none'} />
                                    ) : '—'}
                                </td>
                                <td style={{ fontWeight: 600 }}>{c.name}</td>
                                <td>{c.description || '—'}</td>
                                <td>
                                    <button className="action-btn action-btn-edit" onClick={() => openEdit(c)}><Pencil size={13} /> Edit</button>
                                    <button className="action-btn action-btn-delete" onClick={() => del(c.id)}><Trash2 size={13} /> Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modal && (
                <div className="admin-modal-overlay" onClick={() => setModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ margin: 0 }}>{editId ? 'Edit Category' : 'Add Category'}</h2>
                            <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={20} /></button>
                        </div>

                        <div className="form-group">
                            <label>Category Name</label>
                            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., Surgical Instruments" />
                        </div>

                        <div className="form-group">
                            <label>Description (Optional)</label>
                            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Briefly describe this category..." />
                        </div>

                        <div className="form-group">
                            <label>Icon/Image URL (Optional)</label>
                            <input type="text" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://example.com/icon.svg" />
                        </div>

                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setModal(false)}>Cancel</button>
                            <button className="btn-primary action-btn action-btn-save" onClick={save} disabled={!form.name}>
                                {editId ? 'Save Changes' : 'Create Category'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
