import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import insforge from '../lib/insforge';
import { CreditCard, Landmark, ShieldCheck, ArrowRight, Clock, Phone } from 'lucide-react';

const Checkout: React.FC = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [address, setAddress] = useState('');

    // Clean up any existing phone formats (e.g. +91-XXX) to just take the last 9 digits for the local input
    const rawPhone = (user?.phone || '').replace(/[^0-9]/g, '');
    // If it starts with 94, or is longer than 9, just take the local 9 digits
    const initialPhone = rawPhone.length > 9 ? rawPhone.slice(-9) : rawPhone;

    const [phone, setPhone] = useState(initialPhone);
    const [loading, setLoading] = useState(false);

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to complete your order.');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            // Update user profile with phone number if provided/changed
            const fullPhone = `+94${phone.trim()}`;
            if (fullPhone && fullPhone !== user.phone) {
                await insforge.database
                    .from('users')
                    .update({ phone: fullPhone })
                    .eq('id', user.id);
            }

            // Create order
            const { data: order, error: orderError } = await insforge.database
                .from('orders')
                .insert([{
                    user_id: user.id,
                    total_amount: cartTotal,
                    shipping_address: address,
                    payment_method: 'manual_confirmation',
                    status: 'pending',
                    payment_status: 'unpaid',
                }])
                .select()
                .single();

            if (orderError) throw orderError;

            // Create order items
            const orderItems = cart.map(item => ({
                order_id: order.id,
                product_id: item.id,
                quantity: item.quantity,
                price: item.price
            }));

            const { error: itemsError } = await insforge.database
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            alert('Order placed successfully!');
            clearCart();
            navigate('/');
        } catch (err) {
            console.error('Checkout error:', err);
            alert('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-5">
                <h2 className="text-2xl font-800 text-brand-text mb-4">No Items for Checkout</h2>
                <p className="text-secondary mb-8">Your shopping cart is currently empty. Add some instruments to proceed.</p>
                <button onClick={() => navigate('/shop')} className="bg-brand-green text-white px-8 py-3 rounded-xl font-700">Go to Shop</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-bg pb-20">
            {/* Header */}
            <div className="bg-white border-b border-black/8 py-10 md:py-14 mb-10">
                <div className="max-w-[1400px] mx-auto px-5 md:px-10">
                    <h1 className="text-3xl md:text-4xl font-800 tracking-tighter text-brand-text">
                        Complete <span className="text-brand-green">Purchase</span>
                    </h1>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-5 md:px-10">
                <form className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10" onSubmit={handleCheckout}>

                    {/* Form Section */}
                    <div className="bg-white border border-black/8 p-8 md:p-10 rounded-[32px] shadow-sm flex flex-col gap-10">
                        {/* Delivery Info */}
                        <section className="flex flex-col gap-6">
                            <h3 className="text-lg font-800 text-brand-green flex items-center gap-2">
                                <Landmark size={20} /> Shipping & Contact Information
                            </h3>

                            <div>
                                <label className="block text-sm font-700 text-brand-text mb-2.5">Contact Number</label>
                                <div className="relative flex items-center bg-brand-bg border border-black/8 rounded-xl focus-within:border-brand-green transition-all overflow-hidden">
                                    <div className="flex items-center gap-2 pl-4 pr-3 py-3.5 border-r border-black/8 bg-black/5 text-gray-500 font-700 select-none">
                                        <Phone size={18} className="text-brand-green" />
                                        <span>+94</span>
                                    </div>
                                    <input
                                        type="tel"
                                        className="w-full bg-transparent px-4 py-3.5 text-brand-text outline-none focus:ring-0"
                                        placeholder="7X XXX XXXX"
                                        required
                                        value={phone}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            if (val.length <= 9) setPhone(val);
                                        }}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1.5 font-500">Required for manual order confirmation (without leading 0).</p>
                            </div>

                            <div>
                                <label className="block text-sm font-700 text-brand-text mb-2.5">Delivery Address</label>
                                <textarea
                                    className="w-full bg-brand-bg border border-black/8 rounded-2xl p-5 text-brand-text outline-none focus:border-brand-green transition-all resize-none min-h-[120px]"
                                    placeholder="Enter your full shipping address (Street, City, District, Postal Code)"
                                    required
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                ></textarea>
                            </div>
                        </section>

                        {/* Payment Confirmation Info */}
                        <section className="bg-brand-green/5 border border-brand-green/20 p-6 rounded-2xl">
                            <h3 className="text-lg font-800 text-brand-green mb-3 flex items-center gap-2">
                                <ShieldCheck size={20} /> Order Confirmation Process
                            </h3>
                            <p className="text-secondary text-sm leading-relaxed mb-4">
                                After placing your order, our administrative team will contact you directly to confirm the details and arrange the fulfillment process.
                            </p>
                            <div className="flex items-center gap-3 text-brand-green text-[0.75rem] font-700 uppercase tracking-widest bg-white/50 w-fit px-3 py-1.5 rounded-lg border border-brand-green/10">
                                <Clock size={14} /> Admin will contact you shortly
                            </div>
                        </section>

                        {/* Future Implementation */}
                        <section className="opacity-50 grayscale">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-800 text-gray-400 flex items-center gap-2">
                                    <CreditCard size={20} /> Payment Method
                                </h3>
                                <span className="text-[0.6rem] font-800 uppercase tracking-[0.1em] bg-gray-100 text-gray-400 px-2 py-0.5 rounded">Future Implementation</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pointer-events-none">
                                <div className="flex items-center gap-4 p-5 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                                    <span className="font-700 text-gray-300">Credit Card</span>
                                </div>
                                <div className="flex items-center gap-4 p-5 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                                    <span className="font-700 text-gray-300">Bank Transfer</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Summary Sidebar */}
                    <aside className="bg-white border border-black/8 p-8 md:p-10 rounded-[32px] shadow-sm sticky top-24 h-fit">
                        <h3 className="text-xl font-800 tracking-tight text-brand-text mb-8">Order Review</h3>

                        <div className="flex flex-col gap-4 mb-8">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-start gap-4 text-sm">
                                    <div className="flex-1">
                                        <p className="font-700 text-brand-text line-clamp-1">{item.name}</p>
                                        <span className="text-gray-400 font-500">Qty: {item.quantity}</span>
                                    </div>
                                    <span className="text-brand-green font-700 font-header shrink-0">
                                        Rs. {(item.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-black/8 pt-6 mb-8">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-800 text-brand-text">Total to Pay</span>
                                <span className="text-2xl font-800 text-brand-green font-header">Rs. {cartTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 bg-brand-green text-white w-full py-4 rounded-xl font-800 no-underline transition-all duration-200 hover:bg-brand-green-dark hover:-translate-y-0.5 shadow-lg shadow-brand-green/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : (<>Place Secure Order <ArrowRight size={18} /></>)}
                        </button>

                        <div className="mt-6 flex flex-col items-center gap-3">
                            <div className="flex items-center gap-2 text-[0.7rem] text-brand-green font-700 uppercase tracking-widest">
                                <ShieldCheck size={14} /> Secure Checkout
                            </div>
                            <p className="text-center text-[0.72rem] text-gray-400">By placing an order, you agree to AR SURGICAL HUB's terms and conditions.</p>
                        </div>
                    </aside>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
