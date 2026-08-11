import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import RevealLines from '@/components/RevealText';

export default function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    });
    const y = useTransform(scrollYProgress, [0, 1], [0, 220]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
    const overlayOp = useTransform(scrollYProgress, [0, 1], [0.55, 0.85]);

    return (
        <section
            ref={ref}
            data-testid="hero-section"
            className="relative overflow-hidden pt-[104px] min-h-[100svh] flex flex-col"
        >
            {/* Parallax background */}
            <motion.div
                aria-hidden
                style={{ y, scale }}
                className="absolute inset-0 z-0"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.pexels.com/photos/177872/pexels-photo-177872.jpeg')",
                    }}
                />
                <motion.div
                    style={{ opacity: overlayOp }}
                    className="absolute inset-0"
                    aria-hidden
                >
                    <div className="absolute inset-0 bg-bg-0/70" />
                    <div className="absolute inset-0 bg-gradient-to-b from-bg-0/60 via-bg-0/40 to-bg-0" />
                </motion.div>
            </motion.div>

            <div className="absolute inset-0 grid-lines z-[1] opacity-70" aria-hidden />

            {/* Content */}
            <div className="container-x relative z-10 flex-1 flex flex-col justify-end pb-16 sm:pb-24 pt-28">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05, duration: 0.6 }}
                    className="flex items-center gap-3 overline brand mb-8"
                >
                    <span className="inline-block w-8 h-px bg-brand" />
                    <span>Laser Cutting · Folding · Fabrication · Welding</span>
                </motion.div>

                <RevealLines
                    as="h1"
                    lines={[
                        <span key="l1">Metalwork&nbsp;</span>,
                        <span key="l2">Made <span className="text-brand italic font-normal">Simple.</span></span>,
                    ]}
                    className="h-display text-[clamp(2.4rem,9vw,7.5rem)] font-semibold text-ink max-w-[14ch]"
                    lineClassName=""
                    ariaLabel="Metalwork Made Simple."
                />

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.7 }}
                        className="lg:col-span-6 text-ink-2 text-lg sm:text-xl leading-relaxed max-w-[52ch]"
                    >
                        Reliable UK metalwork supply with one point of contact from quotation
                        through to delivery. Kingsford Metals handles laser cutting, folding,
                        fabrication, welding and finishing — so you deal with one supplier,
                        not five.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.05, duration: 0.7 }}
                        className="lg:col-span-6 lg:justify-self-end flex flex-col sm:flex-row flex-wrap gap-4"
                    >
                        <Link
                            to="/quote"
                            data-testid="hero-cta-quote"
                            className="btn-fill inline-flex items-center justify-center gap-3 px-7 py-4 bg-brand text-white text-sm font-semibold uppercase tracking-widest hover:text-white"
                        >
                            Request a Quote
                            <ArrowUpRight size={18} strokeWidth={2.4} />
                        </Link>
                        <Link
                            to="/services"
                            data-testid="hero-cta-capabilities"
                            className="inline-flex items-center justify-center gap-3 px-7 py-4 border border-line-strong text-ink text-sm font-semibold uppercase tracking-widest hover:border-brand hover:text-brand transition-colors"
                        >
                            View Capabilities
                            <ArrowUpRight size={16} />
                        </Link>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3, duration: 0.8 }}
                    className="mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:justify-between border-t border-line pt-6 text-[11px] sm:text-xs uppercase tracking-widest text-ink-3"
                >
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-none bg-brand animate-blink" />
                        <span>Quoting UK-wide · Nottinghamshire based</span>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-ink-2">
                        Scroll <ArrowDown size={14} />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
