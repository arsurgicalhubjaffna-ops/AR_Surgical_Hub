import React, { useState } from 'react';
import {
    LayoutDashboard, Package, ShoppingBag, Users, LogOut,
    Search, Bell, Settings, Menu, X, ChevronRight, ClipboardList, MessageSquare, FileText
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

type AdminPage = 'dashboard' | 'products' | 'categories' | 'subcategories' | 'orders' | 'users' | 'quotes' | 'blogs';

const NAV_ITEMS: { key: AdminPage; label: string; Icon: any }[] = [
    { key: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    { key: 'products', label: 'Products', Icon: Package },
    { key: 'categories', label: 'Classifications', Icon: ShoppingBag },
    { key: 'subcategories', label: 'Sub-Classes', Icon: ShoppingBag },
    { key: 'orders', label: 'Orders', Icon: ClipboardList },
    { key: 'users', label: 'Users', Icon: Users },
    { key: 'blogs', label: 'Blogs', Icon: FileText },
    { key: 'quotes', label: 'Quote Requests', Icon: MessageSquare },
];

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
            case 'quotes': return <AdminQuotes />;
            default: return <AdminDashboard />;
        }
    };

    const pageTitle = NAV_ITEMS.find(i => i.key === activePage)?.label || 'Admin Panel';

    return (
        <div className="flex h-screen bg-brand-bg">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0f172a] text-white transition-all duration-300 ease-in-out transform shadow-2xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'}`}
            >
                {/* Logo Section */}
                <div className="h-20 flex items-center px-6 border-b border-white/5">
                    <img src="/ar.svg" alt="AR" className="w-10 h-10 shrink-0 brightness-0 invert opacity-90" />
                    {sidebarOpen && (
                        <div className="ml-3 overflow-hidden whitespace-nowrap">
                            <h2 className="text-lg font-800 tracking-tighter text-white">AR SURGICAL</h2>
                            <span className="text-[0.65rem] font-700 uppercase tracking-widest text-brand-blue">Advanced Hub</span>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="mt-8 px-4 flex flex-col gap-2">
                    {NAV_ITEMS.map(({ key, label, Icon }) => (
                        <button
                            key={key}
                            onClick={() => setActivePage(key)}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${activePage === key ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <Icon size={20} className={activePage === key ? 'text-white' : 'group-hover:text-brand-green'} />
                            {sidebarOpen && <span className="font-600 text-[0.93rem] tracking-tight">{label}</span>}
                        </button>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 w-full px-4 py-4 rounded-xl text-brand-red opacity-80 hover:opacity-100 hover:bg-brand-red/10 transition-all font-700"
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span className="text-[0.93rem]">Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}`}>
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
