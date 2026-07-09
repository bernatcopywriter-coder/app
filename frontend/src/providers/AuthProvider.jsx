import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getMe, logout as apiLogout } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        try {
            const me = await getMe();
            setUser(me);
        } catch (_) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // CRITICAL: If returning from OAuth callback, skip the /me check.
        // AuthCallback will exchange the session_id and establish the session first.
        if (
            typeof window !== 'undefined' &&
            window.location.hash?.includes('session_id=')
        ) {
            setLoading(false);
            return;
        }
        checkAuth();
    }, [checkAuth]);

    const doLogout = useCallback(async () => {
        try {
            await apiLogout();
        } catch (_) {
            // ignore
        }
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, setUser, refresh: checkAuth, logout: doLogout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
