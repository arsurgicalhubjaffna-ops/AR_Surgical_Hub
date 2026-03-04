import React, { createContext, useState, useContext, useEffect } from 'react';
import insforge from '../lib/insforge';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    // Helper: Build user object from InsForge session + our DB profile
    const buildUser = async (authUser) => {
        if (!authUser) return null;
        try {
            const { data: profile } = await insforge.db
                .from('users')
                .select('*')
                .eq('id', authUser.id)
                .single();
            if (profile) {
                return { ...profile, email: authUser.email };
            }
        } catch (e) {
            // profile not found — use auth data
            console.log('Profile not found in users table, using auth data');
        }
        return {
            id: authUser.id,
            email: authUser.email,
            full_name: authUser.profile?.name || '',
            role: 'customer',
        };
    };

    useEffect(() => {
        let unsubscribe = null;

        // Restore session on mount
        const init = async () => {
            try {
                const result = await insforge.auth.getCurrentSession();
                const data = result?.data;
                if (data?.session?.user) {
                    setSession(data.session);
                    const u = await buildUser(data.session.user);
                    setUser(u);
                }
            } catch (err) {
                // No session or error — that's fine, just continue as guest
                console.log('No active session:', err?.message || err);
            }

            // Set up auth state listener (if available)
            try {
                if (typeof insforge.auth.onAuthStateChange === 'function') {
                    const listenerResult = insforge.auth.onAuthStateChange(async (event, newSession) => {
                        try {
                            setSession(newSession);
                            if (newSession?.user) {
                                const u = await buildUser(newSession.user);
                                setUser(u);
                            } else {
                                setUser(null);
                            }
                        } catch (e) {
                            console.error('Auth state change handler error:', e);
                        }
                    });
                    unsubscribe = listenerResult?.data?.subscription?.unsubscribe;
                }
            } catch (err) {
                console.log('Auth listener setup skipped:', err?.message || err);
            }

            setLoading(false);
        };

        init();

        return () => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
    }, []);

    const login = async (email, password) => {
        const { data, error } = await insforge.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Manually set user after login
        if (data?.user) {
            setSession(data);
            const u = await buildUser(data.user);
            setUser(u);
        }

        return data;
    };

    const register = async (userData) => {
        const { data, error } = await insforge.auth.signUp({
            email: userData.email,
            password: userData.password,
            name: userData.full_name,
        });
        if (error) throw error;

        // If email verification is required, return the data so the UI can show verification form
        if (data?.requireEmailVerification) {
            return { requireEmailVerification: true, email: userData.email, userData };
        }

        // If auto-signed in (no email verification), insert into our users table
        if (data?.user) {
            try {
                await insforge.db.from('users').insert([{
                    id: data.user.id,
                    full_name: userData.full_name,
                    email: userData.email,
                    phone: userData.phone || null,
                    role: 'customer',
                }]);
            } catch (e) {
                console.error('Failed to insert user profile:', e);
            }
        }

        return data;
    };

    const verifyEmailCode = async (email, otp, userData) => {
        const { data, error } = await insforge.auth.verifyEmail({ email, otp });
        if (error) throw error;

        // After verification, insert user into our users table
        if (data?.user) {
            try {
                await insforge.db.from('users').insert([{
                    id: data.user.id,
                    full_name: userData?.full_name || data.user.profile?.name || '',
                    email: data.user.email,
                    phone: userData?.phone || null,
                    role: 'customer',
                }]);
            } catch (e) {
                console.error('Failed to insert verified user profile:', e);
            }

            // Set current user
            setSession(data);
            const u = await buildUser(data.user);
            setUser(u);
        }

        return data;
    };

    const resendVerification = async (email) => {
        const { data, error } = await insforge.auth.resendVerificationEmail({ email });
        if (error) throw error;
        return data;
    };

    const logout = async () => {
        try {
            await insforge.auth.signOut();
        } catch (e) {
            console.error('Logout error:', e);
        }
        setUser(null);
        setSession(null);
    };

    return (
        <AuthContext.Provider value={{
            user, session, login, register, logout, loading,
            verifyEmail: verifyEmailCode, resendVerification,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
