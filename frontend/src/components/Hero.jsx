import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowUpRight, ArrowDown, Upload } from 'lucide-react';
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
            className="relative overflow-hidden pt-[68px] min-h-[100svh] flex flex-col"
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
                    <span>UK Supplier Network · Cutting · Fabrication · Finishing</span>
                </motion.div>

                <RevealLines
                    as="h1"
                    lines={[
                        'Steel, Laser Cutting',
                        <span key="l2">
                            &amp; Fabrication{' '}
                            <span className="text-brand italic font-normal">Without</span>
                        </span>,
                        <span key="l3">
                            the <span className="text-outline">Usual Hassle</span>.
                        </span>,
                    ]}
                    className="h-display text-[clamp(2.4rem,9vw,7.5rem)] font-semibold text-ink max-w-[16ch]"
                    lineClassName=""
                    ariaLabel="Steel, Laser Cutting & Fabrication Without the Usual Hassle."
                />

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.7 }}
                        className="lg:col-span-6 text-ink-2 text-lg sm:text-xl leading-relaxed max-w-[52ch]"
                    >
                        Bernat Solutions helps UK businesses source and manage laser cutting,
                        steel profiling, folding, fabrication and finishing work through a
                        trusted supplier network. Send your drawings, tell us what you need,
                        and we&apos;ll help get the job quoted and moving.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.05, duration: 0.7 }}
                        className="lg:col-span-6 lg:justify-self-end flex flex-wrap gap-4"
                    >
                        <Link
                            to="/quote"
                            data-testid="hero-cta-quote"
                            className="btn-fill inline-flex items-center gap-3 px-7 py-4 bg-brand text-white text-sm font-semibold uppercase tracking-widest hover:text-white"
                        >
                            Request a Quote
                            <ArrowUpRight size={18} strokeWidth={2.4} />
                        </Link>
                        <Link
                            to="/quote"
                            data-testid="hero-cta-drawings"
                            className="inline-flex items-center gap-3 px-7 py-4 border border-line-strong text-ink text-sm font-semibold uppercase tracking-widest hover:border-brand hover:text-brand transition-colors"
                        >
                            <Upload size={16} />
                            Send Your Drawings
                        </Link>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3, duration: 0.8 }}
                    className="mt-16 flex items-center justify-between border-t border-line pt-6 text-xs uppercase tracking-widest text-ink-3"
                >
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-none bg-brand animate-blink" />
                        <span>Currently quoting UK-wide · Nottinghamshire based</span>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-ink-2">
                        Scroll <ArrowDown size={14} />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
