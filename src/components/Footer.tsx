import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-brand-footer pt-16 md:pt-20 mt-0">
            <div className="max-w-[1400px] mx-auto px-5 md:px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1.4fr] gap-12 pb-14 border-b border-white/5">

                    {/* Brand */}
                    <div className="flex flex-col">
                        <Link to="/" className="flex items-center gap-2.5 mb-6 no-underline transition-opacity hover:opacity-80">
                            <img src="/ar.svg" alt="AR SURGICAL HUB" className="h-[38px] brightness-0 invert opacity-90" />
                            <div className="flex flex-col leading-none">
                                <span className="font-header text-[1.1rem] font-800 text-white tracking-tighter">AR SURGICAL</span>
                                <span className="text-[0.65rem] font-700 text-brand-blue uppercase tracking-widest mt-0.5">SURGICAL HUB</span>
                            </div>
                        </Link>
                        <p className="text-white/50 text-[0.87rem] leading-[1.75] mb-5.5 max-w-[300px]">
                            Leading provider of precision surgical instruments and medical equipment.
                            Quality and trust since 1995, serving healthcare professionals worldwide.
                        </p>
                        {/* Contact */}
                        <div className="flex flex-col gap-3 mb-6 text-white/50 text-[0.87rem]">
                            <div className="flex items-start gap-2.5">
                                <Phone size={16} className="text-brand-blue shrink-0 mt-0.5" />
                                <span>+94 77 0700 737</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Mail size={15} className="text-brand-green shrink-0 mt-0.5" />
                                <span>support@arsurgicalhub.com</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin size={15} className="text-brand-green shrink-0 mt-0.5" />
                                <span>158A, Hospital Road Jaffna</span>
                            </div>
                        </div>
                        {/* Social */}
                        <div className="flex gap-2">
                            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                                <a key={i} href="#" className="w-[34px] h-[34px] rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 transition-all duration-200 hover:bg-brand-green hover:border-brand-green hover:text-white" aria-label="Social Link">
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-header text-[0.82rem] font-700 uppercase tracking-wider text-white mb-5 pb-2.5 border-b-2 border-brand-green/30">Quick Links</h3>
                        <ul className="list-none flex flex-col gap-2.5">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Products', path: '/shop' },
                                { name: 'Categories', path: '/categories' },
                                { name: 'Knowledge Hub', path: '/blogs' },
                                { name: 'Careers', path: '/careers' },
                                { name: 'Get a Quote', path: '/quotes' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="text-white/45 text-[0.87rem] transition-all duration-200 flex items-center gap-1.5 hover:text-white/85 hover:pl-1.5 peer">
                                        <span className="text-brand-green opacity-0 transition-opacity duration-200 peer-hover:opacity-100">›</span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-header text-[0.82rem] font-700 uppercase tracking-wider text-white mb-5 pb-2.5 border-b-2 border-brand-green/30">Support</h3>
                        <ul className="list-none flex flex-col gap-2.5">
                            {['Help Center', 'Shipping Policy', 'Return & Refund', 'Order Tracking', 'Contact Us'].map((item) => (
                                <li key={item}>
                                    <Link to="/" className="text-white/45 text-[0.87rem] transition-all duration-200 hover:text-white/85 flex items-center gap-1.5">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-header text-[0.82rem] font-700 uppercase tracking-wider text-white mb-5 pb-2.5 border-b-2 border-brand-green/30">Newsletter</h3>
                        <p className="text-white/45 text-[0.85rem] leading-[1.7] mb-3.5">
                            Subscribe for the latest medical product updates and exclusive offers.
                        </p>
                        <div className="flex flex-col gap-2 mb-4.5">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white text-[0.87rem] font-primary outline-none transition-colors duration-200 focus:border-brand-green"
                            />
                            <button className="bg-brand-green text-white border-none py-2.5 rounded-lg font-600 font-primary text-[0.88rem] cursor-pointer transition-colors duration-200 hover:bg-brand-green-dark">
                                Subscribe
                            </button>
                        </div>
                        {/* Trust badges */}
                        <div className="flex gap-2 flex-wrap">
                            {['ISO 13485', 'CE Marked', 'FDA Cleared'].map((badge) => (
                                <span key={badge} className="text-[0.66rem] font-700 uppercase tracking-tight text-white/40 border border-white/10 px-2 py-1 rounded">
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom bar */}
            <div className="bg-black/20 border-t border-white/5 mt-0">
                <div className="max-w-[1400px] mx-auto px-5 md:px-10 flex flex-col md:flex-row items-center justify-between py-4 gap-2.5">
                    <p className="text-white/30 text-[0.8rem]">© 2026 AR SURGICAL HUB. All rights reserved.</p>
                    <div className="flex gap-5">
                        {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                            <Link key={item} to="/" className="text-white/30 text-[0.8rem] transition-colors duration-200 hover:text-white/70">
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
