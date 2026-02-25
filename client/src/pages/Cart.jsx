import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    const { cart, removeFromCart, cartTotal, clearCart } = useCart();

    if (cart.length === 0) {
        return (
            <div className="cart-empty container">
                <ShoppingBag size={64} className="empty-icon" />
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added any surgical instruments yet.</p>
                <Link to="/shop" className="btn-primary">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="cart-page container">
            <h1>Shopping <span>Cart</span></h1>
            <div className="cart-grid">
                <div className="cart-items">
                    {cart.map((item) => (
                        <div key={item.id} className="cart-item bg-glass">
                            <img src={item.image_url || 'https://via.placeholder.com/80x80'} alt={item.name} />
                            <div className="item-details">
                                <h3>{item.name}</h3>
                                <p className="item-price">${item.price}</p>
                            </div>
                            <div className="item-quantity">
                                <span>Qty: {item.quantity}</span>
                            </div>
                            <div className="item-subtotal">
                                <p>${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="btn-remove"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    <button onClick={clearCart} className="btn-clear">Clear Cart</button>
                </div>
                <div className="cart-summary bg-glass">
                    <h3>Order Summary</h3>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>FREE</span>
                    </div>
                    <div className="summary-total">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <Link to="/checkout" className="btn-primary w-full checkout-btn">
                        Proceed to Checkout <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;
