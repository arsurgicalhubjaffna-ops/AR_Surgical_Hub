import React, { useState, useEffect } from 'react';
import { 
    Plus, Pencil, Trash2, X, Search, CheckCircle2, Briefcase, MapPin, 
    DollarSign, Clock, ToggleLeft, ToggleRight, AlertTriangle, 
    Filter, ChevronDown, Layers, Target, BookOpen, User, Mail, Phone, FileText, ExternalLink, Loader2
} from 'lucide-react';
import { Vacancy, JobApplication } from '../../types';
import { loadVacancies, saveVacancy, deleteVacancy, toggleVacancyStatus, loadApplications, updateApplicationStatus } from './AdminCareersHandler';

const emptyForm: Omit<Vacancy, 'id' | 'created_at' | 'updated_at'> = {
    position: '',
    location: '',
    salary_range: '',
    description: '',
    is_active: true,
    type: 'Full-Time',
    department: 'General',
    experience_level: 'Intermediate',
    requirements: ''
};

const JOB_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Freelance'];
const DEPARTMENTS = ['General', 'Surgical', 'Technical', 'Sales', 'Customer Support', 'Warehouse', 'Management'];
const EXPERIENCE_LEVELS = ['Junior', 'Intermediate', 'Senior', 'Expert', 'Lead'];
const APP_STATUSES = ['pending', 'reviewed', 'shortlisted', 'rejected'] as const;

const AdminCareers: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'vacancies' | 'applications'>('vacancies');
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editId, setEditId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        try {
            if (activeTab === 'vacancies') {
                const data = await loadVacancies();
                setVacancies(data);
            } else {
                const data = await loadApplications();
                setApplications(data);
            }
        } catch (err) {
            console.error('Career Load Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [activeTab]);

    const openAdd = () => { setForm(emptyForm); setEditId(null); setModal(true); };
    const openEdit = (v: Vacancy) => {
        setForm({
            position: v.position,
            location: v.location || '',
            salary_range: v.salary_range || '',
            description: v.description || '',
            is_active: v.is_active,
            type: v.type || 'Full-Time',
            department: v.department || 'General',
            experience_level: v.experience_level || 'Intermediate',
            requirements: v.requirements || ''
        });
        setEditId(v.id);
        setModal(true);
    };

    const handleSave = async () => {
        try {
            await saveVacancy(form as any, editId);
            setModal(false);
            load();
        } catch (err) {
            alert('Failed to save vacancy');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this vacancy?')) return;
        try {
            await deleteVacancy(id);
            load();
        } catch (err) {
            alert('Failed to delete vacancy');
        }
    };

    const handleToggleStatus = async (v: Vacancy) => {
        try {
            await toggleVacancyStatus(v.id, !v.is_active);
            load();
        } catch (err) {
            alert('Failed to toggle vacancy status');
        }
    };

    const handleUpdateAppStatus = async (id: string, status: string) => {
        setUpdatingStatus(id);
        try {
            await updateApplicationStatus(id, status);
            load();
        } catch (err) {
            alert('Failed to update application status');
        } finally {
            setUpdatingStatus(null);
        }
    };

    const filteredVacancies = vacancies.filter(v => {
        const matchesSearch = v.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             v.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             v.department?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === 'all' || 
                             (filterStatus === 'active' && v.is_active) || 
                             (filterStatus === 'closed' && !v.is_active);
        
        return matchesSearch && matchesStatus;
    });

    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             app.vacancies?.position.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
        
        return matchesSearch && matchesStatus;
    });

    const stats = {
        totalVacancies: vacancies.length,
        activeVacancies: vacancies.filter(v => v.is_active).length,
        closedVacancies: vacancies.filter(v => !v.is_active).length,
        totalApps: applications.length,
        pendingApps: applications.filter(a => a.status === 'pending').length
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Proper Header Area */}
            <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
                <div className="px-8 py-8 border-b border-black/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-brand-bg/10">
                    <div>
                        <h2 className="text-xl font-800 tracking-tight text-brand-text">Career Management</h2>
                        <p className="text-sm text-gray-400 font-500">Manage job vacancies, position descriptions, and applicant intake</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-black/5 shadow-sm">
                            <Briefcase size={18} className="text-brand-green" />
                            <span className="text-sm font-800 text-brand-text">{stats.totalVacancies} Vacancies</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-black/5 shadow-sm">
                            <FileText size={18} className="text-brand-green" />
                            <span className="text-sm font-800 text-brand-green">{stats.totalApps} Applications</span>
                        </div>
                    </div>
                </div>

                {/* Sub Tabs */}
                <div className="px-8 border-b border-black/5 bg-white flex gap-8">
                    <button 
                        onClick={() => { setActiveTab('vacancies'); setFilterStatus('all'); setSearchTerm(''); }}
                        className={`py-4 text-xs font-800 uppercase tracking-[0.2em] relative transition-all ${activeTab === 'vacancies' ? 'text-brand-green' : 'text-gray-400 hover:text-brand-text'}`}
                    >
                        Vacancies
                        {activeTab === 'vacancies' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-green rounded-t-full shadow-[0_-2px_10px_rgba(56,189,248,0.4)]" />}
                    </button>
                    <button 
                        onClick={() => { setActiveTab('applications'); setFilterStatus('all'); setSearchTerm(''); }}
                        className={`py-4 text-xs font-800 uppercase tracking-[0.2em] relative transition-all ${activeTab === 'applications' ? 'text-brand-green' : 'text-gray-400 hover:text-brand-text'}`}
                    >
                        Applications
                        {activeTab === 'applications' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-green rounded-t-full shadow-[0_-2px_10px_rgba(56,189,248,0.4)]" />}
                        {stats.pendingApps > 0 && (
                            <span className="absolute -top-1 -right-4 w-4 h-4 bg-brand-red text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                                {stats.pendingApps}
                            </span>
                        )}
                    </button>
                </div>

                {/* Filter Tabs + Search */}
                <div className="px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-black/5 bg-white">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {activeTab === 'vacancies' ? (
                            (['all', 'active', 'closed'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setFilterStatus(tab)}
                                    className={`px-4 py-2 rounded-lg text-xs font-800 uppercase tracking-widest transition-all ${filterStatus === tab
                                        ? 'bg-brand-green text-white shadow-sm'
                                        : 'text-gray-400 hover:bg-brand-bg hover:text-brand-text'
                                        }`}
                                >
                                    {tab} ({tab === 'all' ? stats.totalVacancies : tab === 'active' ? stats.activeVacancies : stats.closedVacancies})
                                </button>
                            ))
                        ) : (
                            (['all', ...APP_STATUSES] as const).map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-4 py-2 rounded-lg text-xs font-800 uppercase tracking-widest transition-all ${filterStatus === status
                                        ? 'bg-brand-green text-white shadow-sm'
                                        : 'text-gray-400 hover:bg-brand-bg hover:text-brand-text'
                                        }`}
                                >
                                    {status} ({status === 'all' ? stats.totalApps : applications.filter(a => a.status === status).length})
                                </button>
                            ))
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 bg-brand-bg px-4 py-2 rounded-xl border border-black/5 w-full sm:w-64">
                            <Search size={16} className="text-gray-400" />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent border-none outline-none text-sm font-500 w-full"
                            />
                        </div>
                        {activeTab === 'vacancies' && (
                            <button
                                onClick={openAdd}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-green text-white px-5 py-2.5 rounded-xl font-800 text-sm transition-all hover:bg-brand-green-dark shadow-lg shadow-brand-green/20"
                            >
                                <Plus size={18} /> New Vacancy
                            </button>
                        )}
                    </div>
                </div>

                {/* Table Content */}
                {loading ? (
                    <div className="p-20 text-center animate-pulse text-gray-400 font-600 italic">Syncing {activeTab}...</div>
                ) : activeTab === 'vacancies' ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-brand-bg/50 border-b border-black/5">
                                    <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest min-w-[300px]">Position & Dept</th>
                                    <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Type / Level</th>
                                    <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Location</th>
                                    <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Date</th>
                                    <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5">
                                {filteredVacancies.map(v => (
                                    <tr key={v.id} className="hover:bg-brand-bg/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-brand-bg rounded-lg border border-black/5 flex items-center justify-center shrink-0">
                                                    <Briefcase size={20} className="text-brand-green" />
                                                </div>
                                                <div>
                                                    <h3 className="font-800 text-brand-text text-sm hover:text-brand-green transition-colors line-clamp-1">{v.position}</h3>
                                                    <span className="inline-block mt-1 text-[0.65rem] font-700 text-gray-400 uppercase tracking-wider">
                                                        {v.department || 'General'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-700 text-brand-text">{v.type || 'Full-Time'}</span>
                                                <span className="text-[0.65rem] font-600 text-gray-400 uppercase tracking-wider">{v.experience_level || 'Intermediate'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-1.5 text-sm text-secondary font-500">
                                                <MapPin size={14} className="text-brand-green" /> {v.location || 'Remote'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <button
                                                onClick={() => handleToggleStatus(v)}
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.75rem] font-800 tracking-tight transition-colors ${v.is_active ? 'bg-brand-green/10 text-brand-green hover:bg-brand-green/20' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                            >
                                                {v.is_active ? (
                                                    <><CheckCircle2 size={12} /> Active</>
                                                ) : (
                                                    <><X size={12} /> Closed</>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-1.5 text-sm text-gray-400 font-500">
                                                <Clock size={14} /> {new Date(v.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openEdit(v)}
                                                    className="p-2 text-gray-400 hover:text-brand-green hover:bg-brand-green/5 rounded-lg transition-all"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(v.id)}
                                                    className="p-2 text-gray-400 hover:text-brand-red hover:bg-brand-red/5 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-brand-bg/50 border-b border-black/5">
                                    <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest min-w-[250px]">Applicant Info</th>
                                    <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Applying For</th>
                                    <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Resume / CV</th>
                                    <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Date</th>
                                    <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest text-right">Update Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5">
                                {filteredApplications.map(app => (
                                    <tr key={app.id} className="hover:bg-brand-bg/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-brand-bg rounded-full flex items-center justify-center text-brand-green font-900 border border-brand-green/20">
                                                    {app.full_name[0]}
                                                </div>
                                                <div>
                                                    <h3 className="font-800 text-brand-text text-sm">{app.full_name}</h3>
                                                    <div className="flex flex-col gap-0.5 mt-1">
                                                        <span className="flex items-center gap-1 text-[0.65rem] font-600 text-gray-400"><Mail size={10} /> {app.email}</span>
                                                        {app.phone && <span className="flex items-center gap-1 text-[0.65rem] font-600 text-gray-400"><Phone size={10} /> {app.phone}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-xs font-700 text-brand-text flex items-center gap-2">
                                                <Target size={14} className="text-brand-green" />
                                                {app.vacancies?.position || 'Unknown Role'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            {app.resume_url ? (
                                                <a 
                                                    href={app.resume_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-bg border border-black/5 text-[0.7rem] font-800 text-secondary hover:text-brand-green hover:border-brand-green/30 transition-all"
                                                >
                                                    <FileText size={14} /> Open PDF <ExternalLink size={12} />
                                                </a>
                                            ) : (
                                                <span className="text-[0.7rem] font-600 text-gray-300 italic">No resume</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`inline-block px-2.5 py-1 rounded-full text-[0.65rem] font-800 uppercase tracking-widest
                                                ${app.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                                                  app.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                                                  app.status === 'shortlisted' ? 'bg-brand-green/10 text-brand-green' :
                                                  'bg-red-100 text-red-700'}`}
                                            >
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-[0.7rem] font-600 text-gray-400 whitespace-nowrap">
                                            {new Date(app.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="relative inline-block group/status">
                                                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-black/5 text-[0.7rem] font-800 text-brand-text">
                                                    {updatingStatus === app.id ? <Loader2 size={12} className="animate-spin" /> : <ChevronDown size={14} />}
                                                </button>
                                                <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-black/5 rounded-xl shadow-xl opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all z-20 overflow-hidden">
                                                    {APP_STATUSES.map(status => (
                                                        <button
                                                            key={status}
                                                            onClick={() => handleUpdateAppStatus(app.id, status)}
                                                            className="w-full text-left px-4 py-2 text-[0.65rem] font-800 uppercase tracking-widest text-secondary hover:bg-brand-bg hover:text-brand-green transition-colors"
                                                        >
                                                            {status}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {((activeTab === 'vacancies' && filteredVacancies.length === 0) || (activeTab === 'applications' && filteredApplications.length === 0)) && (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            {activeTab === 'vacancies' ? <Briefcase size={32} /> : <FileText size={32} />}
                        </div>
                        <p className="text-secondary font-600">No {activeTab} found.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {modal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
                    <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm" onClick={() => setModal(false)}></div>
                    <div className="relative bg-white w-full max-w-5xl max-h-[90vh] flex flex-col rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="px-8 py-6 border-b border-black/5 flex justify-between items-center bg-brand-bg/50 shrink-0">
                            <h2 className="text-xl font-900 tracking-tighter text-brand-text">
                                {editId ? 'Edit Vacancy' : 'New Vacancy'}
                            </h2>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setForm({ ...form, is_active: !form.is_active })}
                                    className="flex items-center gap-2 text-sm font-700"
                                >
                                    <span className={form.is_active ? "text-brand-green" : "text-gray-400"}>
                                        {form.is_active ? "Active" : "Closed"}
                                    </span>
                                    {form.is_active ? <ToggleRight size={28} className="text-brand-green" /> : <ToggleLeft size={28} className="text-gray-300" />}
                                </button>
                                <button onClick={() => setModal(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors text-gray-400">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-8 flex-1 overflow-y-auto flex flex-col gap-6 no-scrollbar">
                            {/* Row 1: Position & Dept */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-800 text-gray-400 uppercase tracking-widest mb-2">Position Title <span className="text-brand-red">*</span></label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input
                                            type="text"
                                            className="w-full bg-brand-bg border border-black/5 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-brand-green font-700 text-brand-text"
                                            value={form.position}
                                            onChange={e => setForm({ ...form, position: e.target.value })}
                                            placeholder="e.g. Senior Surgical Consultant"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-800 text-gray-400 uppercase tracking-widest mb-2">Department</label>
                                    <div className="relative">
                                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <select
                                            className="w-full bg-brand-bg border border-black/5 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-brand-green font-600 text-brand-text appearance-none"
                                            value={form.department}
                                            onChange={e => setForm({ ...form, department: e.target.value })}
                                        >
                                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Location & Salary */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-800 text-gray-400 uppercase tracking-widest mb-2">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input
                                            type="text"
                                            className="w-full bg-brand-bg border border-black/5 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-brand-green font-500 text-brand-text"
                                            value={form.location}
                                            onChange={e => setForm({ ...form, location: e.target.value })}
                                            placeholder="e.g. Colombo, Sri Lanka / Remote"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-800 text-gray-400 uppercase tracking-widest mb-2">Salary Range</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input
                                            type="text"
                                            className="w-full bg-brand-bg border border-black/5 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-brand-green font-500 text-brand-text"
                                            value={form.salary_range}
                                            onChange={e => setForm({ ...form, salary_range: e.target.value })}
                                            placeholder="e.g. Rs. 150,000 - 250,000"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Row 3: Type & Level */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-800 text-gray-400 uppercase tracking-widest mb-2">Job Type</label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <select
                                            className="w-full bg-brand-bg border border-black/5 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-brand-green font-600 text-brand-text appearance-none"
                                            value={form.type}
                                            onChange={e => setForm({ ...form, type: e.target.value })}
                                        >
                                            {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-800 text-gray-400 uppercase tracking-widest mb-2">Experience Level</label>
                                    <div className="relative">
                                        <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <select
                                            className="w-full bg-brand-bg border border-black/5 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-brand-green font-600 text-brand-text appearance-none"
                                            value={form.experience_level}
                                            onChange={e => setForm({ ...form, experience_level: e.target.value })}
                                        >
                                            {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                            </div>

                            {/* Row 4: Description */}
                            <div>
                                <label className="block text-xs font-800 text-gray-400 uppercase tracking-widest mb-2">Job Description <span className="text-brand-red">*</span></label>
                                <textarea
                                    className="w-full bg-brand-bg border border-black/5 rounded-xl px-4 py-4 outline-none focus:border-brand-green font-500 text-brand-text min-h-[150px] resize-y"
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    placeholder="Provide a general overview of the role..."
                                    required
                                />
                            </div>

                            {/* Row 5: Requirements */}
                            <div>
                                <label className="block text-xs font-800 text-gray-400 uppercase tracking-widest mb-2">Requirements / Qualifications</label>
                                <textarea
                                    className="w-full bg-brand-bg border border-black/5 rounded-xl px-4 py-4 outline-none focus:border-brand-green font-500 text-brand-text min-h-[150px] resize-y"
                                    value={form.requirements}
                                    onChange={e => setForm({ ...form, requirements: e.target.value })}
                                    placeholder="List key requirements, one per line..."
                                />
                            </div>
                        </div>

                        <div className="px-8 py-6 bg-brand-bg/30 border-t border-black/5 flex justify-end gap-3 shrink-0">
                            <button
                                onClick={() => setModal(false)}
                                className="px-6 py-3 rounded-xl font-700 text-gray-400 hover:text-brand-text transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!form.position || !form.description}
                                className="bg-brand-green text-white px-8 py-3 rounded-xl font-800 transition-all hover:bg-brand-green-dark shadow-lg shadow-brand-green/20 disabled:opacity-50"
                            >
                                {editId ? 'Save Changes' : 'Post Vacancy'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCareers;
