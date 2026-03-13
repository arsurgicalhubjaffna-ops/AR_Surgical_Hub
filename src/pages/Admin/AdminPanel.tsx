import React, { useState } from 'react';
import {
    LayoutDashboard, Package, ShoppingBag, Users, LogOut,
    Search, Bell, Settings, Menu, X, ChevronRight, ClipboardList, MessageSquare, FileText, ShieldCheck, Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminCategories from './AdminCategories';
import AdminSubcategories from './AdminSubcategories';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import AdminQuotes from './AdminQuotes';
import AdminBlogs from './AdminBlogs';
import AdminSettings from './AdminSettings';
import AdminWarranty from './AdminWarranty';
import AdminCareers from './AdminCareers';

type AdminPage = 'dashboard' | 'products' | 'categories' | 'subcategories' | 'orders' | 'users' | 'quotes' | 'blogs' | 'careers' | 'warranty' | 'settings';

interface NavItem {
    key: AdminPage;
    label: string;
    Icon: any;
}

interface NavCategory {
    label: string;
    items: NavItem[];
}

const NAV_GROUPS: NavCategory[] = [
    {
        label: 'Main',
        items: [
            { key: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
        ]
    },
    {
        label: 'Inventory',
        items: [
            { key: 'products', label: 'Products', Icon: Package },
            { key: 'categories', label: 'Classifications', Icon: ShoppingBag },
            { key: 'subcategories', label: 'Sub-Classes', Icon: ShoppingBag },
        ]
    },
    {
        label: 'Operations',
        items: [
            { key: 'orders', label: 'Orders', Icon: ClipboardList },
            { key: 'quotes', label: 'Quote Requests', Icon: MessageSquare },
            { key: 'warranty', label: 'Warranty Claims', Icon: ShieldCheck },
        ]
    },
    {
        label: 'Content',
        items: [
            { key: 'blogs', label: 'Blogs', Icon: FileText },
            { key: 'careers', label: 'Careers', Icon: Briefcase },
        ]
    },
    {
        label: 'System',
        items: [
            { key: 'users', label: 'Users', Icon: Users },
            { key: 'settings', label: 'Site Settings', Icon: Settings },
        ]
    }
];

const NAV_ITEMS = NAV_GROUPS.flatMap(g => g.items);

const AdminPanel: React.FC = () => {
    const [activePage, setActivePage] = useState<AdminPage>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const renderPage = () => {
        switch (activePage) {
            case 'dashboard': return <AdminDashboard />;
            case 'products': return <AdminProducts />;
            case 'categories': return <AdminCategories />;
            case 'subcategories': return <AdminSubcategories />;
            case 'orders': return <AdminOrders />;
            case 'users': return <AdminUsers />;
            case 'blogs': return <AdminBlogs />;
            case 'careers': return <AdminCareers />;
            case 'quotes': return <AdminQuotes />;
            case 'warranty': return <AdminWarranty />;
            case 'settings': return <AdminSettings />;
            default: return <AdminDashboard />;
        }
    };

    const pageTitle = NAV_ITEMS.find(i => i.key === activePage)?.label || 'Admin Panel';

    return (
        <div className="flex h-screen bg-brand-bg relative overflow-hidden font-primary">
            {/* Sidebar Backdrop (Mobile only) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-[45] lg:hidden backdrop-blur-md transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-[#070b14] text-white transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] transform shadow-[10px_0_30px_rgba(0,0,0,0.5)] border-r border-white/5 ${sidebarOpen ? 'w-72 translate-x-0' : 'w-20 lg:translate-x-0 -translate-x-full'}`}
            >
                {/* Logo Section */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-green to-brand-green-dark flex items-center justify-center shadow-lg shadow-brand-green/20">
                            <img src="/ar.svg" alt="AR" className="w-6 h-6 brightness-0 invert opacity-90" />
                        </div>
                        {sidebarOpen && (
                            <div className="ml-4 overflow-hidden whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                                <h2 className="text-lg font-900 tracking-tighter text-white leading-tight">AR</h2>
                                <span className="text-[0.6rem] font-800 uppercase tracking-[0.2em] text-brand-green/80">SURGICAL HUB</span>
                            </div>
                        )}
                    </div>
                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 text-gray-500 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className={`py-6 px-3 flex flex-col gap-6 overflow-y-auto no-scrollbar h-[calc(100vh-160px)]`}>
                    {NAV_GROUPS.map((group) => (
                        <div key={group.label} className="flex flex-col gap-1.5">
                            {sidebarOpen && (
                                <p className="px-4 text-[0.65rem] font-800 uppercase tracking-[0.2em] text-gray-500 mb-1 animate-in fade-in duration-500">
                                    {group.label}
                                </p>
                            )}
                            <div className="flex flex-col gap-1">
                                {group.items.map(({ key, label, Icon }) => (
                                    <button
                                        key={key}
                                        onClick={() => {
                                            setActivePage(key);
                                            if (window.innerWidth < 1024) setSidebarOpen(false);
                                        }}
                                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative group
                                            ${activePage === key 
                                                ? 'bg-gradient-to-r from-brand-green/20 to-brand-green/5 text-brand-green' 
                                                : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'}`}
                                    >
                                        {/* Active Indicator */}
                                        {activePage === key && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-green rounded-r-full shadow-[0_0_15px_rgba(56,189,248,0.5)]" />
                                        )}
                                        
                                        <Icon 
                                            size={sidebarOpen ? 20 : 24} 
                                            className={`shrink-0 transition-transform duration-300 ${activePage === key ? 'scale-110' : 'group-hover:scale-110'}`} 
                                        />
                                        
                                        {sidebarOpen && (
                                            <span className={`font-600 text-[0.85rem] tracking-tight animate-in fade-in slide-in-from-left-2 duration-300`}>
                                                {label}
                                            </span>
                                        )}

                                        {/* Tooltip for collapsed state */}
                                        {!sidebarOpen && (
                                            <div className="fixed left-24 px-3 py-1.5 bg-[#1e293b] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-[60] shadow-xl border border-white/5 whitespace-nowrap">
                                                {label}
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-[#070b14]/80 backdrop-blur-sm border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-xl text-brand-red font-700 transition-all duration-300 group
                            ${sidebarOpen ? 'hover:bg-brand-red/10' : 'justify-center hover:bg-brand-red/10'}`}
                    >
                        <LogOut size={20} className="shrink-0 transition-transform group-hover:-translate-x-1" />
                        {sidebarOpen && <span className="text-[0.9rem]">Sign Out</span>}
                        
                        {!sidebarOpen && (
                            <div className="fixed left-24 px-3 py-1.5 bg-[#1e293b] text-brand-red text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-[60] shadow-xl border border-white/5 whitespace-nowrap font-bold">
                                Sign Out
                            </div>
                        )}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}`}>
                {/* Topbar */}
                <header className="h-20 bg-white border-b border-black/5 px-8 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-brand-bg rounded-lg text-gray-400 transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-xl font-800 tracking-tighter text-brand-text hidden md:block">
                            {pageTitle}
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex items-center gap-2 bg-brand-bg px-4 py-2 rounded-full border border-black/5">
                            <Search size={16} className="text-gray-400" />
                            <input type="text" placeholder="Global search..." className="bg-transparent border-none outline-none text-sm w-48 font-500" />
                        </div>
                        <button className="relative p-2 text-gray-400 hover:text-brand-green transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-red rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-10 w-[1px] bg-black/5 hidden sm:block"></div>
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-800 text-brand-text leading-tight">{user?.full_name || 'Admin User'}</p>
                                <span className="text-[0.7rem] font-700 text-brand-green uppercase tracking-widest">Master Admin</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-900 border-2 border-brand-green/20">
                                {user?.full_name?.[0] || 'A'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Area */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-[1600px] mx-auto">
                        {renderPage()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;
