import { useEffect, useRef } from 'react';
import {
    Phone, Mail, MessageSquare, MessageCircle, ArrowRight, Check,
    Home, Droplets, Wind, Hammer,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Peakline Exterior Cleaning — Standalone page                              */
/*  Fully separate from the Kingsford Metals / Bernat Solutions site:         */
/*  own header, own footer, own fonts (Montserrat + Inter), own palette.      */
/* -------------------------------------------------------------------------- */

const PHONE_DISPLAY = '07737 563812';
const PHONE_TEL = '+447737563812';
const EMAIL = 'alex@bernatsolutions.com';
const MESSENGER = 'https://m.me/61594319585931';

const NAVY = '#0F172A';
const PEAK = '#38BDF8';

export default function Peakline() {
    const contactRef = useRef(null);

    // --- Document title + meta tags (restore on unmount) ---------------------
    useEffect(() => {
        const prevTitle = document.title;
        document.title =
            'Peakline Exterior Cleaning | Roof and Gutter Cleaning, Mansfield';

        const metas = [
            {
                name: 'description',
                content:
                    'Roof moss removal, gutter clearing, driveway and patio pressure washing, fascias and soffits around Mansfield, Nottinghamshire. 25% off for new customers.',
            },
            {
                property: 'og:title',
                content:
                    'Peakline Exterior Cleaning | Roof and Gutter Cleaning, Mansfield',
            },
            {
                property: 'og:description',
                content:
                    'Roof moss removal, gutter clearing, driveway and patio pressure washing, fascias and soffits around Mansfield. 25% off for new customers.',
            },
            { property: 'og:type', content: 'website' },
        ];

        const prevValues = new Map();
        const created = [];

        metas.forEach(({ name, property, content }) => {
            const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
            let el = document.head.querySelector(selector);
            if (el) {
                prevValues.set(el, el.getAttribute('content'));
            } else {
                el = document.createElement('meta');
                if (name) el.setAttribute('name', name);
                if (property) el.setAttribute('property', property);
                document.head.appendChild(el);
                created.push(el);
            }
            el.setAttribute('content', content);
        });

        return () => {
            document.title = prevTitle;
            prevValues.forEach((val, el) => {
                if (val === null) el.removeAttribute('content');
                else el.setAttribute('content', val);
            });
            created.forEach((el) => el.remove());
        };
    }, []);

    // --- Montserrat + Inter font loading (scoped to this page) ---------------
    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href =
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800&display=swap';
        link.setAttribute('data-peakline-fonts', 'true');
        document.head.appendChild(link);
        return () => {
            link.remove();
        };
    }, []);

    // --- Override global dark body while Peakline is mounted -----------------
    useEffect(() => {
        const prevBg = document.body.style.background;
        const prevColor = document.body.style.color;
        document.body.style.background = '#ffffff';
        document.body.style.color = '#334155';
        return () => {
            document.body.style.background = prevBg;
            document.body.style.color = prevColor;
        };
    }, []);

    const scrollToContact = () => {
        contactRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const headingFont = { fontFamily: `'Montserrat', system-ui, sans-serif` };
    const bodyFont = { fontFamily: `'Inter', system-ui, sans-serif` };

    return (
        <div
            data-testid="peakline-page"
            className="min-h-screen bg-white text-slate-600"
            style={bodyFont}
        >
            {/* ============================  HEADER  ============================ */}
            <header
                className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200"
                data-testid="peakline-header"
            >
                <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
                    <a
                        href="/peakline"
                        className="flex items-center gap-3"
                        data-testid="peakline-logo"
                    >
                        <span
                            aria-hidden
                            className="w-8 h-8 rounded-md flex items-center justify-center"
                            style={{ background: NAVY }}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className="w-5 h-5"
                                fill="none"
                                stroke={PEAK}
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M3 20 L10 8 L14 14 L18 6 L21 20 Z" />
                            </svg>
                        </span>
                        <span
                            className="font-semibold text-base sm:text-lg"
                            style={{ ...headingFont, color: NAVY }}
                        >
                            Peakline <span className="hidden sm:inline">Exterior Cleaning</span>
                        </span>
                    </a>

                    <a
                        href={`tel:${PHONE_TEL}`}
                        data-testid="peakline-header-call"
                        className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-md text-white text-sm font-semibold transition-transform hover:-translate-y-0.5"
                        style={{ background: NAVY }}
                    >
                        <Phone size={15} strokeWidth={2.4} />
                        <span className="hidden sm:inline">{PHONE_DISPLAY}</span>
                        <span className="sm:hidden">Call</span>
                    </a>
                </div>
            </header>

            {/* =============================  HERO  ============================= */}
            <section className="relative overflow-hidden">
                <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            'radial-gradient(80% 60% at 85% 0%, rgba(56,189,248,0.14), transparent 65%)',
                    }}
                />
                <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-16 sm:pt-20 sm:pb-24">
                    <div
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                        style={{
                            background: 'rgba(56,189,248,0.12)',
                            color: '#0369a1',
                            border: '1px solid rgba(56,189,248,0.35)',
                        }}
                        data-testid="peakline-hero-label"
                    >
                        <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: PEAK }}
                        />
                        25% off for new customers
                    </div>

                    <h1
                        className="mt-6 text-4xl sm:text-5xl lg:text-6xl leading-[1.05] max-w-4xl font-extrabold"
                        style={{ ...headingFont, color: NAVY }}
                        data-testid="peakline-hero-heading"
                    >
                        Roof, gutter and driveway cleaning around Mansfield.
                    </h1>

                    <p
                        className="mt-4 text-lg sm:text-xl font-semibold"
                        style={{ ...headingFont, color: PEAK }}
                    >
                        Higher Standards. A Cleaner Tomorrow.
                    </p>

                    <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                        Peakline Exterior Cleaning looks after the outside of homes across
                        Nottinghamshire. Two brothers who answer their own messages.
                    </p>

                    <div className="mt-9 flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={scrollToContact}
                            data-testid="peakline-hero-quote"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md text-white text-sm font-semibold transition-transform hover:-translate-y-0.5"
                            style={{ background: NAVY }}
                        >
                            Get a free quote
                            <ArrowRight size={16} />
                        </button>
                        <a
                            href={`tel:${PHONE_TEL}`}
                            data-testid="peakline-hero-call"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md text-sm font-semibold border transition-colors"
                            style={{
                                borderColor: NAVY,
                                color: NAVY,
                                background: 'transparent',
                            }}
                        >
                            <Phone size={15} strokeWidth={2.4} />
                            Call {PHONE_DISPLAY}
                        </a>
                    </div>
                </div>
            </section>

            {/* ========================  WHAT WE CLEAN  ========================= */}
            <section className="py-16 sm:py-20 border-t border-slate-100 bg-slate-50/60">
                <div className="max-w-6xl mx-auto px-5 sm:px-8">
                    <SectionHeading
                        label="What we clean"
                        title="Four services, done properly."
                    />

                    <div
                        className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                        data-testid="peakline-services"
                    >
                        <ServiceCard
                            icon={<Home size={22} />}
                            title="Roof moss removal and treatment"
                            text="Moss cleared from the roof and treated so it stays off longer."
                        />
                        <ServiceCard
                            icon={<Droplets size={22} />}
                            title="Gutter clearing"
                            text="Blocked gutters emptied, downpipes checked, flow restored."
                        />
                        <ServiceCard
                            icon={<Wind size={22} />}
                            title="Driveway and patio pressure washing"
                            text="Dirt, moss and algae lifted from paving, block paving and patios."
                        />
                        <ServiceCard
                            icon={<Hammer size={22} />}
                            title="Fascia and soffit cleaning"
                            text="Fascias, soffits and uPVC trim brought back to a clean, bright finish."
                        />
                    </div>
                </div>
            </section>

            {/* ============================  OFFER  ============================= */}
            <section className="py-16 sm:py-20">
                <div className="max-w-6xl mx-auto px-5 sm:px-8">
                    <div
                        className="relative rounded-2xl overflow-hidden p-8 sm:p-14 text-white"
                        style={{ background: NAVY }}
                        data-testid="peakline-offer"
                    >
                        <div
                            aria-hidden
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background:
                                    'radial-gradient(60% 90% at 100% 0%, rgba(56,189,248,0.22), transparent 60%)',
                            }}
                        />
                        <div className="relative">
                            <div
                                className="inline-block text-xs font-semibold uppercase tracking-widest mb-5 px-3 py-1 rounded-full"
                                style={{
                                    background: 'rgba(56,189,248,0.18)',
                                    color: PEAK,
                                }}
                            >
                                New customer offer
                            </div>
                            <h2
                                className="text-3xl sm:text-5xl font-extrabold leading-tight max-w-3xl"
                                style={headingFont}
                            >
                                25% off for new customers.
                            </h2>
                            <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                                If this is your first job with Peakline you get 25% off any
                                service or package.
                            </p>
                            <button
                                type="button"
                                onClick={scrollToContact}
                                data-testid="peakline-offer-cta"
                                className="mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-md text-sm font-semibold"
                                style={{ background: PEAK, color: NAVY }}
                            >
                                Claim your 25% off
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================  HOW IT WORKS  ========================== */}
            <section className="py-16 sm:py-20 bg-slate-50/60 border-t border-slate-100">
                <div className="max-w-6xl mx-auto px-5 sm:px-8">
                    <SectionHeading
                        label="How it works"
                        title="Three simple steps."
                    />

                    <div
                        className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5"
                        data-testid="peakline-steps"
                    >
                        <Step
                            n="1"
                            title="Send a few photos and your postcode"
                            text="A couple of pictures of the roof, gutters or driveway is enough."
                        />
                        <Step
                            n="2"
                            title="Get one fixed price"
                            text="One clear quote covering the full job. No surprises on the day."
                        />
                        <Step
                            n="3"
                            title="Pick a date"
                            text="Choose a day that suits you — we'll confirm and turn up ready."
                        />
                    </div>
                </div>
            </section>

            {/* ============================  PACKAGES  ========================== */}
            <section className="py-16 sm:py-20">
                <div className="max-w-6xl mx-auto px-5 sm:px-8">
                    <SectionHeading
                        label="Packages"
                        title="Bundle the whole house."
                        description="Each package is quoted for the property."
                    />

                    <div
                        className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5"
                        data-testid="peakline-packages"
                    >
                        <Package
                            title="Complete Exterior Clean"
                            points={[
                                'Roof moss removal and treatment',
                                'Gutter clearing',
                                'Driveway and patio pressure washing',
                                'Fascia and soffit cleaning',
                            ]}
                        />
                        <Package
                            title="Property Sale Preparation"
                            points={[
                                'Full exterior refresh before photos and viewings',
                                'Roof, gutters, driveway and trim covered',
                                'Scheduled to fit your estate agent timeline',
                            ]}
                            highlighted
                        />
                        <Package
                            title="Seasonal Property Maintenance"
                            points={[
                                'Scheduled visits through the year',
                                'Keeps gutters clear and the exterior looked after',
                                'One point of contact across every visit',
                            ]}
                        />
                    </div>
                </div>
            </section>

            {/* =========================  WHERE WE WORK  ========================= */}
            <section className="py-16 sm:py-20 bg-slate-50/60 border-t border-slate-100">
                <div className="max-w-6xl mx-auto px-5 sm:px-8">
                    <SectionHeading
                        label="Where we work"
                        title="Covering Mansfield and nearby areas."
                    />
                    <div
                        className="mt-8 flex flex-wrap gap-2.5"
                        data-testid="peakline-areas"
                    >
                        {[
                            'Mansfield',
                            'Mansfield Woodhouse',
                            'Shirebrook',
                            'New Houghton',
                            'Sutton-in-Ashfield',
                            'Kirkby-in-Ashfield',
                            'Chesterfield',
                            'Nearby villages',
                        ].map((area) => (
                            <span
                                key={area}
                                className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-slate-200"
                                style={{ color: NAVY }}
                            >
                                {area}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================  CONTACT  =========================== */}
            <section
                ref={contactRef}
                id="contact"
                className="py-16 sm:py-24 scroll-mt-20"
                data-testid="peakline-contact"
            >
                <div className="max-w-6xl mx-auto px-5 sm:px-8">
                    <SectionHeading
                        label="Contact"
                        title="Get in touch."
                        description="Call, text or message — whatever's easiest."
                    />

                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-3xl">
                        <ContactLink
                            href={`tel:${PHONE_TEL}`}
                            icon={<Phone size={18} />}
                            label="Call"
                            value={PHONE_DISPLAY}
                            testid="peakline-contact-call"
                        />
                        <ContactLink
                            href={`sms:${PHONE_TEL}`}
                            icon={<MessageSquare size={18} />}
                            label="Text"
                            value={PHONE_DISPLAY}
                            testid="peakline-contact-sms"
                        />
                        <ContactLink
                            href={`mailto:${EMAIL}`}
                            icon={<Mail size={18} />}
                            label="Email"
                            value={EMAIL}
                            testid="peakline-contact-email"
                        />
                        <ContactLink
                            href={MESSENGER}
                            icon={<MessageCircle size={18} />}
                            label="Messenger"
                            value="Open chat"
                            external
                            testid="peakline-contact-messenger"
                        />
                    </div>
                </div>
            </section>

            {/* ============================  FOOTER  ============================ */}
            <footer
                className="border-t border-slate-200 py-10 bg-white"
                data-testid="peakline-footer"
            >
                <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-3">
                        <span
                            aria-hidden
                            className="w-7 h-7 rounded-md flex items-center justify-center"
                            style={{ background: NAVY }}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className="w-4 h-4"
                                fill="none"
                                stroke={PEAK}
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M3 20 L10 8 L14 14 L18 6 L21 20 Z" />
                            </svg>
                        </span>
                        <span
                            className="font-semibold"
                            style={{ ...headingFont, color: NAVY }}
                        >
                            Peakline Exterior Cleaning
                        </span>
                    </div>
                    <div>© {new Date().getFullYear()} Peakline Exterior Cleaning · Mansfield</div>
                </div>
            </footer>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Local presentational helpers                                              */
/* -------------------------------------------------------------------------- */

function SectionHeading({ label, title, description }) {
    return (
        <div className="max-w-3xl">
            <div
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: PEAK }}
            >
                {label}
            </div>
            <h2
                className="text-3xl sm:text-4xl font-extrabold leading-tight"
                style={{ fontFamily: `'Montserrat', system-ui, sans-serif`, color: NAVY }}
            >
                {title}
            </h2>
            {description && (
                <p className="mt-3 text-base text-slate-600">{description}</p>
            )}
        </div>
    );
}

function ServiceCard({ icon, title, text }) {
    return (
        <div className="group p-6 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors">
            <div
                className="w-11 h-11 rounded-lg flex items-center justify-center mb-5"
                style={{ background: 'rgba(56,189,248,0.15)', color: NAVY }}
            >
                {icon}
            </div>
            <div
                className="font-semibold text-base mb-1.5"
                style={{ fontFamily: `'Montserrat', system-ui, sans-serif`, color: NAVY }}
            >
                {title}
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
        </div>
    );
}

function Step({ n, title, text }) {
    return (
        <div className="p-6 rounded-xl bg-white border border-slate-200">
            <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base mb-5"
                style={{ background: NAVY }}
            >
                {n}
            </div>
            <div
                className="font-semibold text-base mb-1.5"
                style={{ fontFamily: `'Montserrat', system-ui, sans-serif`, color: NAVY }}
            >
                {title}
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
        </div>
    );
}

function Package({ title, points, highlighted }) {
    return (
        <div
            className={`p-6 rounded-xl border transition-colors ${
                highlighted
                    ? 'border-transparent text-white shadow-lg'
                    : 'bg-white border-slate-200'
            }`}
            style={highlighted ? { background: NAVY } : {}}
        >
            <div
                className={`font-semibold text-lg mb-4 ${highlighted ? 'text-white' : ''}`}
                style={{
                    fontFamily: `'Montserrat', system-ui, sans-serif`,
                    color: highlighted ? '#ffffff' : NAVY,
                }}
            >
                {title}
            </div>
            <ul className="space-y-2.5">
                {points.map((p) => (
                    <li
                        key={p}
                        className={`flex items-start gap-2.5 text-sm leading-relaxed ${
                            highlighted ? 'text-slate-200' : 'text-slate-600'
                        }`}
                    >
                        <Check
                            size={16}
                            strokeWidth={2.4}
                            className="shrink-0 mt-0.5"
                            style={{ color: highlighted ? PEAK : NAVY }}
                        />
                        <span>{p}</span>
                    </li>
                ))}
            </ul>
            <div
                className={`mt-5 pt-5 border-t text-xs font-semibold uppercase tracking-widest ${
                    highlighted ? 'text-sky-300 border-white/15' : 'border-slate-200'
                }`}
                style={{ color: highlighted ? PEAK : '#475569' }}
            >
                Quoted for the property
            </div>
        </div>
    );
}

function ContactLink({ href, icon, label, value, external, testid }) {
    return (
        <a
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            data-testid={testid}
            className="group flex items-center gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors"
        >
            <span
                className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: NAVY, color: PEAK }}
            >
                {icon}
            </span>
            <span className="flex-1 min-w-0">
                <span
                    className="block text-xs font-semibold uppercase tracking-widest mb-0.5"
                    style={{ color: PEAK }}
                >
                    {label}
                </span>
                <span
                    className="block font-semibold truncate"
                    style={{ fontFamily: `'Montserrat', system-ui, sans-serif`, color: NAVY }}
                >
                    {value}
                </span>
            </span>
            <ArrowRight
                size={16}
                className="shrink-0 text-slate-400 group-hover:text-slate-600 transition-colors"
            />
        </a>
    );
}
