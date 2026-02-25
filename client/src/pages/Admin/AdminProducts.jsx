import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

const API = 'http://localhost:5000/api';

const emptyForm = { name: '', description: '', price: '', stock: '', category_id: '', image_url: '' };

const AdminProducts = ({ token }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editId, setEditId] = useState(null);

    const headers = { Authorization: `Bearer ${token}` };

    const load = () => {
        Promise.all([
            axios.get(`${API}/admin/products`, { headers }),
            axios.get(`${API}/admin/categories`, { headers }),
        ]).then(([pr, cr]) => {
            setProducts(pr.data);
            setCategories(cr.data);
        }).finally(() => setLoading(false));
    };

    useEffect(load, []);

    const openAdd = () => { setForm(emptyForm); setEditId(null); setModal(true); };
    const openEdit = (p) => {
        setForm({ name: p.name, description: p.description, price: p.price, stock: p.stock, category_id: p.category_id, image_url: p.image_url });
        setEditId(p.id);
        setModal(true);
    };

    const save = async () => {
        try {
            if (editId) {
                await axios.put(`${API}/admin/products/${editId}`, { ...form, is_active: 1 }, { headers });
            } else {
                await axios.post(`${API}/admin/products`, form, { headers });
            }
            setModal(false);
            load();
        } catch (err) {
            alert('Failed to save product');
        }
    };

    const del = async (id) => {
        if (!confirm('Delete this product?')) return;
        await axios.delete(`${API}/admin/products/${id}`, { headers });
        load();
    };

    if (loading) return <div className="admin-loading">Loading products...</div>;

    return (
        <div>
            <div className="admin-table-card">
                <div className="admin-table-header">
                    <h2>Products ({products.length})</h2>
                    <button className="btn-primary action-btn action-btn-save" onClick={openAdd}>
                        <Plus size={16} /> Add Product
                    </button>
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id}>
                                <td><img src={p.image_url} alt={p.name} className="product-image-thumb" onError={(e) => e.target.style.display = 'none'} /></td>
                                <td>{p.name}</td>
                                <td>{p.category_name || '—'}</td>
                                <td>${Number(p.price).toFixed(2)}</td>
                                <td>{p.stock}</td>
                                <td>
                                    <button className="action-btn action-btn-edit" onClick={() => openEdit(p)}><Pencil size={13} /> Edit</button>
                                    <button className="action-btn action-btn-delete" onClick={() => del(p.id)}><Trash2 size={13} /> Delete</button>
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
                            <h2 style={{ margin: 0 }}>{editId ? 'Edit Product' : 'Add Product'}</h2>
                            <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={20} /></button>
                        </div>
                        {['name', 'description', 'price', 'stock', 'image_url'].map(field => (
                            <div className="form-group" key={field}>
                                <label>{field.replace('_', ' ')}</label>
                                {field === 'description'
                                    ? <textarea value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} />
                                    : <input type={['price', 'stock'].includes(field) ? 'number' : 'text'} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} />
                                }
                            </div>
                        ))}
                        <div className="form-group">
                            <label>Category</label>
                            <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
                                <option value="">Select category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setModal(false)}>Cancel</button>
                            <button className="btn-primary action-btn action-btn-save" onClick={save}>
                                {editId ? 'Save Changes' : 'Add Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
