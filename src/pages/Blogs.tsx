import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, ArrowRight, Clock, User, Tag } from 'lucide-react';
import insforge from '../lib/insforge';
import ProductImage from '../components/ProductImage';
import { Blog } from '../types';

const Blogs: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const { data, error } = await insforge.database
                    .from('blogs')
                    .select('*')
                    .eq('is_published', true)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setBlogs(data || []);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const tags = Array.from(new Set(blogs.map(b => b.tag).filter(Boolean))) as string[];

    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = selectedTag ? blog.tag === selectedTag : true;
        return matchesSearch && matchesTag;
    });

    // Formatting date
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="bg-brand-bg min-h-screen pb-20">
            {/* Header / Hero */}
            <div className="bg-brand-green text-white py-16 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 z-0"></div>
                <div className="max-w-[1400px] mx-auto px-5 md:px-10 relative z-10 text-center">
                    <span className="inline-block bg-white/20 px-4 py-1.5 rounded-full text-sm font-700 tracking-widest uppercase mb-4 backdrop-blur-sm">
                        Knowledge Hub
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-900 tracking-tighter mb-4">
                        Medical Insights & News
                    </h1>
                    <p className="text-white/80 max-w-2xl mx-auto text-lg md:text-xl font-500">
                        Stay updated with the latest advancements in surgical technology, medical standards, and industry best practices.
                    </p>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-5 md:px-10 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start">

                    {/* Main Content Area */}
                    <div>
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-[24px] border border-black/5 overflow-hidden animate-pulse">
                                        <div className="h-56 bg-gray-200"></div>
                                        <div className="p-6">
                                            <div className="w-20 h-4 bg-brand-green/20 rounded mb-4"></div>
                                            <div className="w-3/4 h-6 bg-gray-200 rounded mb-2"></div>
                                            <div className="w-1/2 h-6 bg-gray-200 rounded mb-4"></div>
                                            <div className="w-full h-16 bg-gray-100 rounded mb-6"></div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                                                <div className="w-24 h-4 bg-gray-200 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredBlogs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {filteredBlogs.map(blog => (
                                    <article key={blog.id} className="bg-white rounded-[24px] border border-black/5 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
                                        <Link to={`/blog/${blog.id}`} className="block relative aspect-video overflow-hidden shrink-0 bg-gray-100">
                                            <ProductImage
                                                src={blog.featured_image}
                                                alt={blog.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            {blog.tag && (
                                                <span className="absolute top-4 left-4 bg-brand-green text-white text-[0.7rem] font-800 uppercase tracking-widest px-3 py-1 rounded-md shadow-md z-10 transition-transform group-hover:scale-105">
                                                    {blog.tag}
                                                </span>
                                            )}
                                        </Link>

                                        <div className="p-6 md:p-8 flex flex-col flex-1">
                                            <div className="flex items-center gap-4 text-xs font-600 text-gray-400 mb-4 uppercase tracking-wider">
                                                <span className="flex items-center gap-1.5"><Clock size={14} /> {formatDate(blog.created_at)}</span>
                                            </div>

                                            <h2 className="text-xl md:text-2xl font-800 text-brand-text leading-tight mb-4 group-hover:text-brand-green transition-colors line-clamp-2">
                                                <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                                            </h2>

                                            <p className="text-secondary mb-6 line-clamp-3 text-[0.95rem] leading-relaxed flex-1">
                                                {/* Strip markdown/html tags for preview */}
                                                {blog.content.replace(/[#*>_~`-]/g, '').substring(0, 150)}...
                                            </p>

                                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-black/5">
                                                <div className="flex items-center gap-3">
                                                    {blog.author_image ? (
                                                        <img src={blog.author_image} alt={blog.author_name} className="w-10 h-10 rounded-full object-cover border-2 border-brand-green/20" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center font-800 uppercase text-sm border-2 border-brand-green/20">
                                                            {blog.author_name.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <span className="block text-sm font-800 text-brand-text leading-none mb-1">{blog.author_name}</span>
                                                        <span className="block text-xs font-600 text-gray-400">Author</span>
                                                    </div>
                                                </div>

                                                <Link
                                                    to={`/blog/${blog.id}`}
                                                    className="w-10 h-10 rounded-full bg-brand-bg flex items-center justify-center text-brand-text group-hover:bg-brand-green group-hover:text-white transition-colors"
                                                >
                                                    <ArrowRight size={18} />
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[24px] border border-black/5 p-12 text-center text-brand-text flex flex-col items-center justify-center min-h-[400px]">
                                <Search size={48} className="text-gray-300 mb-6" />
                                <h3 className="text-2xl font-800 tracking-tight mb-2">No articles found</h3>
                                <p className="text-secondary max-w-md mx-auto mb-6">
                                    We couldn't find any articles matching your current filters. Try adjusting your search term or selecting a different category.
                                </p>
                                {(searchTerm || selectedTag) && (
                                    <button
                                        onClick={() => { setSearchTerm(''); setSelectedTag(null); }}
                                        className="inline-flex items-center gap-2 bg-brand-green text-white px-6 py-3 rounded-xl font-700 transition-all hover:bg-brand-green-dark"
                                    >
                                        Clear all filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="sticky top-32 space-y-8">
                        {/* Search Widget */}
                        <div className="bg-white rounded-[24px] border border-black/5 p-6 shadow-sm">
                            <h3 className="text-lg font-800 tracking-tight mb-4 flex items-center gap-2">
                                <Search size={18} className="text-brand-green" /> Search
                            </h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-brand-bg border border-black/5 rounded-xl pr-4 pl-10 py-3 text-[0.95rem] font-500 outline-none focus:border-brand-green transition-colors"
                                />
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {/* Categories/Tags Widget */}
                        <div className="bg-white rounded-[24px] border border-black/5 p-6 shadow-sm">
                            <h3 className="text-lg font-800 tracking-tight mb-4 flex items-center gap-2">
                                <Tag size={18} className="text-brand-green" /> Categories
                            </h3>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => setSelectedTag(null)}
                                    className={`flex items-center justify-between w-full p-3 rounded-xl text-left border transition-all ${selectedTag === null ? 'bg-brand-green text-white border-brand-green font-700 shadow-md shadow-brand-green/20' : 'bg-transparent text-gray-600 border-black/5 hover:border-brand-green hover:text-brand-green font-500 hover:bg-brand-green/5'}`}
                                >
                                    <span>All Articles</span>
                                    <ChevronRight size={16} className={selectedTag === null ? "text-white/70" : "text-gray-400"} />
                                </button>
                                {tags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => setSelectedTag(tag)}
                                        className={`flex items-center justify-between w-full p-3 rounded-xl text-left border transition-all ${selectedTag === tag ? 'bg-brand-green text-white border-brand-green font-700 shadow-md shadow-brand-green/20' : 'bg-transparent text-gray-600 border-black/5 hover:border-brand-green hover:text-brand-green font-500 hover:bg-brand-green/5'}`}
                                    >
                                        <span>{tag}</span>
                                        <ChevronRight size={16} className={selectedTag === tag ? "text-white/70" : "text-gray-400"} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Promo Widget */}
                        <div className="bg-brand-green rounded-[24px] p-6 text-white shadow-xl shadow-brand-green/20 relative overflow-hidden group">
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                            <h3 className="text-xl font-900 tracking-tighter mb-2 relative z-10">Premium Surgical Equipment</h3>
                            <p className="text-white/80 text-sm mb-6 relative z-10">Discover our range of ISO certified sterile instruments for precise surgical maneuvers.</p>
                            <Link to="/shop" className="inline-flex items-center justify-center w-full bg-white text-brand-green px-6 py-3 rounded-xl font-800 transition-transform hover:-translate-y-1 relative z-10 shadow-lg">
                                Shop Now
                            </Link>
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
};

export default Blogs;
