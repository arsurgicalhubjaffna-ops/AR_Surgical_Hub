import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Checkout.css';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('credit_card');

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to complete your order.');
            navigate('/login');
            return;
        }

        try {
            const orderData = {
                user_id: user.id,
                total_amount: cartTotal,
                shipping_address: address,
                payment_method: paymentMethod,
                items: cart.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            await axios.post('http://localhost:5000/api/orders', orderData);
            alert('Order placed successfully!');
            clearCart();
            navigate('/');
        } catch (err) {
            console.error(err);
            alert('Failed to place order.');
        }
    };

    return (
        <div className="checkout-page container">
            <h1>Complete <span>Purchase</span></h1>
            <form className="checkout-grid" onSubmit={handleCheckout}>
                <div className="checkout-form bg-glass">
                    <h3>Shipping Information</h3>
                    <div className="input-group">
                        <textarea
                            placeholder="Full Shipping Address"
                            required
                            rows="4"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        ></textarea>
                    </div>
                    <h3>Payment Method</h3>
                    <div className="payment-options">
                        <label className="payment-option bg-glass">
                            <input
                                type="radio"
                                name="payment"
                                value="credit_card"
                                checked={paymentMethod === 'credit_card'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <span>Credit Card</span>
                        </label>
                        <label className="payment-option bg-glass">
                            <input
                                type="radio"
                                name="payment"
                                value="bank_transfer"
                                checked={paymentMethod === 'bank_transfer'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <span>Bank Transfer</span>
                        </label>
                    </div>
                </div>
                <div className="checkout-summary bg-glass">
                    <h3>Order Review</h3>
                    <div className="summary-items">
                        {cart.map(item => (
                            <div key={item.id} className="summary-item">
                                <span>{item.name} x {item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="summary-total">
                        <span>Total to Pay</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <button type="submit" className="btn-primary w-full checkout-btn">
                        Place Secure Order
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Checkout;
