import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, KeyRound, RefreshCw } from 'lucide-react';

const Login: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showVerify, setShowVerify] = useState(false);
    const [verifyEmail, setVerifyEmail] = useState('');
    const [pendingUserData, setPendingUserData] = useState<any>(null);
    const [otp, setOtp] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        phone: ''
    });
    const { login, register, verifyEmail: verifyEmailFn, resendVerification } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
                navigate('/');
            } else {
                const result = await register(formData);
                if (result?.requireEmailVerification) {
                    setVerifyEmail(formData.email);
                    setPendingUserData(formData);
                    setShowVerify(true);
                } else {
                    setIsLogin(true);
                    navigate('/');
                }
            }
        } catch (err: any) {
            const errorMsg = err.message || 'Authentication failed. Please check your credentials.';
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await verifyEmailFn(verifyEmail, otp, pendingUserData);
            alert('Email verified successfully! You are now signed in.');
            navigate('/');
        } catch (err: any) {
            alert(err.message || 'Invalid verification code.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            await resendVerification(verifyEmail);
            alert('Verification code resent to ' + verifyEmail);
        } catch (err: any) {
            alert(err.message || 'Failed to resend code.');
        }
    };

    const inputClasses = "w-full bg-transparent border-none text-brand-text placeholder-brand-text-muted outline-none text-[0.93rem] font-500 py-1";
    const groupClasses = "flex items-center gap-3 bg-brand-bg border-1.5 border-brand-border px-4 py-3 rounded-xl transition-all focus-within:border-brand-green focus-within:shadow-[0_0_0_4px_var(--color-brand-green-light)] focus-within:bg-white mb-4";

    // ─── Verification Code Screen ───
    if (showVerify) {
        return (
            <div className="min-h-[85vh] flex items-center justify-center bg-brand-bg px-5 py-12">
                <div className="w-full max-w-[440px] bg-white border border-brand-border rounded-[32px] p-8 md:p-12 shadow-sm">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-brand-green-light rounded-full flex items-center justify-center text-brand-green mx-auto mb-6">
                            <KeyRound size={32} />
                        </div>
                        <h2 className="text-2xl font-800 tracking-tighter text-brand-text mb-2">Verify Your Email</h2>
                        <p className="text-brand-text-muted text-sm leading-relaxed">
                            Enter the 6-digit code sent to <br /><strong className="text-brand-text">{verifyEmail}</strong>
                        </p>
                    </div>

                    <form onSubmit={handleVerify} className="flex flex-col gap-6">
                        <div className={`${groupClasses} justify-center`}>
                            <input
                                type="text"
                                placeholder="000000"
                                required
                                maxLength={6}
                                className={`${inputClasses} text-center tracking-[0.4em] text-xl font-800`}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-brand-green text-white w-full h-14 rounded-xl font-800 flex items-center justify-center gap-2 transition-all hover:bg-brand-green-dark hover:-translate-y-0.5 shadow-lg shadow-brand-green/20"
                        >
                            {loading ? 'Verifying...' : (<>Verify Email <ArrowRight size={20} /></>)}
                        </button>
                    </form>

                    <div className="mt-8 flex flex-col items-center gap-4">
                        <button onClick={handleResend} className="text-brand-green font-700 text-sm flex items-center gap-1.5 hover:underline">
                            <RefreshCw size={14} /> Resend Code
                        </button>
                        <button onClick={() => { setShowVerify(false); setOtp(''); }} className="text-brand-text-muted font-600 text-sm hover:text-brand-text transition-colors">
                            ← Back to Signup
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[85vh] flex items-center justify-center bg-brand-bg px-5 py-12">
            <div className="w-full max-w-[440px] bg-white border border-brand-border rounded-[32px] p-8 md:p-12 shadow-sm">

                {/* Tabs */}
                <div className="flex bg-brand-bg border border-brand-border rounded-xl p-1 mb-10">
                    <button
                        className={`flex-1 py-2.5 rounded-lg text-[0.85rem] font-700 transition-all ${isLogin ? 'bg-brand-green text-white shadow-md shadow-brand-green/20' : 'text-brand-text-muted hover:text-brand-text'}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Sign In
                    </button>
                    <button
                        className={`flex-1 py-2.5 rounded-lg text-[0.85rem] font-700 transition-all ${!isLogin ? 'bg-brand-green text-white shadow-md shadow-brand-green/20' : 'text-brand-text-muted hover:text-brand-text'}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Sign Up
                    </button>
                </div>

                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-800 tracking-tighter text-brand-text mb-2">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-brand-text-muted text-sm">
                        {isLogin ? 'Securely access your surgical hub account' : 'Join AR Surgical Hub for professional medical solutions'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-1">
                    {!isLogin && (
                        <>
                            <div className={groupClasses}>
                                <User size={18} className="text-brand-text-muted" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    required
                                    className={inputClasses}
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                />
                            </div>
                            <div className={groupClasses}>
                                <Phone size={18} className="text-brand-text-muted" />
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    className={inputClasses}
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </>
                    )}
                    <div className={groupClasses}>
                        <Mail size={18} className="text-brand-text-muted" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            className={inputClasses}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className={groupClasses}>
                        <Lock size={18} className="text-brand-text-muted" />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            className={inputClasses}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-brand-green text-white w-full h-14 rounded-xl font-800 flex items-center justify-center gap-2 mt-4 transition-all hover:bg-brand-green-dark hover:-translate-y-0.5 shadow-lg shadow-brand-green/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Authenticating...' : (<>{isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight size={20} /></>)}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-[0.88rem] text-brand-text-muted">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button onClick={() => setIsLogin(!isLogin)} className="text-brand-green font-800 hover:underline inline-block ml-1">
                            {isLogin ? 'Create one' : 'Login here'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
