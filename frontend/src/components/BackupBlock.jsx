import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

/** "Need a backup supplier?" — high-contrast reassurance block. */
export default function BackupBlock() {
    return (
        <section
            data-testid="backup-block"
            className="relative bg-bg-0 border-b border-line"
        >
            <div className="container-x py-24 sm:py-32 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.7 }}
                    className="lg:col-span-5"
                >
                    <div className="overline brand mb-5">
                        <span className="inline-block w-6 h-px bg-brand mr-3 align-middle" />
                        One Point of Contact
                    </div>
                    <h2 className="h-display text-[clamp(2rem,6vw,5rem)] text-ink leading-[0.95]">
                        Stop chasing<br />
                        <span className="text-brand italic font-normal">suppliers.</span>
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="lg:col-span-6 lg:col-start-7"
                >
                    <p className="text-lg md:text-xl text-ink-2 leading-relaxed">
                        Instead of chasing separate suppliers for cutting, folding, welding,
                        finishing and delivery, Bernat Solutions gives you one clear point of
                        contact. We review the job, understand the drawings, source the right
                        process, request pricing and keep the enquiry moving from quote to
                        delivery.
                    </p>

                    <div className="mt-10 flex flex-wrap items-center gap-6">
                        <Link
                            to="/quote"
                            data-testid="backup-cta"
                            className="btn-fill inline-flex items-center gap-2 px-6 py-3 border border-line-strong text-ink text-sm font-semibold uppercase tracking-wider hover:text-white"
                        >
                            Send Us the Job
                            <ArrowUpRight size={16} />
                        </Link>
                        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-ink-3">
                            <span className="w-2 h-2 rotate-45 bg-brand" />
                            Useful as a backup or main supplier
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
