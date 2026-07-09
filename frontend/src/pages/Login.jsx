import { Link } from 'react-router-dom';
import { LogIn, ArrowUpRight } from 'lucide-react';

export default function Login() {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const handleGoogleLogin = () => {
        const redirectUrl = window.location.origin + '/admin';
        window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
    };

    return (
        <div data-testid="login-page" className="min-h-screen bg-bg-0 flex flex-col">
            <div className="container-x py-6 flex justify-between items-center border-b border-line">
                <Link to="/" className="flex items-center gap-3 font-display uppercase tracking-tight">
                    <img src="/favicon.png" alt="Bernat Solutions" className="w-7 h-7 object-contain" />
                    <span className="text-lg font-semibold text-ink">Bernat Solutions</span>
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
                    <div className="border border-line-strong bg-bg-1 p-10">
                        <div className="overline brand mb-4">Admin</div>
                        <h1 className="h-display text-4xl text-ink mb-4">Sign in</h1>
                        <p className="text-ink-2 text-sm leading-relaxed">
                            Restricted to Bernat Solutions team accounts. Sign in with your
                            Google account to view submitted quotes and messages.
                        </p>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            data-testid="login-google-btn"
                            className="btn-fill mt-8 w-full inline-flex items-center justify-center gap-3 px-6 py-4 border border-line-strong text-ink text-sm font-semibold uppercase tracking-widest hover:text-white"
                        >
                            <LogIn size={16} />
                            Continue with Google
                        </button>

                        <div className="mt-6 text-xs text-ink-3">
                            You&apos;ll be redirected to Google, then straight back here.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
