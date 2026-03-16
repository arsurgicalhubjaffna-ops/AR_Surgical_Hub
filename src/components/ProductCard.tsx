import React from 'react';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Product } from '../types';
import ProductImage from './ProductImage';

interface ProductCardProps {
    product: Product & { category_name?: string | null };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const inWishlist = isInWishlist(product.id);

    return (
        <div className="bg-white border border-black/8 rounded-xl overflow-hidden flex flex-col transition-all duration-280 hover:shadow-lg hover:-translate-y-1 hover:border-brand-green/25 peer">
            {/* Image area */}
            <div className="relative overflow-hidden bg-brand-bg aspect-[4/3] group">
                <ProductImage
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Category badge */}
                {product.category_name && (
                    <span className="absolute top-2.5 left-2.5 bg-brand-green text-white text-[0.62rem] font-700 uppercase tracking-tight px-2 py-1 rounded">
                        {product.category_name}
                    </span>
                )}

                {/* Hover overlay */}
                <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-0 transition-opacity duration-220 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 max-md:opacity-100">
                    <Link to={`/product/${product.id}`} className="w-8 h-8 rounded-lg bg-white border border-black/8 text-secondary flex items-center justify-center cursor-pointer transition-all duration-200 shadow-sm hover:bg-brand-green-light hover:border-brand-green hover:text-brand-green no-underline" title="Quick View">
                        <Eye size={16} />
                    </Link>
                    <button
                        className={`w-8 h-8 rounded-lg bg-white border border-black/8 flex items-center justify-center cursor-pointer transition-all duration-200 shadow-sm hover:bg-brand-green-light hover:border-brand-green hover:text-brand-green ${inWishlist ? 'bg-brand-green-light border-brand-green text-brand-green' : 'text-secondary'}`}
                        onClick={() => toggleWishlist(product)}
                        title="Wishlist"
                    >
                        <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
                    </button>
                </div>
            </div>

            {/* Card body */}
            <div className="p-3.5 md:p-4 flex flex-col gap-1.25 flex-1">
                <span className="text-brand-green text-[0.7rem] font-600 uppercase tracking-tight">
                    {product.category_name || 'Instrument'}
                </span>
                <Link to={`/product/${product.id}`} className="font-header text-[0.92rem] font-700 text-brand-text leading-tight transition-colors duration-200 hover:text-brand-green line-clamp-2 no-underline">
                    {product.name}
                </Link>

                {/* Rating (decorative) */}
                <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => (
                        <span key={i} className={`pc-star text-[0.85rem] ${i <= 4 ? 'text-brand-blue' : 'text-brand-border'}`}>★</span>
                    ))}
                    <span className="text-[0.75rem] text-brand-text-muted ml-1.5">(24)</span>
                </div>

                {/* Price + Cart */}
                <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-black/8 gap-2">
                    Rs. {typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2)}
                    <button
                        className="inline-flex items-center gap-1.25 bg-brand-green text-white border-none px-3 py-1.75 rounded-md text-[0.75rem] font-600 cursor-pointer font-primary transition-colors duration-200 hover:bg-brand-green-dark whitespace-nowrap"
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
