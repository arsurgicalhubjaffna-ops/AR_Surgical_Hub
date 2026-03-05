import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import insforge from '../lib/insforge';
import ProductCard from '../components/ProductCard';
import { Product, Category, Subcategory } from '../types';

const Shop: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get('category');
    const subcategoryId = queryParams.get('subcategory');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch categories for sidebar
                const { data: catData } = await insforge.database
                    .from('categories')
                    .select('*')
                    .order('name', { ascending: true });
                setCategories(catData || []);

                // Fetch subcategories if a category is selected
                if (categoryId) {
                    const { data: subData } = await insforge.database
                        .from('subcategories')
                        .select('*')
                        .eq('category_id', categoryId)
                        .order('name', { ascending: true });
                    setSubcategories(subData || []);
                } else {
                    setSubcategories([]);
                }

                let query = insforge.database
                    .from('products')
                    .select('*, categories(name), subcategories(name)')
                    .eq('is_active', true)
                    .order('created_at', { ascending: false });

                if (categoryId) {
                    query = query.eq('category_id', categoryId);
                }
                if (subcategoryId) {
                    query = query.eq('subcategory_id', subcategoryId);
                }

                const { data, error } = await query;
                if (error) throw error;

                // Map category name for ProductCard compatibility
                const mapped = (data || []).map((p: any) => ({
                    ...p,
                    category_name: p.categories?.name || null,
                    subcategory_name: p.subcategories?.name || null,
                })) as Product[];

                setProducts(mapped);
            } catch (err) {
                console.error('Error fetching shop data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [categoryId, subcategoryId]);

    return (
        <div className="min-h-screen bg-brand-bg pb-20">
            {/* Header Area */}
            <div className="bg-brand-surface border-b border-brand-border py-10 md:py-16 mb-8">
                <div className="max-w-[1400px] mx-auto px-5 md:px-10 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-800 tracking-tighter text-brand-text mb-3">
                        Catalog <span className="text-brand-green">Instruments</span>
                    </h1>
                    <p className="text-brand-text-muted text-[1rem] md:text-[1.1rem] max-w-2xl">
                        Premium selection of medical-grade surgical tools and equipment for elite healthcare professionals.
                    </p>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-5 md:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 items-start">

                    {/* Sidebar Filters */}
                    <aside className="bg-brand-surface border border-brand-border rounded-xl p-6 sticky top-24 shadow-sm hidden lg:block">
                        <h3 className="text-[0.75rem] font-800 uppercase tracking-widest text-brand-text-muted mb-5 pb-3 border-b border-brand-border">
                            Categories
                        </h3>
                        <ul className="flex flex-col gap-1 list-none p-0 m-0">
                            <li key="all">
                                <Link
                                    to="/shop"
                                    className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200 border border-transparent no-underline ${!categoryId ? 'bg-brand-green-light text-brand-green border-brand-green/25 font-600' : 'text-secondary hover:bg-brand-bg hover:text-brand-text'}`}
                                >
                                    All Products
                                </Link>
                            </li>
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <Link
                                        to={`/shop?category=${cat.id}`}
                                        className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200 border border-transparent no-underline ${categoryId === cat.id && !subcategoryId ? 'bg-brand-green-light text-brand-green border-brand-green/25 font-600' : 'text-secondary hover:bg-brand-bg hover:text-brand-text'} ${categoryId === cat.id && subcategoryId ? 'text-brand-green font-600' : ''}`}
                                    >
                                        {cat.name}
                                    </Link>
                                    {categoryId === cat.id && subcategories.length > 0 && (
                                        <ul className="ml-4 mt-1 flex flex-col gap-1 list-none p-0 border-l-2 border-brand-green/20 pl-2">
                                            {subcategories.map(sub => (
                                                <li key={sub.id}>
                                                    <Link
                                                        to={`/shop?category=${cat.id}&subcategory=${sub.id}`}
                                                        className={`block px-3 py-1.5 rounded-lg text-[0.8rem] transition-all duration-200 no-underline ${subcategoryId === sub.id ? 'text-brand-green font-700 bg-brand-green/5' : 'text-gray-400 hover:text-brand-text'}`}
                                                    >
                                                        ↳ {sub.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </aside>

                    {/* Mobile Horizontal scroll for categories */}
                    <div className="lg:hidden mb-10 -mx-5 px-5">
                        <div className="flex flex-col gap-6">
                            {/* Categories Row */}
                            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                                <Link
                                    to="/shop"
                                    className={`shrink-0 px-5 py-3 rounded-2xl text-sm whitespace-nowrap border no-underline transition-all duration-200 ${!categoryId ? 'bg-brand-green text-white border-brand-green font-800 shadow-lg shadow-brand-green/20' : 'bg-white border-black/8 text-secondary font-600'}`}
                                >
                                    All Products
                                </Link>
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        to={`/shop?category=${cat.id}`}
                                        className={`shrink-0 px-5 py-3 rounded-2xl text-sm whitespace-nowrap border no-underline transition-all duration-200 ${categoryId === cat.id ? 'bg-brand-green text-white border-brand-green font-800 shadow-lg shadow-brand-green/20' : 'bg-white border-black/8 text-secondary font-600'}`}
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>

                            {/* Subcategories Row */}
                            {categoryId && subcategories.length > 0 && (
                                <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="flex items-center justify-between px-1">
                                        <h4 className="text-[0.65rem] font-800 uppercase tracking-widest text-brand-text-muted">Explore Sub-types</h4>
                                    </div>
                                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                        <Link
                                            to={`/shop?category=${categoryId}`}
                                            className={`shrink-0 px-4 py-2 rounded-xl text-[0.8rem] whitespace-nowrap border no-underline transition-all duration-200 ${!subcategoryId ? 'bg-brand-green-light text-brand-green border-brand-green/20 font-800' : 'bg-white border-black/5 text-gray-400 font-700'}`}
                                        >
                                            View All
                                        </Link>
                                        {subcategories.map((sub) => (
                                            <Link
                                                key={sub.id}
                                                to={`/shop?category=${categoryId}&subcategory=${sub.id}`}
                                                className={`shrink-0 px-4 py-2 rounded-xl text-[0.8rem] whitespace-nowrap border no-underline transition-all duration-200 ${subcategoryId === sub.id ? 'bg-brand-green-light text-brand-green border-brand-green/20 font-800' : 'bg-white border-black/5 text-gray-400 font-700'}`}
                                            >
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <main className="flex-1">
                        <div className="text-[0.84rem] text-gray-400 mb-6 px-1">
                            Showing <span className="text-brand-text font-600">{products.length}</span> results
                            {categoryId && categories.find(c => c.id === categoryId) && (
                                <> in <span className="text-brand-green font-600">{categories.find(c => c.id === categoryId)?.name}</span></>
                            )}
                            {subcategoryId && subcategories.find(s => s.id === subcategoryId) && (
                                <> › <span className="text-brand-green font-600">{subcategories.find(s => s.id === subcategoryId)?.name}</span></>
                            )}
                        </div>

                        {loading ? (
                            <div className="text-center py-20 text-gray-400 italic">Loading instruments...</div>
                        ) : (
                            <>
                                {products.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                                        {products.map(product => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-24 bg-white border border-black/8 rounded-2xl px-6">
                                        <h3 className="text-lg font-700 text-brand-text mb-2">No products found</h3>
                                        <p className="text-secondary mb-6">We couldn't find any products in this category at the moment.</p>
                                        <Link to="/shop" className="inline-flex items-center gap-2 bg-brand-green text-white px-6 py-2.5 rounded-lg font-600 no-underline transition-all hover:bg-brand-green-dark">
                                            Clear Filters
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Shop;
