import React, { useState, useEffect } from 'react';
import insforge from '../../lib/insforge';
import { WarrantyClaim } from '../../types';
import {
    ShieldCheck, ChevronDown, Search, AlertTriangle, CheckCircle2,
    Clock, XCircle, Eye, X, MessageSquare, Filter
} from 'lucide-react';

const STATUSES = ['submitted', 'under_review', 'approved', 'rejected', 'resolved'];
const PRIORITIES = ['low', 'medium', 'high', 'critical'];

const AdminWarranty: React.FC = () => {
    const [claims, setClaims] = useState<WarrantyClaim[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClaim, setSelectedClaim] = useState<WarrantyClaim | null>(null);
    const [adminNotes, setAdminNotes] = useState('');
    const [resolution, setResolution] = useState('');
    const [updating, setUpdating] = useState(false);

    const load = async () => {
        try {
            const { data, error } = await insforge.database
                .from('warranty_claims')
                .select('*, users(full_name, email, phone), orders(id, total_amount, status, created_at), products(name, image_url)')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setClaims((data || []) as WarrantyClaim[]);
        } catch (err) {
            console.error('Warranty Load Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const updateClaimStatus = async (id: string, status: string) => {
        try {
            const updateData: any = { status, updated_at: new Date().toISOString() };
            const { error } = await insforge.database
                .from('warranty_claims')
                .update(updateData)
                .eq('id', id);
            if (error) throw error;
            load();
        } catch (err) {
            alert('Failed to update warranty status');
        }
    };

    const updateClaimDetails = async () => {
        if (!selectedClaim) return;
        setUpdating(true);
        try {
            const updateData: any = { updated_at: new Date().toISOString() };
            if (adminNotes) updateData.admin_notes = adminNotes;
            if (resolution) updateData.resolution = resolution;

            const { error } = await insforge.database
                .from('warranty_claims')
                .update(updateData)
                .eq('id', selectedClaim.id);
            if (error) throw error;
            setSelectedClaim(null);
            setAdminNotes('');
            setResolution('');
            load();
        } catch (err) {
            alert('Failed to update claim details');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'submitted': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
            case 'under_review': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
            case 'approved': return 'bg-brand-green/10 text-brand-green border-brand-green/20';
            case 'rejected': return 'bg-brand-red/10 text-brand-red border-brand-red/20';
            case 'resolved': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };

    const getPriorityStyles = (priority: string) => {
        switch (priority) {
            case 'critical': return 'bg-red-600/10 text-red-600 border-red-600/20';
            case 'high': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
            case 'medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
            case 'low': return 'bg-gray-100 text-gray-500 border-gray-200';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };

    const getClaimTypeLabel = (type: string) => {
        switch (type) {
            case 'defective': return 'Defective Unit';
            case 'damaged': return 'Damaged in Transit';
            case 'malfunction': return 'Malfunction';
            case 'missing_parts': return 'Missing Parts';
            case 'other': return 'Other Issue';
            default: return type;
        }
    };

    const filteredClaims = claims.filter(c => {
        const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
        const matchesSearch = !searchQuery ||
            c.users?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.products?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const statusCounts = {
        all: claims.length,
        submitted: claims.filter(c => c.status === 'submitted').length,
        under_review: claims.filter(c => c.status === 'under_review').length,
        approved: claims.filter(c => c.status === 'approved').length,
        rejected: claims.filter(c => c.status === 'rejected').length,
        resolved: claims.filter(c => c.status === 'resolved').length,
    };

    if (loading) return <div className="text-secondary italic animate-pulse">Loading warranty claims...</div>;

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
                <div className="px-8 py-8 border-b border-black/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-brand-bg/10">
                    <div>
                        <h2 className="text-xl font-800 tracking-tight text-brand-text">Warranty Claims</h2>
                        <p className="text-sm text-gray-400 font-500">Review and manage customer warranty claim requests</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-black/5 shadow-sm">
                            <ShieldCheck size={18} className="text-brand-green" />
                            <span className="text-sm font-800 text-brand-text">{claims.length} Total</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-black/5 shadow-sm">
                            <AlertTriangle size={18} className="text-amber-500" />
                            <span className="text-sm font-800 text-amber-600">{statusCounts.submitted} Pending</span>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs + Search */}
                <div className="px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-black/5 bg-white">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {[
                            { key: 'all', label: 'All' },
                            { key: 'submitted', label: 'Submitted' },
                            { key: 'under_review', label: 'Under Review' },
                            { key: 'approved', label: 'Approved' },
                            { key: 'rejected', label: 'Rejected' },
                            { key: 'resolved', label: 'Resolved' },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setFilterStatus(tab.key)}
                                className={`px-4 py-2 rounded-lg text-xs font-800 uppercase tracking-widest transition-all ${filterStatus === tab.key
                                    ? 'bg-brand-green text-white shadow-sm'
                                    : 'text-gray-400 hover:bg-brand-bg hover:text-brand-text'
                                    }`}
                            >
                                {tab.label} ({statusCounts[tab.key as keyof typeof statusCounts]})
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 bg-brand-bg px-4 py-2 rounded-xl border border-black/5 w-full md:w-auto">
                        <Search size={16} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search claims..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm font-500 w-full md:w-48"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-brand-bg/50 border-b border-black/5">
                                <th className="px-6 py-4 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Claim ID</th>
                                <th className="px-6 py-4 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-4 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Product</th>
                                <th className="px-6 py-4 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Type</th>
                                <th className="px-6 py-4 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Priority</th>
                                <th className="px-6 py-4 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {filteredClaims.map(claim => (
                                <tr key={claim.id} className="hover:bg-brand-bg/30 transition-colors">
                                    <td className="px-6 py-5 font-mono text-[0.75rem] text-gray-500">#{claim.id.slice(0, 10)}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-700 text-brand-text text-sm">{claim.users?.full_name || 'Unknown'}</span>
                                            <span className="text-[0.7rem] text-gray-400">{claim.users?.email || '—'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="font-700 text-brand-text text-sm">{claim.products?.name || 'Unknown Product'}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-700 text-brand-text">{getClaimTypeLabel(claim.claim_type)}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[0.65rem] font-800 uppercase tracking-widest border ${getPriorityStyles(claim.priority)}`}>
                                            {claim.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="relative inline-block">
                                            <select
                                                className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-[0.7rem] font-800 uppercase tracking-widest border transition-all cursor-pointer outline-none focus:ring-2 focus:ring-brand-green/20 ${getStatusStyles(claim.status)}`}
                                                value={claim.status}
                                                onChange={e => updateClaimStatus(claim.id, e.target.value)}
                                            >
                                                {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                                            </select>
                                            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-gray-400 text-sm font-500">{new Date(claim.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-5">
                                        <button
                                            onClick={() => {
                                                setSelectedClaim(claim);
                                                setAdminNotes(claim.admin_notes || '');
                                                setResolution(claim.resolution || '');
                                            }}
                                            className="p-2 rounded-lg text-gray-400 hover:text-brand-green hover:bg-brand-green/5 transition-all"
                                            title="View Details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredClaims.length === 0 && (
                    <div className="p-20 text-center text-gray-400 italic">No warranty claims match the current filter.</div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedClaim && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedClaim(null)} />
                    <div className="relative bg-white rounded-[28px] border border-black/5 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white rounded-t-[28px] px-8 py-6 border-b border-black/5 flex items-center justify-between z-10">
                            <div>
                                <h3 className="text-lg font-800 tracking-tight text-brand-text">Claim Details</h3>
                                <span className="text-xs font-mono text-gray-400">#{selectedClaim.id.slice(0, 16)}</span>
                            </div>
                            <button onClick={() => setSelectedClaim(null)} className="p-2 rounded-lg hover:bg-brand-bg transition-colors text-gray-400 hover:text-brand-text">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="px-8 py-6 space-y-6">
                            {/* Customer & Product Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-brand-bg/50 rounded-2xl p-5 border border-black/5">
                                    <span className="block text-[0.6rem] font-800 text-gray-400 uppercase tracking-widest mb-2">Customer</span>
                                    <p className="font-800 text-brand-text">{selectedClaim.users?.full_name || 'Unknown'}</p>
                                    <p className="text-xs text-gray-400">{selectedClaim.users?.email}</p>
                                    {selectedClaim.users?.phone && <p className="text-xs text-brand-green font-600 mt-1">{selectedClaim.users.phone}</p>}
                                </div>
                                <div className="bg-brand-bg/50 rounded-2xl p-5 border border-black/5">
                                    <span className="block text-[0.6rem] font-800 text-gray-400 uppercase tracking-widest mb-2">Product</span>
                                    <div className="flex items-center gap-3">
                                        {selectedClaim.products?.image_url && (
                                            <img src={selectedClaim.products.image_url} alt="" className="w-12 h-12 rounded-xl object-cover border border-black/5" />
                                        )}
                                        <p className="font-800 text-brand-text text-sm">{selectedClaim.products?.name || 'Unknown Product'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Claim Info */}
                            <div className="bg-brand-bg/50 rounded-2xl p-5 border border-black/5">
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <span className="block text-[0.6rem] font-800 text-gray-400 uppercase tracking-widest mb-1">Type</span>
                                        <span className="text-sm font-700 text-brand-text">{getClaimTypeLabel(selectedClaim.claim_type)}</span>
                                    </div>
                                    <div>
                                        <span className="block text-[0.6rem] font-800 text-gray-400 uppercase tracking-widest mb-1">Priority</span>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[0.65rem] font-800 uppercase tracking-widest border ${getPriorityStyles(selectedClaim.priority)}`}>
                                            {selectedClaim.priority}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[0.6rem] font-800 text-gray-400 uppercase tracking-widest mb-1">Status</span>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[0.65rem] font-800 uppercase tracking-widest border ${getStatusStyles(selectedClaim.status)}`}>
                                            {selectedClaim.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <span className="block text-[0.6rem] font-800 text-gray-400 uppercase tracking-widest mb-2">Customer Description</span>
                                    <p className="text-sm font-500 text-brand-text leading-relaxed bg-white rounded-xl p-4 border border-black/5">
                                        {selectedClaim.description || 'No description provided.'}
                                    </p>
                                </div>
                            </div>

                            {/* Order Info */}
                            {selectedClaim.orders && (
                                <div className="bg-brand-bg/50 rounded-2xl p-5 border border-black/5">
                                    <span className="block text-[0.6rem] font-800 text-gray-400 uppercase tracking-widest mb-2">Related Order</span>
                                    <div className="flex items-center gap-4">
                                        <span className="font-mono text-xs text-gray-500">#{selectedClaim.order_id.slice(0, 10)}</span>
                                        <span className="text-sm font-800 text-brand-text">Rs. {Number(selectedClaim.orders.total_amount).toFixed(2)}</span>
                                        <span className="text-xs text-gray-400">{new Date(selectedClaim.orders.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            )}

                            {/* Admin Notes */}
                            <div>
                                <label className="block text-[0.65rem] font-800 text-gray-400 uppercase tracking-widest mb-2">
                                    <MessageSquare size={12} className="inline mr-1" /> Admin Notes (Internal)
                                </label>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-500 resize-none focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green/30 transition-all"
                                    placeholder="Internal notes about this claim..."
                                />
                            </div>

                            {/* Resolution */}
                            <div>
                                <label className="block text-[0.65rem] font-800 text-gray-400 uppercase tracking-widest mb-2">
                                    <CheckCircle2 size={12} className="inline mr-1" /> Resolution
                                </label>
                                <textarea
                                    value={resolution}
                                    onChange={(e) => setResolution(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-500 resize-none focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green/30 transition-all"
                                    placeholder="Resolution details visible to the customer..."
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-white rounded-b-[28px] px-8 py-5 border-t border-black/5 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setSelectedClaim(null)}
                                className="px-6 py-2.5 rounded-xl text-sm font-700 text-gray-500 hover:bg-brand-bg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={updateClaimDetails}
                                disabled={updating}
                                className="px-6 py-2.5 rounded-xl text-sm font-800 bg-brand-green text-white hover:bg-brand-green-dark transition-colors shadow-lg shadow-brand-green/20 disabled:opacity-50"
                            >
                                {updating ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminWarranty;
