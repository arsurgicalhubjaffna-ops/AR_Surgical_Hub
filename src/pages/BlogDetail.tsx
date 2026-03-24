import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, Tag, Calendar, Share2, Facebook, Twitter, Linkedin, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import insforge from '../lib/insforge';
import ProductImage from '../components/ProductImage';
import { Blog } from '../types';

const BlogDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        const fetchBlogDetails = async () => {
            if (!id) return;

            try {
                // Fetch main blog
                const { data, error } = await insforge.database
                    .from('blogs')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error || !data || !data.is_published) {
                    navigate('/blogs');
                    return;
                }

                setBlog(data);

                // Fetch related blogs (same tag, excluding current)
                if (data.tag) {
                    const { data: relatedData } = await insforge.database
                        .from('blogs')
                        .select('*')
                        .eq('is_published', true)
                        .eq('tag', data.tag)
                        .neq('id', id)
                        .limit(3);

                    if (relatedData) setRelatedBlogs(relatedData);
                }
            } catch (error) {
                console.error('Error fetching blog details:', error);
                navigate('/blogs');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogDetails();
        window.scrollTo(0, 0);
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="bg-brand-bg min-h-screen py-20 px-5 flex justify-center">
                <div className="max-w-4xl w-full animate-pulse">
                    <div className="w-32 h-6 bg-gray-200 rounded mb-8"></div>
                    <div className="w-full max-w-2xl h-16 bg-gray-200 rounded mb-6"></div>
                    <div className="flex gap-4 mb-10">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                            <div className="w-32 h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="w-24 h-4 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                    <div className="w-full aspect-[21/9] bg-gray-200 rounded-[24px] mb-12"></div>
                    <div className="space-y-4">
                        <div className="w-full h-4 bg-gray-200 rounded"></div>
                        <div className="w-full h-4 bg-gray-200 rounded"></div>
                        <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!blog) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
    };

    const shareUrl = encodeURIComponent(window.location.href);
    const shareTitle = encodeURIComponent(blog.title);

    return (
        <div className="bg-white min-h-screen">
            <article className="max-w-[1000px] mx-auto px-5 md:px-10 py-12 md:py-20">
                {/* Back Link */}
                <Link to="/blogs" className="inline-flex items-center gap-2 text-sm font-700 text-gray-500 hover:text-brand-green transition-colors mb-8 md:mb-12">
                    <ArrowLeft size={16} className="text-brand-green" /> Back to Hub
                </Link>

                {/* Header ... (rest of the file) */}

                {/* Header */}
                <header className="mb-10 md:mb-14 text-center md:text-left">
                    {blog.tag && (
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
                            <span className="inline-flex flex-row items-center gap-1.5 px-3.5 py-1.5 bg-brand-green/10 text-brand-green rounded-lg text-xs font-800 uppercase tracking-widest border border-brand-green/20">
                                <Tag size={13} /> {blog.tag}
                            </span>
                        </div>
                    )}

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-900 tracking-tighter text-brand-text leading-[1.1] mb-8">
                        {blog.title}
                    </h1>

                    <div className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-6 pt-6 border-t border-black/5">
                        <div className="flex items-center gap-3">
                            {blog.author_image ? (
                                <img src={blog.author_image} alt={blog.author_name} className="w-12 h-12 rounded-full object-cover border-2 border-brand-green/20" />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center font-800 text-lg uppercase border-2 border-brand-green/20">
                                    {blog.author_name.charAt(0)}
                                </div>
                            )}
                            <div className="text-left">
                                <span className="block font-800 text-brand-text mb-0.5">{blog.author_name}</span>
                                <span className="block text-xs font-600 text-gray-500">Author & Content Creator</span>
                            </div>
                        </div>

                        <div className="hidden sm:block w-[1px] h-10 bg-black/10"></div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-gray-600 font-500 text-sm">
                                <Calendar size={18} className="text-brand-green" />
                                {formatDate(blog.created_at)}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 font-500 text-sm">
                                <Clock size={18} className="text-brand-green" />
                                {Math.max(1, Math.ceil(blog.content.length / 500))} min read
                            </div>
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                <div className="w-full aspect-video md:aspect-[21/9] rounded-[24px] md:rounded-[32px] overflow-hidden mb-12 md:mb-16 shadow-2xl">
                    <ProductImage
                        src={blog.featured_image}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Main Content & Share */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-12 lg:gap-20">
                    <div className="prose prose-lg md:prose-xl max-w-none prose-headings:font-900 prose-headings:tracking-tight prose-headings:text-brand-text prose-a:text-brand-green hover:prose-a:text-brand-green-dark prose-img:rounded-2xl prose-img:shadow-lg prose-hr:border-black/10">
                        <ReactMarkdown>{blog.content}</ReactMarkdown>
                    </div>

                    {/* Share Sidebar */}
                    <aside className="lg:sticky lg:top-32 space-y-6 self-start border-t lg:border-t-0 lg:border-l border-black/5 pt-8 lg:pt-0 lg:pl-8">
                        <div className="text-center lg:text-left">
                            <h3 className="font-800 tracking-tight text-brand-text mb-4 text-sm uppercase">Share this article</h3>
                            <div className="flex justify-center lg:justify-start gap-3">
                                <a 
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-brand-bg border border-black/5 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
                                >
                                    <Facebook size={18} />
                                </a>
                                <a 
                                    href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-brand-bg border border-black/5 flex items-center justify-center text-sky-500 hover:bg-sky-50 transition-colors"
                                >
                                    <Twitter size={18} />
                                </a>
                                <a 
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-brand-bg border border-black/5 flex items-center justify-center text-blue-800 hover:bg-blue-50 transition-colors"
                                >
                                    <Linkedin size={18} />
                                </a>
                                <button onClick={copyLink} className="w-10 h-10 rounded-full bg-brand-bg border border-black/5 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors hover:text-brand-text" title="Copy Link">
                                    <Copy size={18} />
                                </button>
                            </div>
                        </div>

                        {blog.tag && (
                            <div className="text-center lg:text-left pt-6 lg:border-t border-black/5">
                                <h3 className="font-800 tracking-tight text-brand-text mb-3 text-sm uppercase">Filed under</h3>
                                <div className="inline-flex bg-brand-bg border border-black/5 text-brand-text text-sm font-600 px-4 py-1.5 rounded-lg hover:border-brand-green/30 transition-colors cursor-pointer">
                                    {blog.tag}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </article>

            {/* Related Articles */}
            {relatedBlogs.length > 0 && (
                <section className="bg-brand-bg py-20 px-5 md:px-10 border-t border-black/5">
                    <div className="max-w-[1400px] mx-auto">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-3xl font-900 tracking-tight text-brand-text">Related Articles</h2>
                            <Link to="/blogs" className="hidden sm:inline-flex items-center gap-2 text-brand-green font-700 hover:text-brand-green-dark transition-colors">
                                View Selection <ArrowLeft className="rotate-180" size={16} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedBlogs.map(b => (
                                <Link to={`/blog/${b.id}`} key={b.id} className="bg-white rounded-[24px] border border-black/5 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                                    <div className="relative aspect-video overflow-hidden shrink-0 bg-gray-100">
                                        <ProductImage
                                            src={b.featured_image}
                                            alt={b.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-800 text-brand-text leading-snug mb-3 group-hover:text-brand-green transition-colors line-clamp-2">
                                            {b.title}
                                        </h3>
                                        <p className="text-secondary line-clamp-2 text-sm leading-relaxed mt-auto">
                                            {b.content.replace(/[#*>_~`-]/g, '').substring(0, 100)}...
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default BlogDetail;
