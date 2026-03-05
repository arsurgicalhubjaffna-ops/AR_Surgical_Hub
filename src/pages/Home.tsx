import React, { useState, useEffect } from 'react';
import {
    ArrowRight, ShieldCheck, Truck, Award, Clock, HeartPulse,
    Stethoscope, Microscope, Eye, Star, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import insforge from '../lib/insforge';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
import { Product } from '../types';

/* ── Trust bar data ── */
const TRUST_ITEMS = [
    { icon: <ShieldCheck size={22} />, label: 'Genuine Brand' },
    { icon: <Truck size={22} />, label: 'Free Shipping' },
    { icon: <Award size={22} />, label: 'ISO Certified' },
    { icon: <Clock size={22} />, label: '24/7 Support' },
    { icon: <HeartPulse size={22} />, label: 'Quality Assured' },
];

/* ── Feature cards ── */
const FEATURES = [
    { icon: <ShieldCheck size={26} />, title: 'Premium Materials', desc: 'Only the highest-grade German and Japanese steel used in every instrument.' },
    { icon: <Microscope size={26} />, title: 'Precision Engineering', desc: 'Each instrument crafted to exacting tolerances for consistent surgical outcomes.' },
    { icon: <Truck size={26} />, title: 'Global Logistics', desc: 'Reliable worldwide shipping with real-time tracking for critical supplies.' },
    { icon: <Stethoscope size={26} />, title: 'Expert Consultation', desc: 'Dedicated medical professionals to help you select the right instruments.' },
];

const Home: React.FC = () => {
    const [featured, setFeatured] = useState<Product[]>([]);
    const [latest, setLatest] = useState<Product[]>([]);
    const [trending, setTrending] = useState<Product[]>([]);
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const { data, error } = await insforge.database
                    .from('products')
                    .select('*, categories(name)')
                    .eq('is_active', true)
                    .order('created_at', { ascending: false })
                    .limit(8);

                if (error) throw error;
                const products = data || [];
                // Map category name for ProductCard compatibility
                const mapped = products.map((p: any) => ({
                    ...p,
                    category_name: p.categories?.name || null,
                })) as Product[];

                setFeatured(mapped.slice(0, 4));
                setLatest(mapped.slice(0, 6));
                setTrending(mapped.slice(0, 4));

                const { data: blogsData, error: blogsError } = await insforge.database
                    .from('blogs')
                    .select('*')
                    .eq('is_published', true)
                    .order('created_at', { ascending: false })
                    .limit(3);

                if (!blogsError && blogsData) {
                    setBlogs(blogsData);
                }
            } catch (e) {
                console.error('Failed to load home data:', e);
            }
            setLoading(false);
        };
        load();
    }, []);

    return (
        <div className="bg-brand-bg font-primary overflow-x-hidden">

            {/* HERO BANNER */}
            <section className="bg-linear-[135deg,var(--color-brand-green-light)_0%,#d4f0ec_60%,#e0f5f2_100%] py-12 md:py-24 overflow-hidden relative">
                <div className="max-w-[1400px] mx-auto px-5 md:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_auto_auto] items-center gap-12 text-center lg:text-left">

                        {/* Left: text */}
                        <div className="flex-1">
                            <span className="inline-block bg-brand-green/12 text-brand-green border border-brand-green/25 rounded-full px-3.5 py-1.25 text-[0.74rem] font-700 uppercase tracking-widest mb-4.5">
                                Medical Excellence Since 1995
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-800 leading-[1.12] mb-4.5 tracking-tighter text-brand-text">
                                Precision Instruments<br />
                                for <span className="text-brand-green">Surgical Mastery</span>
                            </h1>
                            <p className="text-brand-text/70 text-[1.1rem] leading-relaxed mb-8 max-w-[600px] mx-auto lg:mx-0">
                                Premium quality surgical tools designed for the world's leading
                                medical professionals. Engineering excellence in every cut.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mt-8">
                                <Link to="/shop" className="inline-flex items-center gap-2 bg-brand-green text-white px-7 py-3.5 rounded-xl font-600 no-underline transition-all duration-200 border-1.5 border-brand-green hover:bg-brand-green-dark hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-green/20 shadow-sm">
                                    Explore Products <ArrowRight size={17} />
                                </Link>
                                <Link to="/quotes" className="inline-flex items-center bg-white text-brand-green px-7 py-3.5 rounded-xl font-600 no-underline transition-all duration-200 border-1.5 border-brand-green hover:bg-brand-green-light hover:-translate-y-0.5 shadow-sm">
                                    Request Bulk Quote
                                </Link>
                            </div>
                        </div>

                        {/* Right: image + floating card */}
                        <div className="relative justify-self-center lg:justify-self-auto">
                            <div className="relative w-full max-w-[340px]">
                                <img
                                    src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=480&auto=format&fit=crop"
                                    alt="Surgical Instruments"
                                    className="w-full rounded-[20px] object-cover aspect-[3/4] shadow-2xl"
                                />
                                <div className="absolute bottom-6 left-[-15px] sm:left-[-30px] flex items-center gap-2.5 bg-white border border-black/8 rounded-xl p-2.5 px-4 shadow-xl z-10 animate-in fade-in slide-in-from-left-4 duration-700">
                                    <ShieldCheck size={22} className="text-brand-green" />
                                    <div>
                                        <strong className="block text-[0.88rem] font-700 text-brand-text leading-tight">ISO Certified</strong>
                                        <span className="text-[0.72rem] text-gray-400">Medical Grade</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-row lg:flex-col gap-4 justify-center flex-wrap lg:min-w-[160px]">
                            {[
                                { icon: Award, label: 'Products', value: '15k+' },
                                { icon: ShieldCheck, label: 'Certified', value: 'ISO' },
                                { icon: Clock, label: 'Support', value: '24/7' }
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center gap-3 bg-white border border-black/8 rounded-xl p-3.5 px-4.5 shadow-sm transition-all duration-200 hover:border-brand-green/25 hover:shadow-md group">
                                    <stat.icon size={26} className="text-brand-green shrink-0 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <strong className="block text-[1.2rem] font-800 text-brand-text leading-none font-header">{stat.value}</strong>
                                        <span className="text-[0.72rem] text-gray-400 uppercase tracking-tighter font-500">{stat.label}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </section>

            {/* TRUST BAR */}
            <section className="bg-white border-y border-brand-border py-6">
                <div className="max-w-[1400px] mx-auto px-5 md:px-10">
                    <div className="flex flex-wrap items-center justify-between gap-6 md:gap-8 text-brand-text-muted">
                        {TRUST_ITEMS.map((t, i) => (
                            <div key={i} className="flex items-center gap-3 text-[0.88rem] font-600 transition-colors hover:text-brand-green">
                                <span className="w-11 h-11 rounded-full bg-brand-green-light flex items-center justify-center text-brand-green shrink-0 shadow-sm">{t.icon}</span>
                                <span>{t.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PARTNER SECTION */}
            <section className="py-20 bg-white">
                <div className="max-w-[1400px] mx-auto px-5 md:px-10 grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-20 items-center">
                    <div className="flex items-center justify-center relative">
                        <div className="relative w-[180px] h-[180px] md:w-[220px] md:h-[220px] flex items-center justify-center">
                            <ShieldCheck size={64} className="text-brand-green relative z-[2] md:w-16 md:h-16 w-12 h-12" />
                            <div className="absolute inset-0 border-2 border-brand-green/25 rounded-full animate-[ping_2.5s_infinite]" />
                            <div className="absolute inset-[-15px] md:inset-[-20px] border-2 border-brand-green/10 rounded-full animate-[ping_3s_infinite]" />
                        </div>
                    </div>
                    <div className="text-center lg:text-left">
                        <span className="inline-block bg-brand-green/12 text-brand-green border border-brand-green/25 rounded-full px-3.5 py-1.25 text-[0.74rem] font-700 uppercase tracking-widest mb-3">Why Choose Us</span>
                        <h2 className="text-[2.2rem] font-800 leading-tight mb-4 tracking-tighter text-brand-text">Your Faithful Partner<br /><span className="text-brand-green">in Medical Goods</span></h2>
                        <p className="text-brand-text/70 text-[0.97rem] leading-[1.75] mb-8 max-w-[500px] mx-auto lg:mx-0">
                            AR Surgical Hub has been a trusted supplier for hospitals, clinics, and
                            surgical centers worldwide since 1995. Every instrument is precision-crafted
                            from medical-grade materials and undergoes rigorous quality testing.
                        </p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-8 mb-8">
                            {[
                                { v: '15,000+', l: 'Products' },
                                { v: '200+', l: 'Countries' },
                                { v: '30+', l: 'Years Experience' }
                            ].map((s, i) => (
                                <div key={i} className="text-center p-4 px-5 bg-brand-bg border border-black/8 rounded-xl min-w-[100px]">
                                    <strong className="block text-[1.5rem] font-800 text-brand-green font-header leading-none mb-1">{s.v}</strong>
                                    <span className="text-[0.78rem] text-gray-400 font-500 uppercase">{s.l}</span>
                                </div>
                            ))}
                        </div>
                        <Link to="/shop" className="inline-flex items-center gap-2 bg-brand-green text-white px-7 py-3.5 rounded-xl font-600 no-underline transition-all duration-200 border-1.5 border-brand-green hover:bg-brand-green-dark hover:-translate-y-0.5 shadow-sm">View All Products <ArrowRight size={16} /></Link>
                    </div>
                </div>
            </section>

            {/* FEATURED PRODUCTS */}
            <section className="py-18 bg-brand-bg">
                <div className="max-w-[1400px] mx-auto px-5 md:px-10">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <span className="inline-block bg-brand-green/12 text-brand-green border border-brand-green/25 rounded-full px-3.5 py-1.25 text-[0.74rem] font-700 uppercase tracking-widest mb-1">Top Picks</span>
                            <h2 className="text-[1.8rem] font-800 tracking-tighter mt-1">Featured Products</h2>
                        </div>
                        <Link to="/shop" className="inline-flex items-center gap-1 text-[0.85rem] font-600 text-brand-green border-1.5 border-brand-green/25 px-4 py-1.75 rounded-lg transition-all duration-200 hover:bg-brand-green hover:text-white no-underline">View All <ChevronRight size={16} /></Link>
                    </div>
                    {loading ? (
                        <div className="text-center py-15 text-gray-400 text-[0.95rem]">Loading products…</div>
                    ) : featured.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {featured.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    ) : (
                        <div className="text-center py-15 text-gray-400 text-[0.95rem]">No products available yet.</div>
                    )}
                </div>
            </section>

            {/* PROMO STRIP */}
            <section className="py-10 bg-brand-surface">
                <div className="max-w-[1400px] mx-auto px-5 md:px-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-linear-[130deg,var(--color-brand-green)_0%,var(--color-brand-green-dark)_100%] rounded-[24px] overflow-hidden p-8 md:p-12 lg:px-14 relative group shadow-xl shadow-brand-green/10">
                        <div className="absolute right-[-60px] top-[-60px] w-60 h-60 rounded-full bg-white/7 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
                        <div className="flex-1 text-center md:text-left">
                            <span className="inline-block bg-white/20 text-white text-[0.7rem] font-700 uppercase tracking-widest px-3 py-1 rounded-full mb-3.5">Limited Offer</span>
                            <h2 className="text-[2rem] font-800 text-white leading-[1.15] mb-2.5 tracking-tight">Free Covid-19 Vaccine<br />Campaign Today</h2>
                            <p className="text-white/80 text-[0.95rem] mb-6 max-w-[380px] mx-auto md:mx-0">Request your free consultation and vaccine information kit from our medical experts.</p>
                            <Link to="/quotes" className="inline-flex items-center gap-2 bg-white text-brand-green px-7 py-3.5 rounded-xl font-600 no-underline transition-all duration-200 shadow-xl hover:bg-brand-green-light hover:text-brand-green-dark">Get a Free Quote <ArrowRight size={16} /></Link>
                        </div>
                        <div className="shrink-0 w-full max-w-[280px]">
                            <img
                                src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=480&auto=format&fit=crop"
                                alt="Medical Promotion"
                                className="w-full rounded-2xl object-cover aspect-[4/3] shadow-3xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* LATEST PRODUCTS */}
            <section className="py-18 bg-white">
                <div className="max-w-[1400px] mx-auto px-5 md:px-10">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <span className="inline-block bg-brand-green/12 text-brand-green border border-brand-green/25 rounded-full px-3.5 py-1.25 text-[0.74rem] font-700 uppercase tracking-widest mb-1">New Arrivals</span>
                            <h2 className="text-[1.8rem] font-800 tracking-tighter mt-1">Latest Products</h2>
                        </div>
                        <Link to="/shop" className="inline-flex items-center gap-1 text-[0.85rem] font-600 text-brand-green border-1.5 border-brand-green/25 px-4 py-1.75 rounded-lg transition-all duration-200 hover:bg-brand-green hover:text-white no-underline">View All <ChevronRight size={16} /></Link>
                    </div>
                    {loading ? (
                        <div className="text-center py-15 text-gray-400 text-[0.95rem]">Loading products…</div>
                    ) : latest.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4.5">
                            {latest.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    ) : (
                        <div className="text-center py-15 text-gray-400 text-[0.95rem]">No products available yet.</div>
                    )}
                </div>
            </section>

            {/* PROMO WIDE */}
            <section className="py-12 bg-brand-bg">
                <div className="max-w-[1400px] mx-auto px-5 md:px-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-brand-green-light border border-brand-green/20 rounded-[24px] p-8 md:p-12 lg:px-15 overflow-hidden shadow-sm">
                        <div className="text-center md:text-left">
                            <span className="inline-block bg-white/15 text-brand-green border border-brand-green/25 px-3 py-1 rounded-full text-[0.7rem] font-700 uppercase tracking-widest mb-3.5">Safety First</span>
                            <h2 className="text-[2.2rem] font-800 leading-[1.2] my-3.5 tracking-tighter">Grade A Safety Masks<br />for Sale Every Day!</h2>
                            <p className="text-secondary text-[0.97rem] mb-6.5 max-w-[400px] mx-auto md:mx-0">Premium N95, KN95 and surgical masks — bulk pricing available for healthcare facilities.</p>
                            <Link to="/shop" className="inline-flex items-center gap-2 bg-brand-green text-white px-7 py-3.5 rounded-xl font-600 no-underline transition-all duration-200 border-1.5 border-brand-green hover:bg-brand-green-dark hover:-translate-y-0.5 shadow-sm">Shop Now <ArrowRight size={16} /></Link>
                        </div>
                        <div className="w-full max-w-[340px] shrink-0 rounded-2xl overflow-hidden aspect-[4/3] shadow-lg">
                            <ProductImage
                                src="https://images.unsplash.com/photo-1584889341755-bab37c0c2d44?w=500&auto=format&fit=crop"
                                alt="Safety Masks"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* TRENDING PRODUCTS */}
            <section className="py-18 bg-white">
                <div className="max-w-[1400px] mx-auto px-5 md:px-10">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <span className="inline-block bg-brand-green/12 text-brand-green border border-brand-green/25 rounded-full px-3.5 py-1.25 text-[0.74rem] font-700 uppercase tracking-widest mb-1">Most Popular</span>
                            <h2 className="text-[1.8rem] font-800 tracking-tighter mt-1">Trending Products</h2>
                        </div>
                        <Link to="/shop" className="inline-flex items-center gap-1 text-[0.85rem] font-600 text-brand-green border-1.5 border-brand-green/25 px-4 py-1.75 rounded-lg transition-all duration-200 hover:bg-brand-green hover:text-white no-underline">View All <ChevronRight size={16} /></Link>
                    </div>
                    {!loading && trending.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {trending.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    ) : !loading ? (
                        <div className="text-center py-15 text-gray-400 text-[0.95rem]">No products available yet.</div>
                    ) : null}
                </div>
            </section>

            {/* FEATURES GRID */}
            <section className="py-20 bg-brand-bg">
                <div className="max-w-[1400px] mx-auto px-5 md:px-10">
                    <div className="text-center mb-12">
                        <span className="inline-block bg-brand-green/12 text-brand-green border border-brand-green/25 rounded-full px-3.5 py-1.25 text-[0.74rem] font-700 uppercase tracking-widest mb-3.5">Our Strengths</span>
                        <h2 className="text-[2rem] font-800 mb-2.5">Why Choose <span className="text-brand-green">AR Surgical</span>?</h2>
                        <p className="text-secondary max-w-lg mx-auto text-[0.97rem]">We combine traditional craftsmanship with modern precision engineering.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5.5">
                        {FEATURES.map((f, i) => (
                            <div key={i} className="bg-white border border-black/8 rounded-2xl p-7.5 shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 hover:border-brand-green/25 group">
                                <div className="w-[52px] h-[52px] rounded-2xl bg-brand-green-light flex items-center justify-center text-brand-green mb-4.5 transition-colors group-hover:bg-brand-green group-hover:text-white">
                                    {f.icon}
                                </div>
                                <h3 className="text-base font-700 mb-2 text-brand-text">{f.title}</h3>
                                <p className="text-secondary text-[0.87rem] leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* BLOG SECTION */}
            <section className="py-18 bg-white">
                <div className="max-w-[1400px] mx-auto px-5 md:px-10">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <span className="inline-block bg-brand-green/12 text-brand-green border border-brand-green/25 rounded-full px-3.5 py-1.25 text-[0.74rem] font-700 uppercase tracking-widest mb-1">Knowledge Hub</span>
                            <h2 className="text-[1.8rem] font-800 tracking-tighter mt-1">Latest Blogs</h2>
                        </div>
                        <Link to="/blogs" className="inline-flex items-center gap-1 text-[0.85rem] font-600 text-brand-green border-1.5 border-brand-green/25 px-4 py-1.75 rounded-lg transition-all duration-200 hover:bg-brand-green hover:text-white no-underline">View All <ChevronRight size={16} /></Link>
                    </div>
                    {blogs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {blogs.map(b => (
                                <article key={b.id} className="bg-white border border-black/8 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-brand-green/25 group flex flex-col">
                                    <Link to={`/blog/${b.id}`} className="relative aspect-video overflow-hidden shrink-0 block">
                                        <ProductImage
                                            src={b.featured_image}
                                            alt={b.title}
                                            className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
                                        />
                                        {b.tag && (
                                            <span className="absolute top-3 left-3 bg-brand-green text-white text-[0.66rem] font-700 uppercase tracking-tight px-2 py-0.75 rounded">
                                                {b.tag}
                                            </span>
                                        )}
                                    </Link>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <p className="text-[0.78rem] text-gray-400 mb-2">
                                            {b.author_name} · {new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                        <h3 className="text-base font-700 leading-[1.4] mb-3.5 text-brand-text group-hover:text-brand-green transition-colors line-clamp-2">
                                            <Link to={`/blog/${b.id}`}>{b.title}</Link>
                                        </h3>
                                        <Link to={`/blog/${b.id}`} className="mt-auto inline-flex items-center gap-1 text-brand-green text-[0.84rem] font-600 transition-all duration-200 hover:gap-2 hover:text-brand-green-dark no-underline w-fit">
                                            Read More <ChevronRight size={14} />
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : !loading ? (
                        <div className="text-center py-10 text-gray-400 text-[0.95rem]">No blog posts available yet.</div>
                    ) : null}
                </div>
            </section>

        </div>
    );
};

export default Home;
