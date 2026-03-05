import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import insforge from '../lib/insforge';
import ProductCard from '../components/ProductCard';
import { Product, Category } from '../types';

const Shop: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get('category');

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

                let query = insforge.database
                    .from('products')
                    .select('*, categories(name)')
                    .eq('is_active', true)
                    .order('created_at', { ascending: false });

                if (categoryId) {
                    query = query.eq('category_id', categoryId);
                }

                const { data, error } = await query;
                if (error) throw error;

                // Map category name for ProductCard compatibility
                const mapped = (data || []).map((p: any) => ({
                    ...p,
                    category_name: p.categories?.name || null,
                })) as Product[];

                setProducts(mapped);
            } catch (err) {
                console.error('Error fetching shop data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [categoryId]);

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
                                        className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200 border border-transparent no-underline ${categoryId === cat.id ? 'bg-brand-green-light text-brand-green border-brand-green/25 font-600' : 'text-secondary hover:bg-brand-bg hover:text-brand-text'}`}
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    {/* Mobile Horizontal scroll for categories */}
                    <div className="lg:hidden mb-6 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-none">
                        <div className="flex gap-2.5">
                            <Link
                                to="/shop"
                                className={`shrink-0 px-5 py-2.5 rounded-xl text-sm whitespace-nowrap border no-underline transition-all ${!categoryId ? 'bg-brand-green text-white border-brand-green font-700 shadow-lg shadow-brand-green/20' : 'bg-brand-surface border-brand-border text-brand-text-muted'}`}
                            >
                                All Products
                            </Link>
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    to={`/shop?category=${cat.id}`}
                                    className={`shrink-0 px-4 py-2 rounded-lg text-sm whitespace-nowrap border no-underline transition-all ${categoryId === cat.id ? 'bg-brand-green text-white border-brand-green font-600 shadow-md shadow-brand-green/20' : 'bg-white border-black/8 text-secondary'}`}
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <main className="flex-1">
                        <div className="text-[0.84rem] text-gray-400 mb-6 px-1">
                            Showing <span className="text-brand-text font-600">{products.length}</span> results
                            {categoryId && categories.find(c => c.id === categoryId) && (
                                <> in <span className="text-brand-green font-600">{categories.find(c => c.id === categoryId)?.name}</span></>
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
