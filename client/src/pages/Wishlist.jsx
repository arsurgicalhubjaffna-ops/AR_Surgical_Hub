import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Wishlist.css';

const Wishlist = () => {
    const { wishlist } = useWishlist();

    if (wishlist.length === 0) {
        return (
            <div className="wishlist-empty container">
                <Heart size={64} className="empty-icon" />
                <h2>Your wishlist is empty</h2>
                <p>Save items you're interested in for later.</p>
                <Link to="/shop" className="btn-primary">Explore Products</Link>
            </div>
        );
    }

    return (
        <div className="wishlist-page container">
            <h1>Your <span>Wishlist</span></h1>
            <div className="product-grid">
                {wishlist.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
