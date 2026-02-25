import { ShoppingCart, User, Menu, Search, Phone, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import '../theme.css';
import './Header.css';

const Header = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();

    return (
        <header className="header bg-glass">
            <div className="container">
                <div className="header-top">
                    <div className="contact-info">
                        <span><Phone size={14} /> +1 (555) 123-4567</span>
                        <span><Mail size={14} /> support@arsurgical.com</span>
                    </div>
                    <div className="user-links">
                        {user ? (
                            <div className="user-profile">
                                <span>Welcome, {user.full_name}</span>
                                <button onClick={logout} className="toggle-btn">Logout</button>
                            </div>
                        ) : (
                            <Link to="/login"><User size={18} /> Login / Register</Link>
                        )}
                    </div>
                </div>
                <nav className="header-main">
                    <Link to="/" className="logo">
                        <img src="/ar.svg" alt="AR Surgical Hub" className="logo-img" />
                        <span className="logo-text">Surgical Hub</span>
                    </Link>
                    <div className="nav-links">
                        <Link to="/">Home</Link>
                        <Link to="/shop">Products</Link>
                        <Link to="/categories">Categories</Link>
                        <Link to="/careers">Careers</Link>
                        <Link to="/quotes">Get a Quote</Link>
                    </div>
                    <div className="header-actions">
                        <div className="search-bar bg-glass">
                            <input type="text" placeholder="Search instruments..." />
                            <Search size={18} />
                        </div>
                        <Link to="/cart" className="cart-link">
                            <ShoppingCart size={22} />
                            <span className="cart-count">{cartCount}</span>
                        </Link>
                        <Link to="/wishlist" className="cart-link">
                            <Heart size={22} />
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
