import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LogIn, ArrowUpRight, Loader2 } from 'lucide-react';
import { loginWithPassword } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';

function formatError(detail) {
    if (!detail) return 'Login failed. Please try again.';
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
        return detail.map((e) => (e?.msg ? e.msg : JSON.stringify(e))).join(' ');
    }
    return String(detail);
}

export default function Login() {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Enter your email and password.');
            return;
        }
        setBusy(true);
        try {
            const user = await loginWithPassword(email, password);
            setUser(user);
            if (!user.is_admin) {
                toast.error('This account is not authorised for the admin dashboard.');
                navigate('/', { replace: true });
                return;
            }
            navigate('/admin', { replace: true, state: { user } });
        } catch (err) {
            toast.error(formatError(err?.response?.data?.detail) || err.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div data-testid="login-page" className="min-h-screen bg-bg-0 flex flex-col">
            <div className="container-x py-6 flex justify-between items-center border-b border-line">
                <Link to="/" className="flex items-center gap-3 font-display uppercase tracking-tight">
                    <span
                        aria-hidden
                        className="w-8 h-8 border border-brand flex items-center justify-center text-brand font-display text-[13px] font-semibold tracking-widest"
                    >
                        KM
                    </span>
                    <span className="flex flex-col leading-[0.95] font-semibold">
                        <span className="text-[15px] tracking-widest text-ink">KINGSFORD</span>
                        <span className="text-[11px] tracking-[0.32em] text-ink-2">METALS</span>
                    </span>
                </Link>
                <Link
                    to="/"
                    className="text-sm text-ink-2 hover:text-ink uppercase tracking-widest inline-flex items-center gap-2"
                >
                    Back to site
                    <ArrowUpRight size={14} />
                </Link>
            </div>

            <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{
                        backgroundImage:
                            "url('https://images.pexels.com/photos/12475054/pexels-photo-12475054.jpeg')",
                    }}
                    aria-hidden
                />
                <div className="absolute inset-0 bg-gradient-to-b from-bg-0/70 to-bg-0" aria-hidden />
                <div className="absolute inset-0 grid-lines opacity-60" aria-hidden />

                <div className="relative container-x max-w-md w-full">
                    <form
                        onSubmit={submit}
                        className="border border-line-strong bg-bg-1 p-8 sm:p-10"
                    >
                        <div className="overline brand mb-4">Admin</div>
                        <h1 className="h-display text-4xl text-ink mb-4">Sign in</h1>
                        <p className="text-ink-2 text-sm leading-relaxed mb-8">
                            Restricted to Kingsford Metals team accounts. Enter your admin
                            email and password to view submitted quotes and messages.
                        </p>

                        <label className="block mb-5">
                            <span className="overline block mb-2">Email</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                                data-testid="login-email"
                                className="w-full bg-transparent border-0 border-b border-line-strong text-ink text-lg py-2 outline-none focus:border-brand transition-colors"
                            />
                        </label>

                        <label className="block mb-8">
                            <span className="overline block mb-2">Password</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                                data-testid="login-password"
                                className="w-full bg-transparent border-0 border-b border-line-strong text-ink text-lg py-2 outline-none focus:border-brand transition-colors"
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={busy}
                            data-testid="login-submit"
                            className="btn-fill w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-brand text-white text-sm font-semibold uppercase tracking-widest disabled:opacity-60"
                        >
                            {busy ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" /> Signing in…
                                </>
                            ) : (
                                <>
                                    <LogIn size={16} />
                                    Sign in
                                </>
                            )}
                        </button>

                        <div className="mt-6 text-xs text-ink-3 leading-relaxed">
                            Forgot your password? Email{' '}
                            <a
                                href="mailto:alex@bernatsolutions.com"
                                className="text-brand hover:underline"
                            >
                                alex@bernatsolutions.com
                            </a>{' '}
                            to reset.
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
