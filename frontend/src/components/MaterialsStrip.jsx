import { motion } from 'framer-motion';
import { MATERIALS } from '@/lib/constants';

/** Materials strip — reinforces breadth of sourcing options. */
export default function MaterialsStrip() {
    return (
        <section
            data-testid="materials-strip"
            className="relative py-20 sm:py-24 bg-bg-1 border-b border-line overflow-hidden"
        >
            <div
                className="absolute inset-0 opacity-10 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://images.pexels.com/photos/2760243/pexels-photo-2760243.jpeg')",
                }}
                aria-hidden
            />
            <div className="absolute inset-0 bg-bg-1/80" aria-hidden />

            <div className="container-x relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-6"
                    >
                        <div className="overline brand mb-4">
                            <span className="inline-block w-6 h-px bg-brand mr-3 align-middle" />
                            Materials
                        </div>
                        <h2 className="h-display text-3xl md:text-4xl text-ink max-w-[24ch]">
                            Materials our supplier network can source and process.
                        </h2>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="lg:col-span-6 text-ink-2 leading-relaxed"
                    >
                        From standard mild steel and stainless to specialist alloys and
                        heavy plate — send us the requirement and we&apos;ll source the
                        right grade for the job.
                    </motion.p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                    {MATERIALS.map((m, i) => (
                        <motion.span
                            key={m}
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.02 }}
                            data-testid={`material-chip-${i}`}
                            className="inline-flex items-center px-4 py-2 border border-line-strong text-sm text-ink hover:bg-brand hover:border-brand hover:text-white transition-colors cursor-default"
                        >
                            <span className="w-1.5 h-1.5 rotate-45 bg-brand mr-3" />
                            {m}
                        </motion.span>
                    ))}
                    <span className="inline-flex items-center px-4 py-2 text-sm text-ink-3 italic">
                        + specialist materials on request
                    </span>
                </div>
            </div>
        </section>
    );
}
