import React, { useState, useEffect } from 'react';
import insforge from '../../lib/insforge';
import { ShoppingBag, Users, Package, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, ShieldCheck } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [productsRes, usersRes, ordersRes, warrantyRes] = await Promise.all([
                    insforge.database.from('products').select('id', { count: 'exact', head: true }),
                    insforge.database.from('users').select('id', { count: 'exact', head: true }),
                    insforge.database.from('orders').select('id, total_amount, payment_status'),
                    insforge.database.from('warranty_claims').select('id', { count: 'exact', head: true }),
                ]);

                const totalOrders = ordersRes.data?.length || 0;
                const revenue = (ordersRes.data || [])
                    .filter(o => o.payment_status === 'paid')
                    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

                setStats({
                    products: productsRes.count || 0,
                    users: usersRes.count || 0,
                    orders: totalOrders,
                    revenue: revenue,
                    warranty: warrantyRes.count || 0,
                });

                const { data: recentOrders } = await insforge.database
                    .from('orders')
                    .select('*, users(full_name, email, phone)')
                    .order('created_at', { ascending: false })
                    .limit(8);

                const mapped = (recentOrders || []).map(o => ({
                    ...o,
                    full_name: o.users?.full_name || null,
                    email: o.users?.email || null,
                    phone: o.users?.phone || null,
                }));
                setOrders(mapped);
            } catch (err) {
                console.error('Dashboard Error:', err);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="text-brand-green-dark animate-pulse font-700 tracking-tight flex items-center gap-3">
                <Package className="animate-bounce" /> Synchronizing dashboard data...
            </div>
        </div>
    );

    const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
        <div className="bg-brand-surface p-6 md:p-8 rounded-[24px] border border-brand-border shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 group">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${color} text-white shadow-lg shadow-current/20`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-800 ${trend > 0 ? 'text-brand-green' : 'text-brand-red'}`}>
                        {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <h3 className="text-gray-400 font-700 text-[0.8rem] uppercase tracking-widest mb-1">{title}</h3>
            <p className="text-3xl font-900 text-brand-text tracking-tighter">
                {title === 'Revenue' ? `Rs. ${Number(value).toLocaleString()}` : value}
            </p>
        </div>
    );

    return (
        <div className="flex flex-col gap-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard title="Products" value={stats?.products} icon={Package} color="bg-blue-500" trend={12} />
                <StatCard title="Total Users" value={stats?.users} icon={Users} color="bg-brand-green" trend={8} />
                <StatCard title="Total Orders" value={stats?.orders} icon={ShoppingBag} color="bg-purple-500" trend={-2} />
                <StatCard title="Revenue" value={stats?.revenue} icon={DollarSign} color="bg-amber-500" trend={24} />
                <StatCard title="Warranty Claims" value={stats?.warranty} icon={ShieldCheck} color="bg-rose-500" />
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden">
                <div className="px-8 py-8 flex items-center justify-between border-b border-black/5">
                    <div>
                        <h2 className="text-xl font-800 tracking-tight text-brand-text">Recent Orders</h2>
                        <p className="text-sm text-gray-400 font-500">Live transaction stream summary</p>
                    </div>
                    <button className="text-brand-green font-700 text-sm hover:underline">View All Orders</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-brand-bg/50 border-b border-black/5">
                                <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Order ID</th>
                                <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Customer</th>
                                <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Transaction</th>
                                <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {orders.map(o => (
                                <tr key={o.id} className="hover:bg-brand-bg/30 transition-colors">
                                    <td className="px-8 py-5 font-mono text-[0.75rem] text-gray-500">#{o.id.slice(0, 8)}</td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-700 text-brand-text text-sm">{o.full_name || 'Guest User'}</span>
                                            <span className="text-[0.7rem] text-gray-400">{o.email || 'no-email@arsurgicalhub.com'}</span>
                                            {o.phone && <span className="text-[0.7rem] text-brand-green font-600 tracking-tight mt-0.5">{o.phone}</span>}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 font-800 text-brand-text text-sm font-header">Rs. {Number(o.total_amount).toFixed(2)}</td>
                                    <td className="px-8 py-5">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[0.65rem] font-800 uppercase tracking-widest ${o.status === 'completed' ? 'bg-brand-green/10 text-brand-green' :
                                            o.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                                                'bg-brand-red/10 text-brand-red'
                                            }`}>
                                            {o.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-gray-400 text-sm font-500">{new Date(o.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {orders.length === 0 && (
                    <div className="p-12 text-center text-gray-400 italic">No recent transactions recorded.</div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
