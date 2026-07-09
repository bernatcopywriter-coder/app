import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { exchangeSession } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';

export default function AuthCallback() {
    const location = useLocation();
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const processed = useRef(false);

    useEffect(() => {
        if (processed.current) return;
        processed.current = true;

        const hash = location.hash || '';
        const match = hash.match(/session_id=([^&]+)/);
        if (!match) {
            navigate('/login', { replace: true });
            return;
        }
        const sessionId = decodeURIComponent(match[1]);

        (async () => {
            try {
                const user = await exchangeSession(sessionId);
                setUser(user);
                // Clear the hash so it can't be replayed.
                if (window.history?.replaceState) {
                    window.history.replaceState(null, '', window.location.pathname);
                }
                navigate('/admin', { replace: true, state: { user } });
            } catch (_err) {
                toast.error('Could not complete sign in. Please try again.');
                navigate('/login', { replace: true });
            }
        })();
    }, [location.hash, navigate, setUser]);

    return (
        <div data-testid="auth-callback-page" className="min-h-screen bg-bg-0 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4 text-ink-2"
            >
                <Loader2 size={28} className="animate-spin text-brand" />
                <div className="overline">Signing you in…</div>
            </motion.div>
        </div>
    );
}
