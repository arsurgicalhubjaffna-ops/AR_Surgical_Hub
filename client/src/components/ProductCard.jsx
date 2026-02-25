import React from 'react';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import '../theme.css';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const inWishlist = isInWishlist(product.id);

    return (
        <div className="product-card">
            {/* Image area */}
            <div className="pc-image-wrap">
                <img
                    src={product.image_url || `https://via.placeholder.com/280x200/e8f8f6/00b5a4?text=${encodeURIComponent(product.name || 'Product')}`}
                    alt={product.name}
                    className="pc-img"
                />

                {/* Category badge */}
                {product.category_name && (
                    <span className="pc-cat-badge">{product.category_name}</span>
                )}

                {/* Hover overlay */}
                <div className="pc-overlay">
                    <Link to={`/product/${product.id}`} className="pc-icon-btn" title="Quick View">
                        <Eye size={16} />
                    </Link>
                    <button
                        className={`pc-icon-btn ${inWishlist ? 'active' : ''}`}
                        onClick={() => toggleWishlist(product)}
                        title="Wishlist"
                    >
                        <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
                    </button>
                </div>
            </div>

            {/* Card body */}
            <div className="pc-body">
                <span className="pc-category">{product.category_name || 'Instrument'}</span>
                <Link to={`/product/${product.id}`} className="pc-name">{product.name}</Link>

                {/* Rating (decorative) */}
                <div className="pc-stars">
                    {[1, 2, 3, 4, 5].map(i => (
                        <span key={i} className={`pc-star ${i <= 4 ? 'filled' : ''}`}>★</span>
                    ))}
                    <span className="pc-reviews">(24)</span>
                </div>

                {/* Price + Cart */}
                <div className="pc-footer">
                    <span className="pc-price">${parseFloat(product.price).toFixed(2)}</span>
                    <button
                        className="pc-add-btn"
                        onClick={() => addToCart(product)}
                        title="Add to Cart"
                    >
                        <ShoppingCart size={15} />
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
