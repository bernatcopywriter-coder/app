import { motion } from 'framer-motion';
import { BENEFITS } from '@/lib/constants';

export default function BenefitsGrid() {
    return (
        <section
            data-testid="benefits-section"
            id="benefits"
            className="relative py-24 sm:py-32 bg-bg-0 border-b border-line"
        >
            <div className="container-x">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-end">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}
                        className="lg:col-span-7"
                    >
                        <div className="overline brand mb-5">
                            <span className="inline-block w-6 h-px bg-brand mr-3 align-middle" />
                            Why Bernat
                        </div>
                        <h2 className="h-display text-[clamp(2rem,5.5vw,4.5rem)] text-ink max-w-[16ch]">
                            Built for buyers who need answers, not chase-ups.
                        </h2>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="lg:col-span-5 text-ink-2 text-lg leading-relaxed"
                    >
                        Every enquiry is handled by someone who has stood on the shopfloor
                        and read the drawing themselves. That&apos;s the difference. Six
                        commitments we make to every job.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-line">
                    {BENEFITS.map((b, i) => (
                        <motion.div
                            key={b.n}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{
                                duration: 0.6,
                                delay: (i % 3) * 0.08,
                                ease: [0.7, 0, 0.2, 1],
                            }}
                            className="spotlight group relative p-8 md:p-10 border-r border-b border-line bg-bg-0 hover:bg-bg-1 transition-colors duration-500"
                            data-testid={`benefit-${b.n}`}
                            onMouseMove={(e) => {
                                const r = e.currentTarget.getBoundingClientRect();
                                e.currentTarget.style.setProperty(
                                    '--mx', `${e.clientX - r.left}px`
                                );
                                e.currentTarget.style.setProperty(
                                    '--my', `${e.clientY - r.top}px`
                                );
                            }}
                        >
                            <div className="flex items-baseline justify-between mb-10">
                                <span className="font-display text-2xl text-brand">
                                    /{b.n}
                                </span>
                                <span className="w-2 h-2 rotate-45 bg-line-strong group-hover:bg-brand transition-colors" />
                            </div>
                            <h3 className="h-display text-3xl md:text-4xl mb-4 text-ink">
                                {b.title}
                            </h3>
                            <p className="text-ink-2 leading-relaxed">{b.text}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
