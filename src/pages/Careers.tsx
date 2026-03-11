import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, Clock, ChevronRight } from 'lucide-react';
import insforge from '../lib/insforge';

interface Vacancy {
    id: string;
    position: string;
    location: string;
    salary_range: string;
    is_active: boolean;
    created_at: string;
    description?: string;
}

const Careers: React.FC = () => {
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVacancies = async () => {
            try {
                const { data, error } = await insforge.database
                    .from('vacancies')
                    .select('*')
                    .eq('is_active', true)
                    .order('created_at', { ascending: false });
                if (error) throw error;
                setVacancies(data || []);
            } catch (err) {
                console.error('Error fetching vacancies:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchVacancies();
    }, []);

    return (
        <div className="min-h-screen bg-brand-bg pb-20">
            {/* Header */}
            <div className="bg-white border-b border-black/8 py-12 md:py-16 mb-12">
                <div className="max-w-[1400px] mx-auto px-5 md:px-10 text-center">
                    <h1 className="text-3xl md:text-5xl font-800 tracking-tighter text-brand-text mb-3">
                        Join Our <span className="text-brand-green">Team</span>
                    </h1>
                    <p className="text-secondary text-base md:text-lg max-w-2xl mx-auto">
                        Build the future of surgical precision and medical excellence with AR SURGICAL HUB.
                    </p>
                </div>
            </div>

            <div className="max-w-[800px] mx-auto px-5 md:px-10">
                <div className="flex flex-col gap-5">
                    {loading ? (
                        <div className="text-center py-20 text-gray-400 italic">Checking open positions...</div>
                    ) : vacancies.length > 0 ? (
                        vacancies.map(job => (
                            <div key={job.id} className="bg-white border border-black/8 p-6 md:p-8 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-brand-green/25 group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <h3 className="text-xl font-800 text-brand-text group-hover:text-brand-green transition-colors">{job.position}</h3>
                                        <div className="flex flex-wrap gap-4 mt-3 text-[0.85rem] text-secondary">
                                            <span className="flex items-center gap-1.5"><MapPin size={16} className="text-brand-green" /> {job.location}</span>
                                            <span className="flex items-center gap-1.5"><DollarSign size={16} className="text-brand-green" /> {job.salary_range}</span>
                                            <span className="flex items-center gap-1.5"><Clock size={16} className="text-brand-green" /> Posted {new Date(job.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <span className="inline-block self-start md:self-center bg-brand-green/10 text-brand-green text-[0.7rem] font-700 uppercase tracking-widest px-3 py-1 rounded-full">
                                        Full-Time
                                    </span>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-black/8">
                                    <p className="text-gray-400 text-sm italic">Application typically processed in 3-5 days.</p>
                                    <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-green text-white px-6 py-2.5 rounded-xl font-700 transition-all hover:bg-brand-green-dark">
                                        Apply Now <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white border border-black/8 rounded-[32px] p-12 text-center shadow-sm">
                            <div className="w-16 h-16 rounded-full bg-brand-bg flex items-center justify-center text-gray-300 mx-auto mb-6">
                                <Briefcase size={32} />
                            </div>
                            <h3 className="text-xl font-800 text-brand-text mb-2">No Active Openings</h3>
                            <p className="text-secondary max-w-sm mx-auto">
                                We are not currently searching for new team members, but we're always interested in talent. Stay tuned for future opportunities!
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-16 bg-brand-green/5 border border-brand-green/10 rounded-2xl p-8 text-center">
                    <h4 className="text-brand-text font-800 mb-2">Can't find a suitable role?</h4>
                    <p className="text-secondary text-sm mb-4">Send your spontaneous application and CV to careers@arsurgicalhub.com</p>
                </div>
            </div>
        </div>
    );
};

export default Careers;
