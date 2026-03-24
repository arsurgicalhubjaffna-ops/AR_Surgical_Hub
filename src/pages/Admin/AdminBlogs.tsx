import React, { useState, useEffect } from 'react';
import insforge from '../../lib/insforge';
import { Plus, Pencil, Trash2, X, Image as ImageIcon, Search, CheckCircle2, Globe, FileText, ToggleLeft, ToggleRight, Upload, RefreshCw, User } from 'lucide-react';
import toast from 'react-hot-toast';
import ProductImage from '../../components/ProductImage';
import { Blog } from '../../types';

const emptyForm: Omit<Blog, 'id' | 'created_at' | 'updated_at'> = {
    title: '',
    content: '',
    author_name: '',
    author_image: '',
    featured_image: '',
    tag: '',
    is_published: false
};

const AdminBlogs: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editId, setEditId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [uploading, setUploading] = useState<string | null>(null);

    const load = async () => {
        try {
            const { data, error } = await insforge.database
                .from('blogs')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setBlogs(data || []);
        } catch (err) {
            console.error('Blog Load Error:', err);
            toast.error('Failed to sync blogs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => { setForm(emptyForm); setEditId(null); setModal(true); };
    const openEdit = (b: Blog) => {
        setForm({
            title: b.title,
            content: b.content,
            author_name: b.author_name,
            author_image: b.author_image || '',
            featured_image: b.featured_image || '',
            tag: b.tag || '',
            is_published: b.is_published
        });
        setEditId(b.id);
        setModal(true);
    };

    const handleImageUpload = async (field: 'featured_image' | 'author_image', e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(field);
        try {
            const { data, error } = await insforge.storage
                .from('blog_assets')
                .upload(`${Date.now()}_${file.name}`, file);

            if (error || !data) throw error || new Error('Upload failed');
            setForm(prev => ({ ...prev, [field]: data.url }));
            toast.success('Image uploaded successfully');
        } catch (err) {
            console.error('Upload Error:', err);
            toast.error('Failed to upload image');
        } finally {
            setUploading(null);
        }
    };

    const save = async () => {
        try {
            const payload = {
                title: form.title,
                content: form.content,
                author_name: form.author_name,
                author_image: form.author_image || null,
                featured_image: form.featured_image || null,
                tag: form.tag || null,
                is_published: form.is_published,
                updated_at: new Date().toISOString()
            };

            if (editId) {
                const { error } = await insforge.database
                    .from('blogs')
                    .update(payload)
                    .eq('id', editId);
                if (error) throw error;
                toast.success('Blog post updated');
            } else {
                const { error } = await insforge.database
                    .from('blogs')
                    .insert([payload]);
                if (error) throw error;
                toast.success('New blog post created');
            }
            setModal(false);
            load();
        } catch (err) {
            toast.error('Failed to save blog');
        }
    };

    const del = async (id: string) => {
        if (!confirm('Delete this blog post?')) return;
        try {
            const { error } = await insforge.database.from('blogs').delete().eq('id', id);
            if (error) throw error;
            toast.success('Blog post deleted');
            load();
        } catch (err) {
            toast.error('Failed to delete blog');
        }
    };

    const togglePublish = async (b: Blog) => {
        try {
            const { error } = await insforge.database
                .from('blogs')
                .update({ is_published: !b.is_published, updated_at: new Date().toISOString() })
                .eq('id', b.id);
            if (error) throw error;
            toast.success(b.is_published ? 'Post set as draft' : 'Post published');
            load();
        } catch (e) {
            toast.error('Failed to update status');
        }
    };

    const filteredBlogs = blogs.filter(b =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-secondary italic animate-pulse">Syncing blogs...</div>;

    return (
        <div className="flex flex-col gap-6">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative flex-1 max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search blogs..."
                        className="w-full bg-white border border-black/5 rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:border-brand-green transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={openAdd}
                    className="inline-flex items-center gap-2 bg-brand-green text-white px-6 py-3 rounded-xl font-800 text-sm transition-all hover:bg-brand-green-dark shadow-lg shadow-brand-green/20"
                >
                    <Plus size={18} /> New Blog Post
                </button>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-brand-bg/50 border-b border-black/5">
                                <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest min-w-[300px]">Post</th>
                                <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                                <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest whitespace-nowrap">Author</th>
                                <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest whitespace-nowrap">Date</th>
                                <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {filteredBlogs.map(b => (
                                <tr key={b.id} className="hover:bg-brand-bg/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-12 bg-brand-bg rounded-lg border border-black/5 flex items-center justify-center overflow-hidden shrink-0">
                                                <ProductImage
                                                    src={b.featured_image}
                                                    alt={b.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-800 text-brand-text text-sm hover:text-brand-green transition-colors line-clamp-1">{b.title}</h3>
                                                {b.tag && (
                                                    <span className="inline-block mt-1 px-2 py-0.5 bg-brand-bg border border-black/5 rounded text-[0.65rem] font-700 text-gray-500 uppercase tracking-wider">
                                                        {b.tag}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <button
                                            onClick={() => togglePublish(b)}
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.75rem] font-800 tracking-tight transition-colors ${b.is_published ? 'bg-brand-green/10 text-brand-green hover:bg-brand-green/20' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                        >
                                            {b.is_published ? (
                                                <><CheckCircle2 size={12} /> Published</>
                                            ) : (
                                                <><Globe size={12} /> Draft</>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            {b.author_image ? (
                                                <img src={b.author_image} className="w-6 h-6 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center text-[0.6rem] font-800">
                                                    {b.author_name[0]}
                                                </div>
                                            )}
                                            <span className="text-sm font-600 text-brand-text whitespace-nowrap">{b.author_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-sm text-secondary font-500 whitespace-nowrap">
                                            {new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEdit(b)}
                                                className="p-2 text-gray-400 hover:text-brand-green hover:bg-brand-green/5 rounded-lg transition-all"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => del(b.id)}
                                                className="p-2 text-gray-400 hover:text-brand-red hover:bg-brand-red/5 rounded-lg transition-all"
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
                {filteredBlogs.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <FileText size={32} />
                        </div>
                        <p className="text-secondary font-600">No blog posts found.</p>
                        <p className="text-[0.85rem] text-gray-400 mt-2">Click "New Blog Post" to create one.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {modal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
                    <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm" onClick={() => setModal(false)}></div>
                    <div className="relative bg-white w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="px-8 py-6 border-b border-black/5 flex justify-between items-center bg-brand-bg/50 shrink-0">
                            <h2 className="text-xl font-900 tracking-tighter text-brand-text">
                                {editId ? 'Edit Blog Post' : 'New Blog Post'}
                            </h2>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setForm({ ...form, is_published: !form.is_published })}
                                    className="flex items-center gap-2 text-sm font-700"
                                    title={form.is_published ? "Unpublish" : "Publish"}
                                >
                                    <span className={form.is_published ? "text-brand-green" : "text-gray-400"}>
                                        {form.is_published ? "Published" : "Draft"}
                                    </span>
                                    {form.is_published ? (
                                        <ToggleRight size={28} className="text-brand-green" />
                                    ) : (
                                        <ToggleLeft size={28} className="text-gray-300" />
                                    )}
                                </button>
                                <button onClick={() => setModal(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors text-gray-400">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-8 flex-1 overflow-y-auto flex flex-col gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-800 text-gray-400 uppercase tracking-widest mb-2">Title <span className="text-brand-red">*</span></label>
                                    <input
                                        type="text"
                                        className="w-full bg-brand-bg border border-black/5 rounded-xl px-4 py-3 outline-none focus:border-brand-green font-700 text-brand-text"
                                        value={form.title}
                                        onChange={e => setForm({ ...form, title: e.target.value })}
                                        placeholder="Enter blog title"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-800 text-gray-400 uppercase tracking-widest mb-2">Category Tag</label>
                                    <input
                                        type="text"
                                        className="w-full bg-brand-bg border border-black/5 rounded-xl px-4 py-3 outline-none focus:border-brand-green font-500 text-brand-text"
                                        value={form.tag}
                                        onChange={e => setForm({ ...form, tag: e.target.value })}
                                        placeholder="e.g. Surgery, Equipment, Standards"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-800 text-gray-400 uppercase tracking-widest mb-2">Content (Markdown supported) <span className="text-brand-red">*</span></label>
                                <textarea
                                    className="w-full bg-brand-bg border border-black/5 rounded-xl px-4 py-4 outline-none focus:border-brand-green font-500 text-brand-text min-h-[300px] resize-y"
                                    value={form.content}
                                    onChange={e => setForm({ ...form, content: e.target.value })}
                                    placeholder="Write your blog post content here..."
                                    required
                                />
                            </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-800 text-gray-400 uppercase tracking-widest mb-2">Author Name <span className="text-brand-red">*</span></label>
                                        <input
                                            type="text"
                                            className="w-full bg-brand-bg border border-black/5 rounded-xl px-4 py-3 outline-none focus:border-brand-green font-500 text-brand-text"
                                            value={form.author_name}
                                            onChange={e => setForm({ ...form, author_name: e.target.value })}
                                            placeholder="e.g. Dr. John Doe"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-800 text-gray-400 uppercase tracking-widest mb-2">Author Avatar</label>
                                        <div className="flex gap-4 items-center">
                                            <label className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-700 text-sm cursor-pointer transition-all ${uploading === 'author_image' ? 'bg-gray-100 text-gray-400' : 'bg-white border border-black/10 text-brand-text hover:bg-brand-bg shadow-sm'}`}>
                                                {uploading === 'author_image' ? (
                                                    <RefreshCw size={16} className="animate-spin" />
                                                ) : (
                                                    <Upload size={16} />
                                                )}
                                                {uploading === 'author_image' ? 'Uploading...' : 'Upload Avatar'}
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload('author_image', e)}
                                                    disabled={uploading !== null}
                                                />
                                            </label>
                                            <div className="w-12 h-12 rounded-full bg-brand-bg flex items-center justify-center border border-black/5 shrink-0 overflow-hidden">
                                                {form.author_image ? <img src={form.author_image} className="w-full h-full object-cover" /> : <User size={20} className="text-gray-300" />}
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full mt-3 bg-brand-bg border border-black/5 rounded-xl px-4 py-2 outline-none focus:border-brand-green font-500 text-[0.75rem] text-secondary"
                                            placeholder="Or paste avatar URL..."
                                            value={form.author_image}
                                            onChange={e => setForm({ ...form, author_image: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-800 text-gray-400 uppercase tracking-widest mb-2">Featured Image</label>
                                    <div className="space-y-3">
                                        <label className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-700 text-sm cursor-pointer transition-all border-2 border-dashed ${uploading === 'featured_image' ? 'bg-gray-50 border-gray-200 text-gray-400' : 'bg-white border-black/5 text-gray-500 hover:border-brand-green hover:bg-brand-green/5 hover:text-brand-green'}`}>
                                            {uploading === 'featured_image' ? (
                                                <RefreshCw size={20} className="animate-spin text-brand-green" />
                                            ) : (
                                                <ImageIcon size={20} />
                                            )}
                                            {uploading === 'featured_image' ? 'Uploading content...' : 'Click to upload featured image'}
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload('featured_image', e)}
                                                disabled={uploading !== null}
                                            />
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full bg-brand-bg border border-black/5 rounded-xl px-4 py-2 outline-none focus:border-brand-green font-500 text-[0.75rem] text-secondary"
                                            placeholder="Or paste image URL..."
                                            value={form.featured_image}
                                            onChange={e => setForm({ ...form, featured_image: e.target.value })}
                                        />
                                        <div className="w-full h-32 rounded-xl bg-brand-bg border border-black/5 flex items-center justify-center overflow-hidden">
                                            <ProductImage
                                                src={form.featured_image}
                                                alt={form.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-6 bg-brand-bg/30 border-t border-black/5 flex justify-end gap-3 shrink-0">
                            <button
                                onClick={() => setModal(false)}
                                className="px-6 py-3 rounded-xl font-700 text-gray-400 hover:text-brand-text transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={save}
                                disabled={!form.title || !form.content || !form.author_name}
                                className="bg-brand-green text-white px-8 py-3 rounded-xl font-800 transition-all hover:bg-brand-green-dark shadow-lg shadow-brand-green/20 disabled:opacity-50"
                            >
                                {editId ? 'Save Changes' : 'Create Blog'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBlogs;
