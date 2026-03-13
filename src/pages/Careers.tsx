import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, Clock, ChevronRight, Filter, Search, Target, Layers, BookOpen, X, Upload, CheckCircle2, Loader2 } from 'lucide-react';
import insforge from '../lib/insforge';
import { useSettings } from '../hooks/useSettings';
import { Vacancy } from '../types';
import { submitApplication, uploadResume } from './CareersHandler';

const Careers: React.FC = () => {
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeDept, setActiveDept] = useState('All');
    const { getSetting } = useSettings();

    // Modal & Form State
    const [showModal, setShowModal] = useState(false);
    const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        cover_letter: '',
    });
    const [resumeFile, setResumeFile] = useState<File | null>(null);

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

    const handleApplyClick = (vacancy: Vacancy) => {
        setSelectedVacancy(vacancy);
        setShowModal(true);
        setSuccess(false);
        setError(null);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedVacancy) return;
        
        setSubmitting(true);
        setError(null);

        try {
            let resume_url = '';
            if (resumeFile) {
                resume_url = await uploadResume(resumeFile);
            }

            await submitApplication({
                vacancy_id: selectedVacancy.id,
                full_name: formData.full_name,
                email: formData.email,
                phone: formData.phone,
                cover_letter: formData.cover_letter,
                resume_url
            });

            setSuccess(true);
            setFormData({ full_name: '', email: '', phone: '', cover_letter: '' });
            setResumeFile(null);
        } catch (err: any) {
            setError(err.message || 'Failed to submit application. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const departments = ['All', ...new Set(vacancies.map(v => v.department || 'General'))];

    const filtered = vacancies.filter(v => {
        const matchesSearch = v.position.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             v.location?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = activeDept === 'All' || v.department === activeDept;
        return matchesSearch && matchesDept;
    });

    return (
        <div className="min-h-screen bg-brand-bg pb-24">
            {/* Stunning Hero Section */}
            <div className="relative bg-white border-b border-black/5 pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-green/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
                <div className="max-w-[1400px] mx-auto px-5 md:px-10 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-brand-green/10 text-brand-green px-4 py-2 rounded-full mb-6 animate-fade-in">
                        <Target size={16} />
                        <span className="text-xs font-800 uppercase tracking-widest leading-none">Career Opportunities</span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-900 tracking-tighter text-brand-text mb-6">
                        {getSetting('careers_hero_title', 'Build the Future of Surgical precision')}
                    </h1>
                    <p className="text-secondary text-lg md:text-xl max-w-3xl mx-auto font-500 leading-relaxed">
                        {getSetting('careers_hero_description', 'Join AR SURGICAL HUB and become part of a mission-driven team dedicated to elevating medical standards across Sri Lanka.')}
                    </p>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-5 md:px-10 -mt-8 relative z-20">
                {/* Search & Filter Bar */}
                <div className="bg-white rounded-[32px] shadow-2xl shadow-black/5 border border-black/5 p-4 md:p-6 mb-12 flex flex-col md:flex-row items-center gap-4 transition-all duration-500 hover:shadow-brand-green/5">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Find your next role..."
                            className="w-full bg-brand-bg/50 border border-black/5 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-brand-green font-600 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
                        {departments.map(dept => (
                            <button
                                key={dept}
                                onClick={() => setActiveDept(dept)}
                                className={`whitespace-nowrap px-6 py-4 rounded-2xl text-[0.75rem] font-800 uppercase tracking-widest transition-all ${activeDept === dept ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20' : 'bg-brand-bg text-gray-500 hover:bg-brand-green/10 hover:text-brand-green'}`}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Job List */}
                <div className="flex flex-col gap-6">
                    {loading ? (
                        <div className="grid grid-cols-1 gap-6 animate-pulse">
                            {[1, 2, 3].map(i => <div key={i} className="h-48 bg-white/50 rounded-3xl border border-black/5"></div>)}
                        </div>
                    ) : filtered.length > 0 ? (
                        filtered.map(job => (
                            <div key={job.id} className="bg-white border border-black/5 p-2 rounded-[40px] shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-brand-green/10 hover:-translate-y-1 group">
                                <div className="p-8 md:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <span className="flex items-center gap-1.5 bg-brand-bg px-3 py-1.5 rounded-full text-[0.65rem] font-800 text-brand-green uppercase tracking-widest">
                                                <Layers size={14} /> {job.department || 'General'}
                                            </span>
                                            <span className="flex items-center gap-1.5 bg-brand-bg px-3 py-1.5 rounded-full text-[0.65rem] font-800 text-secondary uppercase tracking-widest">
                                                <Clock size={14} /> {job.type || 'Full-Time'}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-900 text-brand-text mb-4 transition-colors group-hover:text-brand-green line-clamp-2 leading-tight">
                                            {job.position}
                                        </h3>
                                        <div className="flex flex-wrap gap-x-8 gap-y-4 text-[0.93rem] text-secondary font-600">
                                            <span className="flex items-center gap-2"><MapPin size={18} className="text-brand-green/60" /> {job.location}</span>
                                            <span className="flex items-center gap-2"><DollarSign size={18} className="text-brand-green/60" /> {job.salary_range}</span>
                                            <span className="flex items-center gap-2"><Clock size={18} className="text-brand-green/60" /> Posted {new Date(job.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-center gap-4 shrink-0">
                                        <button 
                                            onClick={() => handleApplyClick(job)}
                                            className="bg-brand-green text-white px-10 py-5 rounded-3xl font-900 text-sm transition-all hover:bg-brand-green-dark shadow-xl shadow-brand-green/20 flex items-center justify-center gap-2"
                                        >
                                            Apply Now <ChevronRight size={18} />
                                        </button>
                                        <p className="text-[0.7rem] text-gray-400 font-700 uppercase tracking-widest text-center lg:text-right">
                                            Exp. Level: {job.experience_level || 'Junior'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white border border-black/5 rounded-[48px] p-20 text-center relative overflow-hidden">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-bg rounded-full scale-150 opacity-20 blur-2xl"></div>
                            <div className="relative z-10 max-w-md mx-auto">
                                <div className="w-24 h-24 rounded-[32px] bg-brand-bg flex items-center justify-center text-gray-300 mx-auto mb-8 transition-transform duration-500 group-hover:scale-110">
                                    <Briefcase size={40} />
                                </div>
                                <h3 className="text-2xl font-900 text-brand-text mb-4">No positions found</h3>
                                <p className="text-secondary font-500 leading-relaxed mb-8">
                                    We don't have any open vacancies matching your search right now, but we're always growing. Please check back soon!
                                </p>
                                <button onClick={() => { setSearchTerm(''); setActiveDept('All'); }} className="text-brand-green font-800 text-sm uppercase tracking-widest hover:underline decoration-2 underline-offset-8">
                                    Browse all roles
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Spontaneous Application */}
                <div className="mt-20 relative rounded-[48px] overflow-hidden bg-[#0f1716] p-12 md:p-16 text-center text-white">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-green/20 to-transparent"></div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <BookOpen size={48} className="text-brand-green mx-auto mb-8 opacity-80" />
                        <h4 className="text-3xl md:text-4xl font-900 tracking-tight mb-4">Can't find a suitable role?</h4>
                        <p className="text-gray-400 text-lg font-500 mb-10 leading-relaxed">
                            We are always looking for exceptional talent to join our mission. Send your CV and a brief cover letter for future considerations.
                        </p>
                        <a 
                            href={`mailto:${getSetting('careers_email', 'careers@arsurgicalhub.com')}`}
                            className="inline-flex items-center gap-3 text-brand-green font-900 text-lg hover:underline decoration-2 underline-offset-8"
                        >
                            {getSetting('careers_email', 'careers@arsurgicalhub.com')}
                            <ChevronRight size={24} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Application Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-5 py-5">
                    <div className="absolute inset-0 bg-brand-text/40 backdrop-blur-md animate-fade-in" onClick={() => !submitting && setShowModal(false)}></div>
                    <div className="bg-white w-full max-w-[700px] rounded-[48px] shadow-2xl relative z-10 overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
                        <div className="p-8 md:p-12 overflow-y-auto no-scrollbar">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-brand-bg flex items-center justify-center text-secondary hover:text-brand-text transition-all hover:scale-110"
                                disabled={submitting}
                            >
                                <X size={24} />
                            </button>

                            {success ? (
                                <div className="text-center py-12 animate-fade-in">
                                    <div className="w-24 h-24 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green mx-auto mb-8">
                                        <CheckCircle2 size={48} />
                                    </div>
                                    <h2 className="text-4xl font-900 text-brand-text mb-4">Application Received!</h2>
                                    <p className="text-secondary text-lg mb-10 font-500">
                                        Thank you for your interest in joining AR SURGICAL HUB. Our HR team will review your application and get back to you soon.
                                    </p>
                                    <button 
                                        onClick={() => setShowModal(false)}
                                        className="bg-brand-green text-white px-12 py-5 rounded-3xl font-900 text-sm shadow-xl shadow-brand-green/20"
                                    >
                                        Done
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-10">
                                        <span className="inline-block bg-brand-green/10 text-brand-green px-4 py-1.5 rounded-full text-[0.65rem] font-800 uppercase tracking-widest mb-4">
                                            Applying for
                                        </span>
                                        <h2 className="text-3xl md:text-4xl font-900 text-brand-text leading-tight">
                                            {selectedVacancy?.position}
                                        </h2>
                                    </div>

                                    <form onSubmit={handleFormSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[0.75rem] font-800 uppercase tracking-widest text-secondary ml-1">Full Name</label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="John Doe"
                                                    className="w-full bg-brand-bg border border-black/5 rounded-2xl px-6 py-4 outline-none focus:border-brand-green font-600 transition-all"
                                                    value={formData.full_name}
                                                    onChange={e => setFormData({...formData, full_name: e.target.value})}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[0.75rem] font-800 uppercase tracking-widest text-secondary ml-1">Email Address</label>
                                                <input
                                                    required
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    className="w-full bg-brand-bg border border-black/5 rounded-2xl px-6 py-4 outline-none focus:border-brand-green font-600 transition-all"
                                                    value={formData.email}
                                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[0.75rem] font-800 uppercase tracking-widest text-secondary ml-1">Phone Number (Optional)</label>
                                            <input
                                                type="tel"
                                                placeholder="+94 77 123 4567"
                                                className="w-full bg-brand-bg border border-black/5 rounded-2xl px-6 py-4 outline-none focus:border-brand-green font-600 transition-all"
                                                value={formData.phone}
                                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[0.75rem] font-800 uppercase tracking-widest text-secondary ml-1">Cover Letter / Note</label>
                                            <textarea
                                                rows={4}
                                                placeholder="Tell us why you're a great fit..."
                                                className="w-full bg-brand-bg border border-black/5 rounded-2xl px-6 py-4 outline-none focus:border-brand-green font-600 transition-all resize-none"
                                                value={formData.cover_letter}
                                                onChange={e => setFormData({...formData, cover_letter: e.target.value})}
                                            ></textarea>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[0.75rem] font-800 uppercase tracking-widest text-secondary ml-1">Resume / CV (PDF)</label>
                                            <div className="relative group">
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    onChange={e => setResumeFile(e.target.files?.[0] || null)}
                                                />
                                                <div className="bg-brand-bg border-2 border-dashed border-black/5 rounded-[24px] p-8 text-center group-hover:border-brand-green/30 transition-all">
                                                    <Upload size={32} className="mx-auto text-gray-400 mb-3" />
                                                    <p className="text-sm font-700 text-brand-text mb-1">
                                                        {resumeFile ? resumeFile.name : 'Click to upload your CV'}
                                                    </p>
                                                    <p className="text-[0.7rem] font-600 text-secondary uppercase tracking-widest">
                                                        Max file size: 5MB
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {error && (
                                            <p className="text-red-500 text-sm font-600 text-center bg-red-50 p-4 rounded-2xl">
                                                {error}
                                            </p>
                                        )}

                                        <button 
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full bg-brand-text text-white py-6 rounded-3xl font-900 text-lg shadow-2xl transition-all hover:bg-brand-green hover:shadow-brand-green/30 disabled:bg-gray-400 disabled:shadow-none flex items-center justify-center gap-3"
                                        >
                                            {submitting ? (
                                                <>
                                                    <Loader2 size={24} className="animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : 'Submit Application'}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Careers;
