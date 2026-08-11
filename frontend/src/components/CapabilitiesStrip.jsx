import { motion } from 'framer-motion';
import { CAPABILITIES } from '@/lib/constants';

/** Comprehensive capability list — homepage strip. */
export default function CapabilitiesStrip() {
    return (
        <section
            data-testid="capabilities-strip"
            className="relative py-24 sm:py-32 bg-bg-0 border-b border-line overflow-hidden"
        >
            <div className="container-x">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16 items-end">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.7 }}
                        className="lg:col-span-7"
                    >
                        <div className="overline brand mb-5">
                            <span className="inline-block w-6 h-px bg-brand mr-3 align-middle" />
                            Full Metalwork Capability
                        </div>
                        <h2 className="h-display text-[clamp(2rem,5.5vw,4.5rem)] text-ink max-w-[22ch]">
                            Cutting, folding, fabrication and finishing — all handled under one supplier.
                        </h2>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="lg:col-span-5 text-ink-2 text-lg leading-relaxed"
                    >
                        Whether you need simple mild steel laser-cut brackets, folded
                        stainless components, aluminium panels, heavy plate profiles or
                        welded steelwork, Kingsford Metals covers the full job.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-line">
                    {CAPABILITIES.map((group, i) => (
                        <motion.div
                            key={group.g}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.6, delay: (i % 4) * 0.06 }}
                            className="border-r border-b border-line p-8 md:p-10 bg-bg-0 group hover:bg-bg-1 transition-colors"
                            data-testid={`capability-group-${i}`}
                        >
                            <div className="flex items-baseline justify-between mb-8">
                                <span className="font-display text-brand text-xl">
                                    /{String(i + 1).padStart(2, '0')}
                                </span>
                                <span className="w-2 h-2 rotate-45 bg-line-strong group-hover:bg-brand transition-colors" />
                            </div>
                            <h3 className="h-display text-2xl md:text-3xl text-ink mb-5 leading-tight">
                                {group.g}
                            </h3>
                            <ul className="space-y-2.5">
                                {group.items.map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-start gap-3 text-ink-2 text-sm"
                                    >
                                        <span className="w-1 h-1 rotate-45 bg-brand mt-2 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
