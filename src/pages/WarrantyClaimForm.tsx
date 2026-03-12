import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Package, ChevronRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import insforge from '../lib/insforge';
import { Order, OrderItem } from '../types';
import { useAuth } from '../context/AuthContext';
import ProductImage from '../components/ProductImage';

const CLAIM_TYPES = [
    { value: 'defective', label: 'Defective Unit', desc: 'Product has manufacturing defects' },
    { value: 'damaged', label: 'Damaged in Transit', desc: 'Product was damaged during shipping' },
    { value: 'malfunction', label: 'Malfunction', desc: 'Product stopped working properly' },
    { value: 'missing_parts', label: 'Missing Parts', desc: 'Parts or accessories are missing' },
    { value: 'other', label: 'Other Issue', desc: 'Other warranty-related issue' },
];

const WarrantyClaimForm: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Data
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [loadingItems, setLoadingItems] = useState(false);

    // Form state
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [selectedProductId, setSelectedProductId] = useState('');
    const [selectedProductName, setSelectedProductName] = useState('');
    const [claimType, setClaimType] = useState('');
    const [description, setDescription] = useState('');

    // Fetch delivered orders
    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            try {
                const { data, error } = await insforge.database
                    .from('orders')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('status', 'delivered')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setOrders((data || []) as Order[]);
            } catch (err) {
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    // Fetch items for selected order
    const fetchOrderItems = async (orderId: string) => {
        setLoadingItems(true);
        try {
            const { data, error } = await insforge.database
                .from('order_items')
                .select('*, products(name, image_url)')
                .eq('order_id', orderId);

            if (error) throw error;
            setOrderItems((data || []) as OrderItem[]);
        } catch (err) {
            console.error('Error fetching order items:', err);
        } finally {
            setLoadingItems(false);
        }
    };

    const handleOrderSelect = (orderId: string) => {
        setSelectedOrderId(orderId);
        setSelectedProductId('');
        setSelectedProductName('');
        fetchOrderItems(orderId);
        setStep(2);
    };

    const handleProductSelect = (productId: string, productName: string) => {
        setSelectedProductId(productId);
        setSelectedProductName(productName);
        setStep(3);
    };

    const handleSubmit = async () => {
        if (!user || !selectedOrderId || !selectedProductId || !claimType || !description.trim()) {
            alert('Please fill in all required fields');
            return;
        }

        setSubmitting(true);
        try {
            const { error } = await insforge.database
                .from('warranty_claims')
                .insert([{
                    user_id: user.id,
                    order_id: selectedOrderId,
                    product_id: selectedProductId,
                    claim_type: claimType,
                    description: description.trim(),
                    status: 'submitted',
                    priority: 'medium',
                }]);

            if (error) throw error;
            navigate('/my-warranty');
        } catch (err: any) {
            console.error('Submit error:', err);
            alert('Failed to submit warranty claim. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-brand-bg min-h-screen pt-28 pb-20">
                <div className="max-w-[700px] mx-auto px-5 animate-pulse">
                    <div className="h-6 w-32 bg-gray-200 rounded mb-8"></div>
                    <div className="h-60 bg-gray-200 rounded-3xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-brand-bg min-h-screen pt-28 pb-20">
            <div className="max-w-[700px] mx-auto px-5">
                <Link to="/my-warranty" className="inline-flex items-center gap-2 text-sm font-700 text-gray-500 hover:text-brand-green transition-colors mb-8">
                    <ArrowLeft size={16} /> Back to Warranty Claims
                </Link>

                <div className="mb-10">
                    <h1 className="text-3xl font-900 tracking-tighter text-brand-text mb-2">File Warranty Claim</h1>
                    <p className="text-secondary font-500">Submit a warranty claim for a delivered surgical instrument.</p>
                </div>

                {/* Progress Indicator */}
                <div className="bg-white rounded-[24px] border border-black/5 p-6 shadow-sm mb-8">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute top-5 left-[30px] right-[30px] h-1 bg-gray-100 z-0">
                            <div
                                className="h-full bg-brand-green transition-all duration-500 ease-out"
                                style={{ width: `${((step - 1) / 3) * 100}%` }}
                            ></div>
                        </div>
                        {[
                            { label: 'Select Order', num: 1 },
                            { label: 'Select Product', num: 2 },
                            { label: 'Claim Type', num: 3 },
                            { label: 'Submit', num: 4 },
                        ].map(s => {
                            const active = step >= s.num;
                            return (
                                <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-800 transition-colors duration-300 ${active ? 'bg-brand-green text-white' : 'bg-white border-2 border-gray-100 text-gray-300'}`}>
                                        {s.num}
                                    </div>
                                    <span className={`text-[0.65rem] font-700 uppercase tracking-widest ${active ? 'text-brand-text' : 'text-gray-300'}`}>{s.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Step 1: Select Order */}
                {step === 1 && (
                    <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 bg-brand-bg/50 border-b border-black/5">
                            <h3 className="text-sm font-900 uppercase tracking-widest text-brand-text">Select Delivered Order</h3>
                            <p className="text-xs text-gray-400 font-500 mt-1">Only delivered orders are eligible for warranty claims.</p>
                        </div>
                        {orders.length > 0 ? (
                            <div className="divide-y divide-black/5">
                                {orders.map(order => (
                                    <button
                                        key={order.id}
                                        onClick={() => handleOrderSelect(order.id)}
                                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-brand-bg/30 transition-colors group text-left"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-brand-bg rounded-xl flex items-center justify-center text-brand-green border border-black/5">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <span className="text-sm font-800 text-brand-text">Order #{order.id.slice(0, 8)}</span>
                                                <div className="text-xs text-gray-400 font-500 mt-0.5">
                                                    {new Date(order.created_at).toLocaleDateString()} · {order.total_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className="text-gray-300 group-hover:text-brand-green transition-colors" />
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <AlertTriangle size={32} className="text-gray-300 mx-auto mb-4" />
                                <p className="text-sm text-gray-400 font-500">No delivered orders found. Warranty claims can only be filed for orders that have been delivered.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 2: Select Product */}
                {step === 2 && (
                    <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 bg-brand-bg/50 border-b border-black/5 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-900 uppercase tracking-widest text-brand-text">Select Product</h3>
                                <p className="text-xs text-gray-400 font-500 mt-1">Choose the product you want to claim warranty for.</p>
                            </div>
                            <button onClick={() => setStep(1)} className="text-xs font-700 text-brand-green hover:underline">Change Order</button>
                        </div>
                        {loadingItems ? (
                            <div className="p-12 text-center text-gray-400 animate-pulse">Loading order items...</div>
                        ) : (
                            <div className="divide-y divide-black/5">
                                {orderItems.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleProductSelect(item.product_id, item.products?.name || 'Product')}
                                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-brand-bg/30 transition-colors group text-left"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-xl overflow-hidden border border-black/5 shrink-0">
                                                <ProductImage src={item.products?.image_url} alt={item.products?.name || ''} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <span className="text-sm font-800 text-brand-text">{item.products?.name || 'Product'}</span>
                                                <div className="text-xs text-gray-400 font-500 mt-0.5">
                                                    Qty: {item.quantity} · {item.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} each
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className="text-gray-300 group-hover:text-brand-green transition-colors" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Step 3: Claim Type */}
                {step === 3 && (
                    <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 bg-brand-bg/50 border-b border-black/5 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-900 uppercase tracking-widest text-brand-text">Select Issue Type</h3>
                                <p className="text-xs text-gray-400 font-500 mt-1">For: <strong>{selectedProductName}</strong></p>
                            </div>
                            <button onClick={() => setStep(2)} className="text-xs font-700 text-brand-green hover:underline">Change Product</button>
                        </div>
                        <div className="p-6 space-y-3">
                            {CLAIM_TYPES.map(ct => (
                                <button
                                    key={ct.value}
                                    onClick={() => {
                                        setClaimType(ct.value);
                                        setStep(4);
                                    }}
                                    className={`w-full text-left px-5 py-4 rounded-xl border transition-all group ${claimType === ct.value
                                        ? 'border-brand-green bg-brand-green/5'
                                        : 'border-black/5 hover:border-brand-green/30 hover:bg-brand-bg/30'
                                        }`}
                                >
                                    <span className="font-800 text-sm text-brand-text group-hover:text-brand-green transition-colors">{ct.label}</span>
                                    <p className="text-xs text-gray-400 font-500 mt-0.5">{ct.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 4: Description & Submit */}
                {step === 4 && (
                    <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 bg-brand-bg/50 border-b border-black/5 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-900 uppercase tracking-widest text-brand-text">Describe the Issue</h3>
                                <p className="text-xs text-gray-400 font-500 mt-1">{selectedProductName} · {CLAIM_TYPES.find(c => c.value === claimType)?.label}</p>
                            </div>
                            <button onClick={() => setStep(3)} className="text-xs font-700 text-brand-green hover:underline">Change Type</button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Summary */}
                            <div className="bg-brand-bg/50 rounded-xl p-4 border border-black/5">
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div>
                                        <span className="block font-700 text-gray-400 uppercase tracking-widest mb-1">Order</span>
                                        <span className="font-800 text-brand-text">#{selectedOrderId.slice(0, 8)}</span>
                                    </div>
                                    <div>
                                        <span className="block font-700 text-gray-400 uppercase tracking-widest mb-1">Product</span>
                                        <span className="font-800 text-brand-text">{selectedProductName}</span>
                                    </div>
                                    <div>
                                        <span className="block font-700 text-gray-400 uppercase tracking-widest mb-1">Issue Type</span>
                                        <span className="font-800 text-brand-text">{CLAIM_TYPES.find(c => c.value === claimType)?.label}</span>
                                    </div>
                                    <div>
                                        <span className="block font-700 text-gray-400 uppercase tracking-widest mb-1">Priority</span>
                                        <span className="font-800 text-yellow-600">Medium</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-800 text-gray-400 uppercase tracking-widest mb-2">
                                    Detailed Description *
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={5}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-500 resize-none focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green/30 transition-all"
                                    placeholder="Please describe the issue in detail. Include when the issue occurred, any observable symptoms, and the current condition of the instrument..."
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    onClick={() => setStep(3)}
                                    className="px-6 py-3 rounded-xl text-sm font-700 text-gray-500 hover:bg-brand-bg border border-black/5 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting || !description.trim()}
                                    className="flex-1 px-6 py-3 rounded-xl text-sm font-800 bg-brand-green text-white hover:bg-brand-green-dark transition-colors shadow-lg shadow-brand-green/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting ? 'Submitting...' : (
                                        <><ShieldCheck size={18} /> Submit Warranty Claim</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WarrantyClaimForm;
