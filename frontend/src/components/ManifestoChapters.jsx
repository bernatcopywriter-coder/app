import { motion } from 'framer-motion';
import { PROCESS_STEPS } from '@/lib/constants';

/** Numbered manifesto chapters — sticky-stacked reveal of the 4-step process. */
export default function ManifestoChapters() {
    return (
        <section
            id="process"
            data-testid="manifesto-section"
            className="relative bg-bg-0 border-b border-line"
        >
            <div className="container-x pt-24 sm:pt-32 pb-16">
                <div className="overline brand mb-5">
                    <span className="inline-block w-6 h-px bg-brand mr-3 align-middle" />
                    A Simple Process
                </div>
                <h2 className="h-display text-[clamp(2rem,5.5vw,4.5rem)] text-ink max-w-[22ch]">
                    Four steps between your drawing and finished parts.
                </h2>
                <p className="mt-6 max-w-2xl text-ink-2 text-lg leading-relaxed">
                    We act as one point of contact for quoting, communication and job
                    management — from the moment a drawing lands with us to the day the
                    parts arrive.
                </p>
            </div>

            <div className="container-x pb-24">
                {PROCESS_STEPS.map((step, i) => (
                    <motion.div
                        key={step.n}
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1] }}
                        className="relative border-t border-line py-10 md:py-14 grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
                        data-testid={`process-step-${step.n}`}
                    >
                        <div className="md:col-span-3 flex md:block items-center gap-6">
                            <span className="font-display leading-none text-brand text-[clamp(3rem,10vw,7rem)] font-semibold">
                                /{step.n}
                            </span>
                        </div>
                        <div className="md:col-span-6">
                            <h3 className="h-display text-4xl md:text-5xl text-ink mb-4">
                                {step.title}
                            </h3>
                            <p className="text-ink-2 leading-relaxed text-lg max-w-[52ch]">
                                {step.text}
                            </p>
                        </div>
                        <div className="md:col-span-3 md:text-right">
                            <span className="font-mono text-xs text-ink-3 uppercase tracking-widest">
                                Chapter · {step.n} / 04
                            </span>
                        </div>
                    </motion.div>
                ))}
                <div className="border-t border-line" />
            </div>
        </section>
    );
}
