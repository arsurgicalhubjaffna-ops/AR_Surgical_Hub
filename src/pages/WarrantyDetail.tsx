import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Clock, CheckCircle2, XCircle, Search, Package, AlertTriangle, Upload } from 'lucide-react';
import insforge from '../lib/insforge';
import { WarrantyClaim } from '../types';
import ProductImage from '../components/ProductImage';

const WarrantyDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [claim, setClaim] = useState<WarrantyClaim | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClaim = async () => {
            if (!id) return;
            try {
                const { data, error } = await insforge.database
                    .from('warranty_claims')
                    .select('*, users(full_name, email), products(name, image_url), orders(id, total_amount, status, created_at)')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setClaim(data as WarrantyClaim);
            } catch (err) {
                console.error('Error fetching warranty claim:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchClaim();
    }, [id]);

    const getStatusStep = (status: string) => {
        const steps = ['submitted', 'under_review', 'approved', 'resolved'];
        if (status === 'rejected') return -1;
        return steps.indexOf(status);
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

    const getPriorityStyles = (priority: string) => {
        switch (priority) {
            case 'critical': return 'bg-red-100 text-red-700 border-red-200';
            case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'low': return 'bg-gray-100 text-gray-600 border-gray-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    if (loading) return (
        <div className="bg-brand-bg min-h-screen pt-28 pb-20">
            <div className="max-w-[800px] mx-auto px-5 animate-pulse">
                <div className="h-6 w-32 bg-gray-200 rounded mb-8"></div>
                <div className="h-40 bg-gray-200 rounded-3xl mb-8"></div>
                <div className="space-y-4">
                    {[1, 2].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl"></div>)}
                </div>
            </div>
        </div>
    );

    if (!claim) return (
        <div className="bg-brand-bg min-h-screen pt-28 pb-20">
            <div className="max-w-[800px] mx-auto px-5 text-center py-20">
                <AlertTriangle size={48} className="text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-800 text-brand-text mb-2">Claim not found</h2>
                <Link to="/my-warranty" className="text-brand-green font-700 hover:underline">Back to Warranty Claims</Link>
            </div>
        </div>
    );

    const isRejected = claim.status === 'rejected';

    return (
        <div className="bg-brand-bg min-h-screen pt-28 pb-20">
            <div className="max-w-[900px] mx-auto px-5">
                <Link to="/my-warranty" className="inline-flex items-center gap-2 text-sm font-700 text-gray-500 hover:text-brand-green transition-colors mb-8">
                    <ArrowLeft size={16} /> Back to Warranty Claims
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className={`px-3 py-1 rounded-lg text-xs font-800 uppercase tracking-widest border ${isRejected ? 'bg-red-100 text-red-700 border-red-200' : 'bg-brand-green/10 text-brand-green border-brand-green/20'}`}>
                                {claim.status.replace('_', ' ')}
                            </span>
                            <span className={`px-2.5 py-1 rounded-md text-[0.65rem] font-800 uppercase tracking-widest border ${getPriorityStyles(claim.priority)}`}>
                                {claim.priority} priority
                            </span>
                            <span className="text-xs font-700 text-gray-400 uppercase tracking-widest pl-3 border-l border-black/10">
                                Claim #{claim.id.slice(0, 8)}
                            </span>
                        </div>
                        <h1 className="text-3xl font-900 tracking-tighter text-brand-text">Warranty Claim Details</h1>
                    </div>
                    <div className="text-left md:text-right">
                        <span className="block text-[0.65rem] font-700 text-gray-400 uppercase tracking-widest mb-1">Filed On</span>
                        <span className="text-lg font-800 text-brand-text">
                            {new Date(claim.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                </div>

                {/* Progress Tracking */}
                {!isRejected ? (
                    <div className="bg-white rounded-[32px] border border-black/5 p-8 md:p-10 shadow-sm mb-8 overflow-x-auto">
                        <div className="min-w-[500px] flex justify-between relative">
                            <div className="absolute top-5 left-[30px] right-[30px] h-1 bg-gray-100 z-0">
                                <div
                                    className="h-full bg-brand-green transition-all duration-700 ease-out"
                                    style={{ width: `${(getStatusStep(claim.status) / 3) * 100}%` }}
                                ></div>
                            </div>
                            {[
                                { label: 'Submitted', icon: <ShieldCheck size={16} /> },
                                { label: 'Under Review', icon: <Search size={16} /> },
                                { label: 'Approved', icon: <CheckCircle2 size={16} /> },
                                { label: 'Resolved', icon: <Package size={16} /> },
                            ].map((step, idx) => {
                                const active = getStatusStep(claim.status) >= idx;
                                return (
                                    <div key={idx} className="relative z-10 flex flex-col items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${active ? 'bg-brand-green text-white' : 'bg-white border-2 border-gray-100 text-gray-300'}`}>
                                            {step.icon}
                                        </div>
                                        <span className={`text-[0.7rem] font-800 uppercase tracking-widest ${active ? 'text-brand-text' : 'text-gray-300'}`}>{step.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="bg-red-50 rounded-[24px] border border-red-200 p-8 shadow-sm mb-8 flex items-center gap-4">
                        <XCircle size={32} className="text-red-500 shrink-0" />
                        <div>
                            <h3 className="font-800 text-red-700 mb-1">Claim Rejected</h3>
                            <p className="text-sm text-red-600/80 font-500">This warranty claim has been reviewed and was not approved. See the resolution below for details.</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
                    {/* Claim Details */}
                    <div className="space-y-4">
                        {/* Product Card */}
                        <div className="bg-white rounded-[24px] border border-black/5 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 bg-brand-bg/50 border-b border-black/5">
                                <h3 className="text-xs font-900 uppercase tracking-widest text-brand-text">Product Information</h3>
                            </div>
                            <div className="p-6 flex items-center gap-6">
                                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-black/5">
                                    <ProductImage src={claim.products?.image_url} alt={claim.products?.name || ''} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-800 text-brand-text mb-1">{claim.products?.name || 'Product'}</h4>
                                    <div className="flex items-center gap-3 text-sm text-secondary font-500">
                                        {claim.purchase_type === 'online' ? (
                                            <>
                                                <span>Order #{claim.order_id?.slice(0, 8)}</span>
                                                {claim.orders && (
                                                    <>
                                                        <span className="w-1 h-1 rounded-full bg-black/10"></span>
                                                        <span>{Number(claim.orders.total_amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <span>In-Store Purchase</span>
                                                <span className="w-1 h-1 rounded-full bg-black/10"></span>
                                                <span>Receipt: {claim.receipt_number}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Issue Description */}
                        <div className="bg-white rounded-[24px] border border-black/5 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 bg-brand-bg/50 border-b border-black/5">
                                <h3 className="text-xs font-900 uppercase tracking-widest text-brand-text">Issue Details</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <span className="block text-[0.6rem] font-800 text-gray-400 uppercase tracking-widest mb-1">Issue Type</span>
                                        <span className="text-sm font-700 text-brand-text">{getClaimTypeLabel(claim.claim_type)}</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="block text-[0.6rem] font-800 text-gray-400 uppercase tracking-widest mb-2">Description</span>
                                    <p className="text-sm font-500 text-brand-text leading-relaxed bg-brand-bg/30 rounded-xl p-4 border border-black/5">
                                        {claim.description || 'No description provided.'}
                                    </p>
                                </div>
                                {claim.purchase_type === 'instore' && claim.receipt_url && (
                                    <div className="pt-2">
                                        <span className="block text-[0.6rem] font-800 text-gray-400 uppercase tracking-widest mb-2">Proof of Purchase</span>
                                        <a 
                                            href={claim.receipt_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-black/5 hover:bg-brand-bg transition-colors text-xs font-700 text-brand-green"
                                        >
                                            <Upload size={14} /> View Receipt Image
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Resolution (if any) */}
                        {claim.resolution && (
                            <div className="bg-white rounded-[24px] border border-black/5 overflow-hidden shadow-sm">
                                <div className="px-6 py-4 bg-brand-green/5 border-b border-brand-green/10">
                                    <h3 className="text-xs font-900 uppercase tracking-widest text-brand-green flex items-center gap-2">
                                        <CheckCircle2 size={14} /> Resolution
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <p className="text-sm font-500 text-brand-text leading-relaxed">
                                        {claim.resolution}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-8">
                        <div className="bg-white rounded-[24px] border border-black/5 p-6 shadow-sm">
                            <h3 className="text-xs font-900 uppercase tracking-widest text-brand-text mb-6 flex items-center gap-2">
                                <Clock size={16} className="text-brand-green" /> Timeline
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <span className="block text-[0.6rem] font-800 text-gray-400 uppercase tracking-widest mb-1.5">Filed</span>
                                    <p className="text-sm font-600 text-brand-text">
                                        {new Date(claim.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                                {claim.updated_at && claim.updated_at !== claim.created_at && (
                                    <div className="pt-4 border-t border-black/5">
                                        <span className="block text-[0.6rem] font-800 text-gray-400 uppercase tracking-widest mb-1.5">Last Updated</span>
                                        <p className="text-sm font-600 text-brand-text">
                                            {new Date(claim.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-[24px] border border-black/5 p-6 shadow-sm">
                            <h3 className="text-xs font-900 uppercase tracking-widest text-brand-text mb-6 flex items-center gap-2">
                                <ShieldCheck size={16} className="text-brand-green" /> Claim Status
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <span className="block text-[0.6rem] font-800 text-gray-400 uppercase tracking-widest mb-1.5">Current Status</span>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-800 uppercase tracking-tight ${isRejected ? 'bg-red-100 text-red-700' : claim.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {isRejected ? <XCircle size={12} /> : <CheckCircle2 size={12} />}
                                        {claim.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-[0.6rem] font-800 text-gray-400 uppercase tracking-widest mb-1.5">Priority</span>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-800 uppercase tracking-tight border ${getPriorityStyles(claim.priority)}`}>
                                        {claim.priority}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default WarrantyDetail;
