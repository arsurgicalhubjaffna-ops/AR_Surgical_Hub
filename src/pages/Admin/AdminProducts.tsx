import React, { useState, useEffect } from 'react';
import insforge from '../../lib/insforge';
import { Plus, Pencil, Trash2, X, Image as ImageIcon, Search, Filter } from 'lucide-react';
import { Product, Category } from '../../types';

const emptyForm = { name: '', description: '', price: '', stock: '', category_id: '', image_url: '' };

const AdminProducts: React.FC = () => {
    const [products, setProducts] = useState<(Product & { category_name?: string | null })[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editId, setEditId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const load = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                insforge.database.from('products').select('*, categories(name)').order('created_at', { ascending: false }),
                insforge.database.from('categories').select('*').order('name', { ascending: true }),
            ]);
            const mapped = (productsRes.data || []).map((p: any) => ({
                ...p,
                category_name: p.categories?.name || null,
            }));
            setProducts(mapped);
            setCategories(categoriesRes.data || []);
        } catch (err) {
            console.error('Load Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => { setForm(emptyForm); setEditId(null); setModal(true); };
    const openEdit = (p: any) => {
        setForm({
            name: p.name,
            description: p.description || '',
            price: String(p.price),
            stock: String(p.stock),
            category_id: p.category_id || '',
            image_url: p.image_url || ''
        });
        setEditId(p.id);
        setModal(true);
    };

    const save = async () => {
        try {
            const payload = {
                name: form.name,
                description: form.description,
                price: Number(form.price),
                stock: Number(form.stock),
                category_id: form.category_id || null,
                image_url: form.image_url || null,
                is_active: true,
            };

            if (editId) {
                const { error } = await insforge.database
                    .from('products')
                    .update(payload)
                    .eq('id', editId);
                if (error) throw error;
            } else {
                const { error } = await insforge.database
                    .from('products')
                    .insert([payload]);
                if (error) throw error;
            }
            setModal(false);
            load();
        } catch (err) {
            alert('Failed to save product');
        }
    };

    const del = async (id: string) => {
        if (!confirm('Permanently delete this product from the catalog?')) return;
        const { error } = await insforge.database.from('products').delete().eq('id', id);
        if (error) { alert('Failed to delete product'); return; }
        load();
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-secondary italic animate-pulse">Loading procurement catalog...</div>;

    return (
        <div className="flex flex-col gap-6">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative flex-1 max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Search products or categories..."
                        className="w-full bg-white border border-brand-border rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:border-brand-green transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={openAdd}
                    className="inline-flex items-center gap-2 bg-brand-green text-white px-6 py-3 rounded-xl font-800 text-sm transition-all hover:bg-brand-green-dark shadow-lg shadow-brand-green/20"
                >
                    <Plus size={18} /> New Product
                </button>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[24px] border border-brand-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-brand-bg/50 border-b border-brand-border">
                                <th className="px-6 py-4 text-[0.7rem] font-800 text-brand-text-muted uppercase tracking-widest">Asset</th>
                                <th className="px-6 py-4 text-[0.7rem] font-800 text-brand-text-muted uppercase tracking-widest">Specifications</th>
                                <th className="px-6 py-4 text-[0.7rem] font-800 text-brand-text-muted uppercase tracking-widest">Category</th>
                                <th className="px-6 py-4 text-[0.7rem] font-800 text-brand-text-muted uppercase tracking-widest">Price</th>
                                <th className="px-6 py-4 text-[0.7rem] font-800 text-brand-text-muted uppercase tracking-widest">Stock Level</th>
                                <th className="px-6 py-4 text-[0.7rem] font-800 text-brand-text-muted uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {filteredProducts.map(p => (
                                <tr key={p.id} className="hover:bg-brand-bg/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="w-12 h-12 bg-brand-bg rounded-lg overflow-hidden border border-black/5 flex items-center justify-center">
                                            {p.image_url ? (
                                                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon size={20} className="text-gray-300" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-700 text-brand-text text-sm mb-0.5">{p.name}</p>
                                        <p className="text-[0.75rem] text-gray-400 line-clamp-1">{p.description}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-block bg-brand-bg px-2.5 py-1 rounded-md text-[0.75rem] font-700 text-brand-text-muted border border-brand-border">
                                            {p.category_name || 'Standard'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-800 text-brand-green text-sm">${Number(p.price).toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 max-w-[60px] h-1.5 bg-brand-bg rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${p.stock < 10 ? 'bg-brand-red' : 'bg-brand-green'}`}
                                                    style={{ width: `${Math.min((p.stock / 50) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                            <span className={`text-xs font-800 ${p.stock < 10 ? 'text-brand-red' : 'text-brand-text-muted'}`}>{p.stock}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEdit(p)}
                                                className="p-2 text-brand-text-muted hover:text-brand-green hover:bg-brand-green/5 rounded-lg transition-all"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => del(p.id)}
                                                className="p-2 text-brand-text-muted hover:text-brand-red hover:bg-brand-red/5 rounded-lg transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredProducts.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-4 text-brand-text-muted/30">
                            <Search size={32} />
                        </div>
                        <p className="text-brand-text-muted font-600">No products match your current search parameters.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {modal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
                    <div className="absolute inset-0 bg-brand-overlay backdrop-blur-sm" onClick={() => setModal(false)}></div>
                    <div className="relative bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="px-8 py-6 border-b border-brand-border flex justify-between items-center bg-brand-bg/50">
                            <h2 className="text-xl font-900 tracking-tighter text-brand-text">
                                {editId ? 'Refine Product' : 'Register New Asset'}
                            </h2>
                            <button onClick={() => setModal(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors text-brand-text-muted">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-800 text-brand-text-muted uppercase tracking-widest mb-2">Instrument Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 outline-none focus:border-brand-green font-600 text-brand-text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-800 text-brand-text-muted uppercase tracking-widest mb-2">Technical Description</label>
                                <textarea
                                    className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 outline-none focus:border-brand-green font-600 text-brand-text min-h-[100px] resize-none"
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-800 text-brand-text-muted uppercase tracking-widest mb-2">Unit Price ($)</label>
                                <input
                                    type="number"
                                    className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 outline-none focus:border-brand-green font-800 text-brand-green"
                                    value={form.price}
                                    onChange={e => setForm({ ...form, price: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-800 text-brand-text-muted uppercase tracking-widest mb-2">Stock Inventory</label>
                                <input
                                    type="number"
                                    className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 outline-none focus:border-brand-green font-600 text-brand-text"
                                    value={form.stock}
                                    onChange={e => setForm({ ...form, stock: e.target.value })}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-800 text-brand-text-muted uppercase tracking-widest mb-2">Classification / Category</label>
                                <select
                                    className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 outline-none focus:border-brand-green font-600 text-brand-text appearance-none"
                                    value={form.category_id}
                                    onChange={e => setForm({ ...form, category_id: e.target.value })}
                                >
                                    <option value="">Unclassified</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-800 text-brand-text-muted uppercase tracking-widest mb-2">Media Asset URL</label>
                                <div className="flex gap-4 items-center">
                                    <input
                                        type="text"
                                        className="flex-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-3 outline-none focus:border-brand-green font-500 text-[0.85rem] text-brand-text-muted"
                                        placeholder="https://assets.arsurgical.com/..."
                                        value={form.image_url}
                                        onChange={e => setForm({ ...form, image_url: e.target.value })}
                                    />
                                    <div className="w-12 h-12 rounded-xl bg-brand-bg flex items-center justify-center border border-black/5 shrink-0 overflow-hidden">
                                        {form.image_url ? <img src={form.image_url} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-gray-300" />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-6 bg-brand-bg/30 border-t border-brand-border flex justify-end gap-3">
                            <button
                                onClick={() => setModal(false)}
                                className="px-6 py-3 rounded-xl font-700 text-brand-text-muted hover:text-brand-text transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={save}
                                className="bg-brand-green text-white px-8 py-3 rounded-xl font-800 transition-all hover:bg-brand-green-dark shadow-lg shadow-brand-green/20"
                            >
                                {editId ? 'Apply Refinements' : 'Finalize Asset'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
