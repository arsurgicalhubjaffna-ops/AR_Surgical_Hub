import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">

                    {/* Brand */}
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <img src="/ar.svg" alt="AR Surgical Hub" className="footer-logo-img" />
                            <span>Surgical Hub</span>
                        </Link>
                        <p className="footer-desc">
                            Leading provider of precision surgical instruments and medical equipment.
                            Quality and trust since 1995, serving healthcare professionals worldwide.
                        </p>
                        {/* Contact */}
                        <div className="footer-contact">
                            <div className="fc-item"><Phone size={15} /><span>+1 (555) 123-4567</span></div>
                            <div className="fc-item"><Mail size={15} /><span>support@arsurgical.com</span></div>
                            <div className="fc-item"><MapPin size={15} /><span>123 Medical District, NY 10001</span></div>
                        </div>
                        {/* Social */}
                        <div className="footer-social">
                            <a href="#" className="fs-btn" aria-label="Facebook"><Facebook size={16} /></a>
                            <a href="#" className="fs-btn" aria-label="Twitter"><Twitter size={16} /></a>
                            <a href="#" className="fs-btn" aria-label="Instagram"><Instagram size={16} /></a>
                            <a href="#" className="fs-btn" aria-label="Youtube"><Youtube size={16} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="footer-heading">Quick Links</h3>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/shop">Products</Link></li>
                            <li><Link to="/categories">Categories</Link></li>
                            <li><Link to="/careers">Careers</Link></li>
                            <li><Link to="/quotes">Get a Quote</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="footer-heading">Support</h3>
                        <ul className="footer-links">
                            <li><Link to="/">Help Center</Link></li>
                            <li><Link to="/">Shipping Policy</Link></li>
                            <li><Link to="/">Return & Refund</Link></li>
                            <li><Link to="/">Order Tracking</Link></li>
                            <li><Link to="/">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="footer-heading">Newsletter</h3>
                        <p className="footer-newsletter-text">
                            Subscribe for the latest medical product updates and exclusive offers.
                        </p>
                        <div className="newsletter-form">
                            <input type="email" placeholder="Your email address" />
                            <button className="nl-btn">Subscribe</button>
                        </div>
                        {/* Trust badges */}
                        <div className="footer-badges">
                            <span className="fb-badge">ISO 13485</span>
                            <span className="fb-badge">CE Marked</span>
                            <span className="fb-badge">FDA Cleared</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom bar */}
            <div className="footer-bottom">
                <div className="container footer-bottom-inner">
                    <p>© 2026 AR Surgical Hub. All rights reserved.</p>
                    <div className="footer-bottom-links">
                        <Link to="/">Privacy Policy</Link>
                        <Link to="/">Terms of Service</Link>
                        <Link to="/">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
