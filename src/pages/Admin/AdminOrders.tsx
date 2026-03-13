import React, { useState, useEffect } from 'react';
import insforge from '../../lib/insforge';
import { ClipboardList, ChevronDown, CheckCircle, Clock, Truck, XCircle, Eye, X, Package, MapPin, CreditCard } from 'lucide-react';
import ProductImage from '../../components/ProductImage';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

interface OrderDetailModalProps {
    order: any;
    onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const { data, error } = await insforge.database
                    .from('order_items')
                    .select('*, products(name, image_url)')
                    .eq('order_id', order.id);
                if (error) throw error;
                setItems(data || []);
            } catch (err) {
                console.error('Error fetching order items:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, [order.id]);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
                {/* Modal Header */}
                <div className="px-8 py-6 border-b border-black/5 flex items-center justify-between bg-brand-bg/10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-800 tracking-tight text-brand-text">Order Details</h3>
                            <span className="text-[0.7rem] font-700 text-gray-400 uppercase tracking-widest px-2 py-0.5 bg-white rounded-md border border-black/5">
                                #{order.id.slice(0, 12)}
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 font-500">View procurement items and delivery information</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400 hover:text-brand-text shadow-sm"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
                        {/* Left Column: Items */}
                        <div className="space-y-6">
                            <div className="bg-brand-bg/30 rounded-2xl border border-black/5 overflow-hidden">
                                <div className="px-5 py-3 border-b border-black/5 flex items-center gap-2">
                                    <Package size={16} className="text-brand-green" />
                                    <span className="text-[0.65rem] font-900 uppercase tracking-widest text-brand-text">Procurement Ledger</span>
                                </div>
                                <div className="divide-y divide-black/5">
                                    {loading ? (
                                        <div className="p-8 text-center italic text-gray-400 animate-pulse font-500">Syncing instrument data...</div>
                                    ) : items.length === 0 ? (
                                        <div className="p-8 text-center italic text-gray-400 font-500">No items found in this procurement.</div>
                                    ) : (
                                        items.map((item) => (
                                            <div key={item.id} className="p-5 flex items-center gap-5 hover:bg-white/40 transition-colors">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-black/5 shadow-sm">
                                                    <ProductImage src={item.products?.image_url} alt={item.products?.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-800 text-brand-text text-sm mb-1">{item.products?.name}</h4>
                                                    <div className="flex items-center gap-3 text-xs text-gray-400 font-600">
                                                        <span>Qty: {item.quantity}</span>
                                                        <span className="w-1 h-1 rounded-full bg-black/10"></span>
                                                        <span>Rs. {Number(item.price).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-900 text-brand-text text-sm">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="p-5 bg-brand-green/5 border-t border-black/5 flex justify-between items-center">
                                    <span className="text-xs font-800 uppercase tracking-widest text-gray-500">Total Procurement</span>
                                    <span className="text-lg font-900 text-brand-green font-header">Rs. {Number(order.total_amount).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Info */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl border border-black/5 p-5 shadow-sm">
                                <h4 className="text-[0.65rem] font-900 uppercase tracking-widest text-brand-text mb-4 flex items-center gap-2">
                                    <MapPin size={14} className="text-brand-green" /> Delivery Destination
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <span className="block text-[0.6rem] font-800 text-gray-400 uppercase tracking-widest mb-1">Customer Info</span>
                                        <p className="text-xs font-800 text-brand-text">{order.full_name}</p>
                                        <p className="text-[0.65rem] text-gray-400 font-600 truncate">{order.email}</p>
                                        <p className="text-[0.65rem] text-brand-green font-700 mt-1">{order.phone}</p>
                                    </div>
                                    <div className="pt-3 border-t border-black/5">
                                        <span className="block text-[0.6rem] font-800 text-gray-400 uppercase tracking-widest mb-1.5">Address</span>
                                        <p className="text-xs font-600 text-brand-text leading-relaxed bg-brand-bg/50 p-3 rounded-xl border border-black/5 italic">
                                            {order.shipping_address || 'Address not registered'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-black/5 p-5 shadow-sm">
                                <h4 className="text-[0.65rem] font-900 uppercase tracking-widest text-brand-text mb-4 flex items-center gap-2">
                                    <CreditCard size={14} className="text-brand-green" /> Financial Summary
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <span className="block text-[0.6rem] font-800 text-gray-400 uppercase tracking-widest mb-1.5">Payment Status</span>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[0.6rem] font-900 uppercase tracking-widest border ${order.payment_status === 'paid' ? 'bg-brand-green/10 text-brand-green border-brand-green/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                            {order.payment_status}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[0.6rem] font-800 text-gray-400 uppercase tracking-widest mb-1.5">Method</span>
                                        <span className="text-xs font-700 text-brand-text capitalize">{order.payment_method?.replace('_', ' ') || 'Direct Debit'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-black/5 bg-brand-bg/10 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2.5 bg-brand-text text-white rounded-xl text-xs font-800 uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95"
                    >
                        Close Portal
                    </button>
                </div>
            </div>
        </div>
    );
};

const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

    const load = async () => {
        try {
            const { data, error } = await insforge.database
                .from('orders')
                .select('*, users(full_name, email, phone)')
                .order('created_at', { ascending: false });
            if (error) throw error;
            const mapped = (data || []).map(o => ({
                ...o,
                full_name: o.users?.full_name || null,
                email: o.users?.email || null,
                phone: o.users?.phone || null,
            }));
            setOrders(mapped);
        } catch (err) {
            console.error('Order Load Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            const { error } = await insforge.database
                .from('orders')
                .update({ status })
                .eq('id', id);
            if (error) throw error;
            load();
        } catch (err) {
            alert('Failed to update order status');
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-brand-green/10 text-brand-green border-brand-green/20';
            case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'cancelled': return 'bg-brand-red/10 text-brand-red border-brand-red/20';
            case 'shipped': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'processing': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };

    if (loading) return <div className="text-secondary italic animate-pulse">Retrieving order ledger...</div>;

    return (
        <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
            <div className="px-8 py-8 border-b border-black/5 flex items-center justify-between bg-brand-bg/10">
                <div>
                    <h2 className="text-xl font-800 tracking-tight text-brand-text">Order Management</h2>
                    <p className="text-sm text-gray-400 font-500">Monitor and process customer procurement requests</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-black/5 shadow-sm">
                    <ClipboardList size={18} className="text-brand-green" />
                    <span className="text-sm font-800 text-brand-text">{orders.length} Total</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-brand-bg/50 border-b border-black/5">
                            <th className="px-6 py-4 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Tracking ID</th>
                            <th className="px-6 py-4 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Practitioner / Facility</th>
                            <th className="px-6 py-4 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Procurement Total</th>
                            <th className="px-6 py-4 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Payment</th>
                            <th className="px-6 py-4 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Flow Status</th>
                            <th className="px-6 py-4 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                        {orders.map(o => (
                            <tr key={o.id} className="hover:bg-brand-bg/30 transition-colors">
                                <td className="px-6 py-5 font-mono text-[0.75rem] text-gray-500">#{o.id.slice(0, 12)}</td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-700 text-brand-text text-sm">{o.full_name || 'Anonymous Practitioner'}</span>
                                        <span className="text-[0.7rem] text-gray-400">{o.email || 'no-email@arsurgical.com'}</span>
                                        {o.phone && <span className="text-[0.7rem] text-brand-green font-600 tracking-tight mt-0.5">{o.phone}</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-5 font-800 text-brand-text text-sm font-header">Rs. {Number(o.total_amount).toFixed(2)}</td>
                                <td className="px-6 py-5">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[0.65rem] font-800 uppercase tracking-widest border ${o.payment_status === 'paid' ? 'bg-brand-green/10 text-brand-green border-brand-green/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                        {o.payment_status}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="relative inline-block">
                                        <select
                                            className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-[0.7rem] font-800 uppercase tracking-widest border transition-all cursor-pointer outline-none focus:ring-2 focus:ring-brand-green/20 ${getStatusStyles(o.status)}`}
                                            value={o.status}
                                            onChange={e => updateStatus(o.id, e.target.value)}
                                        >
                                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <button 
                                        onClick={() => setSelectedOrder(o)}
                                        className="p-2.5 bg-brand-bg hover:bg-brand-green/10 text-gray-400 hover:text-brand-green rounded-xl transition-all border border-black/5 hover:border-brand-green/20 active:scale-90"
                                        title="View ordered products"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedOrder && (
                <OrderDetailModal 
                    order={selectedOrder} 
                    onClose={() => setSelectedOrder(null)} 
                />
            )}

            {orders.length === 0 && (
                <div className="p-20 text-center text-gray-400 italic">No procurement records found in the ledger.</div>
            )}
        </div>
    );
};

export default AdminOrders;
