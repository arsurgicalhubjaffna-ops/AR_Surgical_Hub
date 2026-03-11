import React, { useState, useEffect } from 'react';
import insforge from '../../lib/insforge';
import { MessageSquare, ChevronDown, CheckCircle, Clock, XCircle, User, Mail, Calendar } from 'lucide-react';

const STATUSES = ['new', 'quoted', 'negotiating', 'accepted', 'rejected'];

const AdminQuotes: React.FC = () => {
    const [quotes, setQuotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            const { data, error } = await insforge.database
                .from('quotes')
                .select('*, users(full_name, email)')
                .order('created_at', { ascending: false });
            if (error) throw error;
            const mapped = (data || []).map(q => ({
                ...q,
                full_name: q.users?.full_name || null,
                email: q.users?.email || null,
            }));
            setQuotes(mapped);
        } catch (err) {
            console.error('Quote Load Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            const { error } = await insforge.database
                .from('quotes')
                .update({ status })
                .eq('id', id);
            if (error) throw error;
            load();
        } catch (err) {
            alert('Failed to update quote status');
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'accepted': return 'bg-brand-green/10 text-brand-green border-brand-green/20';
            case 'new': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'rejected': return 'bg-brand-red/10 text-brand-red border-brand-red/20';
            case 'negotiating': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'quoted': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };

    if (loading) return <div className="text-secondary italic animate-pulse">Accessing quote repository...</div>;

    return (
        <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
            <div className="px-8 py-8 border-b border-black/5 flex items-center justify-between bg-brand-bg/10">
                <div>
                    <h2 className="text-xl font-800 tracking-tight text-brand-text">Quotation Requests</h2>
                    <p className="text-sm text-gray-400 font-500">Respond to specialized surgical instrument pricing enquiries</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-black/5 shadow-sm">
                    <MessageSquare size={18} className="text-brand-green" />
                    <span className="text-sm font-800 text-brand-text">{quotes.length} Requests</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-brand-bg/50 border-b border-black/5">
                            <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Requester</th>
                            <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Brief / Context</th>
                            <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Pipeline Status</th>
                            <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Submission Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                        {quotes.map(q => (
                            <tr key={q.id} className="hover:bg-brand-bg/30 transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="flex flex-col">
                                        <span className="font-700 text-brand-text text-sm">{q.full_name || 'Anonymous Practitioner'}</span>
                                        <div className="flex items-center gap-1.5 text-[0.7rem] text-gray-400 font-500 mt-0.5">
                                            <Mail size={12} className="text-gray-300" />
                                            {q.email || 'no-email@arsurgicalhub.com'}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="max-w-md">
                                        <p className="text-brand-text text-[0.85rem] font-600 line-clamp-2 leading-relaxed italic">
                                            "{q.message || 'No specific technical instructions provided.'}"
                                        </p>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="relative inline-block">
                                        <select
                                            className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-[0.7rem] font-800 uppercase tracking-widest border transition-all cursor-pointer outline-none focus:ring-2 focus:ring-brand-green/20 ${getStatusStyles(q.status)}`}
                                            value={q.status}
                                            onChange={e => updateStatus(q.id, e.target.value)}
                                        >
                                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-2 text-gray-400 text-sm font-500">
                                        <Calendar size={14} className="text-gray-300" />
                                        {new Date(q.created_at).toLocaleDateString()}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {quotes.length === 0 && (
                <div className="p-20 text-center">
                    <div className="w-16 h-16 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200">
                        <MessageSquare size={32} />
                    </div>
                    <p className="text-secondary font-600 italic">The quotation pipeline is currently empty.</p>
                </div>
            )}
        </div>
    );
};

export default AdminQuotes;
