import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, KeyRound, RefreshCw } from 'lucide-react';
import './Login.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showVerify, setShowVerify] = useState(false);
    const [verifyEmail, setVerifyEmail] = useState('');
    const [pendingUserData, setPendingUserData] = useState(null);
    const [otp, setOtp] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        phone: ''
    });
    const { login, register, verifyEmail: verifyEmailFn, resendVerification } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
                navigate('/');
            } else {
                const result = await register(formData);
                if (result?.requireEmailVerification) {
                    // Show verification form
                    setVerifyEmail(formData.email);
                    setPendingUserData(formData);
                    setShowVerify(true);
                } else {
                    setIsLogin(true);
                    navigate('/');
                }
            }
        } catch (err) {
            const errorMsg = err.message || 'Authentication failed. Please check your credentials.';
            alert(errorMsg);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            await verifyEmailFn(verifyEmail, otp, pendingUserData);
            alert('Email verified successfully! You are now signed in.');
            navigate('/');
        } catch (err) {
            alert(err.message || 'Invalid verification code.');
        }
    };

    const handleResend = async () => {
        try {
            await resendVerification(verifyEmail);
            alert('Verification code resent to ' + verifyEmail);
        } catch (err) {
            alert(err.message || 'Failed to resend code.');
        }
    };

    // ─── Verification Code Screen ───
    if (showVerify) {
        return (
            <div className="login-container container">
                <div className="login-card bg-glass">
                    <div className="login-header">
                        <h2>Verify Your Email</h2>
                        <p>Enter the 6-digit code sent to <strong>{verifyEmail}</strong></p>
                    </div>
                    <form onSubmit={handleVerify}>
                        <div className="input-group">
                            <KeyRound size={18} />
                            <input
                                type="text"
                                placeholder="6-digit verification code"
                                required
                                maxLength={6}
                                pattern="[0-9]{6}"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                style={{ letterSpacing: '0.3em', fontSize: '1.1rem', textAlign: 'center' }}
                            />
                        </div>
                        <button type="submit" className="btn-primary w-full login-btn">
                            Verify Email <ArrowRight size={18} />
                        </button>
                    </form>
                    <div className="login-footer" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                        <button onClick={handleResend} className="toggle-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <RefreshCw size={14} /> Resend Code
                        </button>
                        <button onClick={() => { setShowVerify(false); setOtp(''); }} className="toggle-btn">
                            ← Back to Signup
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Normal Login / Register ───
    return (
        <div className="login-container container">
            <div className="login-card bg-glass">
                <div className="login-header">
                    <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p>{isLogin ? 'Login to manage your orders' : 'Join AR Surgical Hub today'}</p>
                </div>
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <div className="input-group">
                                <User size={18} />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    required
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <Phone size={18} />
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </>
                    )}
                    <div className="input-group">
                        <Mail size={18} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <Lock size={18} />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full login-btn">
                        {isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight size={18} />
                    </button>
                </form>
                <div className="login-footer">
                    <p>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button onClick={() => setIsLogin(!isLogin)} className="toggle-btn">
                            {isLogin ? 'Create one' : 'Login here'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
