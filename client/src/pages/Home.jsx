import React, { useState, useEffect } from 'react';
import {
    ArrowRight, ShieldCheck, Truck, Award, Clock, HeartPulse,
    Stethoscope, Microscope, Eye, Star, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './Home.css';

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

/* ── Blog posts (static for now) ── */
const BLOGS = [
    { id: 1, tag: 'Surgery', title: 'Advances in Minimally Invasive Surgical Techniques', author: 'Dr. Arjun Mehta', date: 'Feb 18, 2026', img: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&auto=format&fit=crop' },
    { id: 2, tag: 'Equipment', title: 'How to Choose the Right Surgical Instruments for Your OR', author: 'Dr. Priya Nair', date: 'Feb 12, 2026', img: 'https://images.unsplash.com/photo-1584982751601-97ddc0cb5571?w=400&auto=format&fit=crop' },
    { id: 3, tag: 'Standards', title: 'ISO 13485: Quality Management in Medical Device Manufacturing', author: 'Rahul Shah', date: 'Feb 05, 2026', img: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&auto=format&fit=crop' },
];

const Home = () => {
    const [featured, setFeatured] = useState([]);
    const [latest, setLatest] = useState([]);
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await axios.get('/api/products?limit=8');
                const products = data.products || data || [];
                setFeatured(products.slice(0, 4));
                setLatest(products.slice(0, 6));
                setTrending(products.slice(0, 4));
            } catch { /* use empty arrays */ }
            setLoading(false);
        };
        load();
    }, []);

    return (
        <div className="home">

            {/* ══════════════════════════════════════
          HERO BANNER
      ══════════════════════════════════════ */}
            <section className="hero-banner">
                <div className="container">
                    <div className="hero-inner">

                        {/* Left: text */}
                        <div className="hero-text">
                            <span className="hero-label">Medical Excellence Since 1995</span>
                            <h1>
                                Precision Instruments<br />
                                for <span>Surgical Mastery</span>
                            </h1>
                            <p>
                                Premium quality surgical tools designed for the world's leading
                                medical professionals. Engineering excellence in every cut.
                            </p>
                            <div className="hero-btns">
                                <Link to="/shop" className="btn-primary">
                                    Explore Products <ArrowRight size={17} />
                                </Link>
                                <Link to="/quotes" className="btn-secondary">
                                    Request Bulk Quote
                                </Link>
                            </div>
                        </div>

                        {/* Right: image + floating card */}
                        <div className="hero-visual">
                            <div className="hero-img-wrap">
                                <img
                                    src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=480&auto=format&fit=crop"
                                    alt="Surgical Instruments"
                                    className="hero-img"
                                />
                                <div className="hero-badge-float">
                                    <ShieldCheck size={22} className="hbf-icon" />
                                    <div>
                                        <strong>ISO Certified</strong>
                                        <span>Medical Grade</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="hero-stats-col">
                            <div className="hero-stat">
                                <Award size={26} className="hs-icon" />
                                <div>
                                    <strong>15k+</strong>
                                    <span>Products</span>
                                </div>
                            </div>
                            <div className="hero-stat">
                                <ShieldCheck size={26} className="hs-icon" />
                                <div>
                                    <strong>ISO</strong>
                                    <span>Certified</span>
                                </div>
                            </div>
                            <div className="hero-stat">
                                <Clock size={26} className="hs-icon" />
                                <div>
                                    <strong>24/7</strong>
                                    <span>Support</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          TRUST BAR
      ══════════════════════════════════════ */}
            <section className="trust-bar">
                <div className="container">
                    <div className="trust-grid">
                        {TRUST_ITEMS.map((t, i) => (
                            <div key={i} className="trust-item">
                                <span className="ti-icon">{t.icon}</span>
                                <span>{t.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          PARTNER / ABOUT SPLIT
      ══════════════════════════════════════ */}
            <section className="partner-section">
                <div className="container partner-grid">
                    <div className="partner-visual">
                        <div className="partner-shield">
                            <ShieldCheck size={64} className="shield-icon" />
                            <div className="shield-ring" />
                            <div className="shield-ring r2" />
                        </div>
                    </div>
                    <div className="partner-text">
                        <span className="section-label">Why Choose Us</span>
                        <h2>Your Faithful Partner<br /><span>in Medical Goods</span></h2>
                        <p>
                            AR Surgical Hub has been a trusted supplier for hospitals, clinics, and
                            surgical centers worldwide since 1995. Every instrument is precision-crafted
                            from medical-grade materials and undergoes rigorous quality testing.
                        </p>
                        <div className="partner-stats">
                            <div className="ps-item"><strong>15,000+</strong><span>Products</span></div>
                            <div className="ps-item"><strong>200+</strong><span>Countries</span></div>
                            <div className="ps-item"><strong>30+</strong><span>Years Experience</span></div>
                        </div>
                        <Link to="/shop" className="btn-primary">View All Products <ArrowRight size={16} /></Link>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════════ */}
            <section className="products-section">
                <div className="container">
                    <div className="section-row-header">
                        <div>
                            <span className="section-label">Top Picks</span>
                            <h2 className="section-heading">Featured Products</h2>
                        </div>
                        <Link to="/shop" className="view-all-btn">View All <ChevronRight size={16} /></Link>
                    </div>
                    {loading ? (
                        <div className="products-loading">Loading products…</div>
                    ) : featured.length > 0 ? (
                        <div className="products-grid-4">
                            {featured.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    ) : (
                        <div className="products-empty">No products available yet.</div>
                    )}
                </div>
            </section>

            {/* ══════════════════════════════════════
          PROMO BANNER 1
      ══════════════════════════════════════ */}
            <section className="promo-strip">
                <div className="container">
                    <div className="promo-card">
                        <div className="promo-body">
                            <span className="promo-tag">Limited Offer</span>
                            <h2>Free Covid-19 Vaccine<br />Campaign Today</h2>
                            <p>Request your free consultation and vaccine information kit from our medical experts.</p>
                            <Link to="/quotes" className="btn-primary promo-cta">Get a Free Quote <ArrowRight size={16} /></Link>
                        </div>
                        <div className="promo-image">
                            <img
                                src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=480&auto=format&fit=crop"
                                alt="Medical Promotion"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          LATEST PRODUCTS
      ══════════════════════════════════════ */}
            <section className="products-section alt-bg">
                <div className="container">
                    <div className="section-row-header">
                        <div>
                            <span className="section-label">New Arrivals</span>
                            <h2 className="section-heading">Latest Products</h2>
                        </div>
                        <Link to="/shop" className="view-all-btn">View All <ChevronRight size={16} /></Link>
                    </div>
                    {loading ? (
                        <div className="products-loading">Loading products…</div>
                    ) : latest.length > 0 ? (
                        <div className="products-grid-6">
                            {latest.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    ) : (
                        <div className="products-empty">No products available yet.</div>
                    )}
                </div>
            </section>

            {/* ══════════════════════════════════════
          PROMO BANNER 2
      ══════════════════════════════════════ */}
            <section className="promo-wide">
                <div className="container">
                    <div className="promo-wide-inner">
                        <div>
                            <span className="promo-tag light">Safety First</span>
                            <h2>Grade A Safety Masks<br />for Sale Every Day!</h2>
                            <p>Premium N95, KN95 and surgical masks — bulk pricing available for healthcare facilities.</p>
                            <Link to="/shop" className="btn-primary">Shop Now <ArrowRight size={16} /></Link>
                        </div>
                        <img
                            src="https://images.unsplash.com/photo-1584889341755-bab37c0c2d44?w=500&auto=format&fit=crop"
                            alt="Safety Masks"
                            className="promo-wide-img"
                        />
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          TRENDING PRODUCTS
      ══════════════════════════════════════ */}
            <section className="products-section">
                <div className="container">
                    <div className="section-row-header">
                        <div>
                            <span className="section-label">Most Popular</span>
                            <h2 className="section-heading">Trending Products</h2>
                        </div>
                        <Link to="/shop" className="view-all-btn">View All <ChevronRight size={16} /></Link>
                    </div>
                    {!loading && trending.length > 0 ? (
                        <div className="products-grid-4">
                            {trending.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    ) : !loading ? (
                        <div className="products-empty">No products available yet.</div>
                    ) : null}
                </div>
            </section>

            {/* ══════════════════════════════════════
          FEATURES / WHY CHOOSE US
      ══════════════════════════════════════ */}
            <section className="features-section">
                <div className="container">
                    <div className="section-center-header">
                        <span className="section-label">Our Strengths</span>
                        <h2 className="section-heading">Why Choose <span>AR Surgical</span>?</h2>
                        <p>We combine traditional craftsmanship with modern precision engineering.</p>
                    </div>
                    <div className="features-grid-4">
                        {FEATURES.map((f, i) => (
                            <div key={i} className="feature-card">
                                <div className="feature-icon">{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          BLOG / LATEST ARTICLES
      ══════════════════════════════════════ */}
            <section className="blog-section alt-bg">
                <div className="container">
                    <div className="section-row-header">
                        <div>
                            <span className="section-label">Knowledge Hub</span>
                            <h2 className="section-heading">Latest Blogs</h2>
                        </div>
                        <Link to="/" className="view-all-btn">View All <ChevronRight size={16} /></Link>
                    </div>
                    <div className="blog-grid">
                        {BLOGS.map(b => (
                            <article key={b.id} className="blog-card">
                                <div className="blog-img-wrap">
                                    <img src={b.img} alt={b.title} />
                                    <span className="blog-tag">{b.tag}</span>
                                </div>
                                <div className="blog-body">
                                    <p className="blog-meta">{b.author} · {b.date}</p>
                                    <h3>{b.title}</h3>
                                    <Link to="/" className="blog-read-link">Read More <ChevronRight size={14} /></Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
