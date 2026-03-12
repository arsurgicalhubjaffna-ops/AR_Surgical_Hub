import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ChevronRight, Clock, AlertCircle, Plus } from 'lucide-react';
import insforge from '../lib/insforge';
import { WarrantyClaim } from '../types';
import { useAuth } from '../context/AuthContext';

const MyWarranty: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [claims, setClaims] = useState<WarrantyClaim[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClaims = async () => {
            if (!user) return;
            try {
                const { data, error } = await insforge.database
                    .from('warranty_claims')
                    .select('*, products(name, image_url)')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setClaims((data || []) as WarrantyClaim[]);
            } catch (error) {
                console.error('Error fetching warranty claims:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClaims();
    }, [user]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'resolved': return 'bg-green-100 text-green-700 border-green-200';
            case 'approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'under_review': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'submitted': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getPriorityStyle = (priority: string) => {
        switch (priority) {
            case 'critical': return 'bg-red-50 text-red-600';
            case 'high': return 'bg-orange-50 text-orange-600';
            case 'medium': return 'bg-yellow-50 text-yellow-600';
            case 'low': return 'bg-gray-50 text-gray-500';
            default: return 'bg-gray-50 text-gray-500';
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

    if (loading) {
        return (
            <div className="bg-brand-bg min-h-screen pt-28 pb-20">
                <div className="max-w-[1000px] mx-auto px-5">
                    <div className="h-10 w-48 bg-gray-200 animate-pulse rounded mb-8"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-2xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-brand-bg min-h-screen pt-28 pb-20">
            <div className="max-w-[1000px] mx-auto px-5">
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-900 tracking-tighter text-brand-text mb-2">My Warranty Claims</h1>
                        <p className="text-secondary font-500">Track and manage your warranty claim requests for surgical instruments.</p>
                    </div>
                    <Link
                        to="/warranty/new"
                        className="inline-flex items-center gap-2 bg-brand-green text-white px-6 py-3 rounded-xl font-800 text-sm transition-all hover:bg-brand-green-dark shadow-lg shadow-brand-green/20"
                    >
                        <Plus size={18} /> File New Claim
                    </Link>
                </header>

                {claims.length > 0 ? (
                    <div className="space-y-4">
                        {claims.map(claim => (
                            <div
                                key={claim.id}
                                className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                                onClick={() => navigate(`/warranty/${claim.id}`)}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-brand-bg rounded-xl flex items-center justify-center border border-black/5">
                                            {claim.products?.image_url ? (
                                                <img src={claim.products.image_url} alt="" className="w-full h-full object-cover rounded-xl" />
                                            ) : (
                                                <ShieldCheck size={24} className="text-brand-green" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className="text-sm font-800 text-brand-text">{claim.products?.name || 'Product'}</span>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[0.65rem] font-800 uppercase tracking-wider border ${getStatusStyle(claim.status)}`}>
                                                    {claim.status.replace('_', ' ')}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-md text-[0.6rem] font-700 uppercase ${getPriorityStyle(claim.priority)}`}>
                                                    {claim.priority}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs font-600 text-gray-400">
                                                <span>{getClaimTypeLabel(claim.claim_type)}</span>
                                                <span className="w-1 h-1 rounded-full bg-black/10"></span>
                                                <span className="flex items-center gap-1"><Clock size={12} /> {new Date(claim.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-4 md:pt-0">
                                        <div className="w-10 h-10 rounded-full bg-brand-bg flex items-center justify-center text-brand-text group-hover:bg-brand-green group-hover:text-white transition-colors">
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[32px] border border-black/5 p-16 text-center shadow-sm">
                        <div className="w-20 h-20 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <ShieldCheck size={40} />
                        </div>
                        <h2 className="text-2xl font-900 tracking-tight text-brand-text mb-2">No warranty claims</h2>
                        <p className="text-secondary max-w-md mx-auto mb-8">
                            You haven't filed any warranty claims yet. If you experience any issues with your purchased surgical instruments, file a claim here.
                        </p>
                        <Link to="/warranty/new" className="inline-flex items-center gap-2 bg-brand-green text-white px-8 py-3.5 rounded-xl font-800 transition-all hover:bg-brand-green-dark shadow-lg shadow-brand-green/20">
                            <Plus size={18} /> File New Claim
                        </Link>
                    </div>
                )}

                <div className="mt-12 p-6 bg-brand-green/5 border border-brand-green/10 rounded-2xl flex items-start gap-4">
                    <AlertCircle className="text-brand-green shrink-0" size={20} />
                    <p className="text-sm font-500 text-brand-text/80 leading-relaxed">
                        Warranty claims are typically reviewed within 3–5 business days. For urgent instrument issues, contact our support team directly at support@arsurgicalhub.com.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MyWarranty;
