import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, Phone, MapPin } from 'lucide-react';
import { CONTACT, SERVICES, AREAS } from '@/lib/constants';

export default function Footer() {
    return (
        <footer className="relative z-10 border-t border-line bg-bg-1 text-ink" data-testid="site-footer">
            <div className="container-x pt-24 pb-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
                    <div className="lg:col-span-5">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="inline-block w-3 h-3 rotate-45 bg-brand" />
                            <span className="font-display text-2xl uppercase tracking-tight">
                                Bernat Solutions
                            </span>
                        </div>
                        <p className="text-ink-2 max-w-md text-base leading-relaxed">
                            Steel, laser cutting and fabrication support for UK businesses. Send
                            drawings, receive a clear quote, and let us manage the work.
                        </p>

                        <Link
                            to="/quote"
                            data-testid="footer-cta-quote"
                            className="btn-fill mt-8 inline-flex items-center gap-2 px-6 py-3 border border-line-strong text-ink text-sm font-semibold uppercase tracking-wider hover:text-white"
                        >
                            Start a Quote
                            <ArrowUpRight size={16} />
                        </Link>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="overline mb-5">Site</div>
                        <ul className="space-y-3 text-ink-2">
                            <li>
                                <Link className="hover:text-brand" to="/">Home</Link>
                            </li>
                            <li>
                                <Link className="hover:text-brand" to="/services">Services</Link>
                            </li>
                            <li>
                                <Link className="hover:text-brand" to="/industries">Industries</Link>
                            </li>
                            <li>
                                <Link className="hover:text-brand" to="/about">About</Link>
                            </li>
                            <li>
                                <Link className="hover:text-brand" to="/quote">Request a Quote</Link>
                            </li>
                            <li>
                                <Link className="hover:text-brand" to="/contact">Contact</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="overline mb-5">Capabilities</div>
                        <ul className="space-y-3 text-ink-2">
                            {SERVICES.map((s) => (
                                <li key={s.slug}>
                                    <Link className="hover:text-brand" to={`/services/${s.slug}`}>
                                        {s.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="overline mb-5">Contact</div>
                        <ul className="space-y-3 text-ink-2">
                            <li className="flex items-start gap-3">
                                <Mail size={16} className="mt-1 text-brand" />
                                <a
                                    href={`mailto:${CONTACT.email}`}
                                    data-testid="footer-email"
                                    className="hover:text-ink"
                                >
                                    {CONTACT.email}
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone size={16} className="mt-1 text-brand" />
                                <a
                                    href={`tel:${CONTACT.phoneRaw}`}
                                    data-testid="footer-phone"
                                    className="hover:text-ink"
                                >
                                    {CONTACT.phone}
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin size={16} className="mt-1 text-brand" />
                                <span>{CONTACT.location}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-line flex flex-wrap gap-x-3 gap-y-2 text-xs text-ink-3 uppercase tracking-wider">
                    <span className="text-ink-2">Serving:</span>
                    {AREAS.map((a) => (
                        <span key={a}>{a} ·</span>
                    ))}
                </div>

                <div className="mt-10 pt-6 border-t border-line flex flex-col md:flex-row justify-between gap-4 text-xs text-ink-3 uppercase tracking-wider">
                    <div>© {new Date().getFullYear()} Bernat Solutions. All rights reserved.</div>
                    <div className="flex gap-6">
                        <Link className="hover:text-ink" to="/privacy">Privacy Policy</Link>
                        <Link className="hover:text-ink" to="/terms">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
