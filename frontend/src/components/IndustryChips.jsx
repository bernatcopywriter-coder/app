import { motion } from 'framer-motion';
import { INDUSTRIES, AREAS } from '@/lib/constants';

export default function IndustryChips() {
    return (
        <section
            data-testid="industries-strip"
            className="relative py-24 sm:py-32 bg-bg-1 border-b border-line overflow-hidden"
        >
            <div
                className="absolute inset-0 opacity-15 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://images.pexels.com/photos/36095234/pexels-photo-36095234.jpeg')",
                }}
                aria-hidden
            />
            <div className="absolute inset-0 bg-bg-1/85" aria-hidden />

            <div className="container-x relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14 items-end">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.7 }}
                        className="lg:col-span-7"
                    >
                        <div className="overline brand mb-5">
                            <span className="inline-block w-6 h-px bg-brand mr-3 align-middle" />
                            Who We Support
                        </div>
                        <h2 className="h-display text-[clamp(2rem,5.5vw,4.5rem)] text-ink">
                            Trusted by teams who build, fix and ship.
                        </h2>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="lg:col-span-5 text-ink-2 text-lg leading-relaxed"
                    >
                        From one-off maintenance parts to repeat production batches — Bernat
                        Solutions supports engineering, construction, manufacturing and
                        specialist trades across the UK.
                    </motion.p>
                </div>

                <div className="flex flex-wrap gap-3">
                    {INDUSTRIES.map((ind, i) => (
                        <motion.span
                            key={ind}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.03 }}
                            data-testid={`industry-chip-${i}`}
                            className="group inline-flex items-center px-4 py-2 border border-line-strong text-sm text-ink hover:bg-brand hover:border-brand hover:text-white transition-colors cursor-default"
                        >
                            <span className="w-1.5 h-1.5 rotate-45 bg-brand mr-3 group-hover:bg-white transition-colors" />
                            {ind}
                        </motion.span>
                    ))}
                </div>

                <div className="mt-16 pt-8 border-t border-line">
                    <div className="overline mb-4">Local Service Areas</div>
                    <div className="flex flex-wrap gap-x-6 gap-y-3 text-ink-2 text-sm uppercase tracking-widest">
                        {AREAS.map((a) => (
                            <span key={a} className="hover:text-brand transition-colors">
                                {a}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
