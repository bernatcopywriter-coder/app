import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';

export default function Nav() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const { pathname } = useLocation();

    useEffect(() => {
        const on = () => setScrolled(window.scrollY > 24);
        on();
        window.addEventListener('scroll', on, { passive: true });
        return () => window.removeEventListener('scroll', on);
    }, []);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    return (
        <>
            <motion.header
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1], delay: 0.05 }}
                data-testid="site-nav"
                className={`fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,border-color] duration-300 ${
                    scrolled
                        ? 'bg-bg-0/80 backdrop-blur-2xl border-b border-line'
                        : 'bg-transparent border-b border-transparent'
                }`}
            >
                <div className="container-x flex items-center justify-between h-[68px]">
                    <Link
                        to="/"
                        data-testid="nav-logo"
                        className="group flex items-center gap-3 font-display uppercase tracking-tight text-ink"
                    >
                        <img
                            src="/favicon.png"
                            alt="Bernat Solutions"
                            className="w-8 h-8 object-contain"
                        />
                        <span className="text-[17px] font-semibold leading-none">Bernat Solutions</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        {NAV_LINKS.map((l) => (
                            <NavLink
                                key={l.to}
                                to={l.to}
                                data-testid={`nav-link-${l.label.toLowerCase()}`}
                                className={({ isActive }) =>
                                    `text-sm tracking-wide uppercase font-medium relative py-1 transition-colors ${
                                        isActive
                                            ? 'text-ink'
                                            : 'text-ink-2 hover:text-ink'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {l.label}
                                        {isActive && (
                                            <motion.span
                                                layoutId="nav-underline"
                                                className="absolute -bottom-1 left-0 right-0 h-[2px] bg-brand"
                                            />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            to="/quote"
                            data-testid="nav-cta-quote"
                            className="btn-fill inline-flex items-center gap-2 px-5 py-2.5 border border-brand text-ink bg-brand hover:text-white text-sm font-semibold uppercase tracking-wider"
                        >
                            Request a Quote
                            <ArrowUpRight size={16} strokeWidth={2.4} />
                        </Link>
                    </div>

                    <button
                        onClick={() => setOpen((v) => !v)}
                        aria-label="Menu"
                        data-testid="nav-menu-toggle"
                        className="md:hidden p-2 border border-line-strong text-ink"
                    >
                        {open ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </motion.header>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        data-testid="mobile-nav"
                        className="fixed inset-x-0 top-[68px] z-40 md:hidden border-b border-line bg-bg-0/95 backdrop-blur-xl"
                    >
                        <div className="container-x py-8 flex flex-col gap-1">
                            {NAV_LINKS.map((l) => (
                                <Link
                                    key={l.to}
                                    to={l.to}
                                    className="font-display uppercase text-3xl py-3 text-ink hover:text-brand transition-colors"
                                >
                                    {l.label}
                                </Link>
                            ))}
                            <Link
                                to="/quote"
                                className="mt-6 inline-flex items-center justify-between px-5 py-4 bg-brand text-white font-semibold uppercase tracking-wider"
                            >
                                Request a Quote
                                <ArrowUpRight size={18} />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
