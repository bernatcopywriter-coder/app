import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Upload } from 'lucide-react';

export default function CTASection() {
    return (
        <section
            data-testid="cta-section"
            className="relative py-24 sm:py-32 lg:py-40 overflow-hidden bg-bg-0 border-b border-line"
        >
            <div
                className="absolute inset-0 opacity-25 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://images.pexels.com/photos/12475054/pexels-photo-12475054.jpeg')",
                }}
                aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-b from-bg-0 via-bg-0/70 to-bg-0" aria-hidden />

            <div className="container-x relative">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.9 }}
                    className="max-w-5xl"
                >
                    <div className="overline brand mb-6">
                        <span className="inline-block w-6 h-px bg-brand mr-3 align-middle" />
                        Ready when you are
                    </div>
                    <h2 className="h-display text-[clamp(2.4rem,8vw,7rem)] text-ink leading-[0.92]">
                        Send the drawing.<br />
                        <span className="text-outline-brand">We&apos;ll do the rest.</span>
                    </h2>
                    <p className="mt-8 text-ink-2 text-lg md:text-xl max-w-2xl leading-relaxed">
                        PDF, DXF, DWG, STEP, STL or a phone photo of a sketch — send it
                        across and we&apos;ll come back with a competitive quotation covering
                        the full job.
                    </p>

                    <div className="mt-12 flex flex-wrap gap-4">
                        <Link
                            to="/quote"
                            data-testid="footer-cta-request"
                            className="btn-fill inline-flex items-center gap-3 px-8 py-4 bg-brand text-white text-sm font-semibold uppercase tracking-widest hover:text-white"
                        >
                            Request a Quote
                            <ArrowUpRight size={18} strokeWidth={2.4} />
                        </Link>
                        <Link
                            to="/quote"
                            data-testid="footer-cta-drawings"
                            className="inline-flex items-center gap-3 px-8 py-4 border border-line-strong text-ink text-sm font-semibold uppercase tracking-widest hover:border-brand hover:text-brand transition-colors"
                        >
                            <Upload size={16} />
                            Send Your Drawings
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
