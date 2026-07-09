import { motion } from 'framer-motion';
import { Zap, ShieldCheck, MessageSquare } from 'lucide-react';

const BLOCKS = [
    {
        icon: Zap,
        title: 'Built for Busy Buyers',
        text: 'For companies that need reliable pricing, fast communication, and fewer headaches when sourcing metalwork. We keep the loop short.',
    },
    {
        icon: ShieldCheck,
        title: 'A Better Backup Supplier',
        text: 'When your current supplier is overloaded, slow to respond, or you just need another price to compare — send it over. No commitment, no fuss.',
    },
    {
        icon: MessageSquare,
        title: 'Clear Communication, Start to Finish',
        text: 'You always know what stage the job is at and what info we need next. No chase-ups, no radio silence, no surprises.',
    },
];

export default function TrustBlocks() {
    return (
        <section
            data-testid="trust-blocks"
            className="relative py-24 sm:py-32 bg-bg-0 border-b border-line"
        >
            <div className="container-x">
                <div className="overline brand mb-5">
                    <span className="inline-block w-6 h-px bg-brand mr-3 align-middle" />
                    Trust
                </div>
                <h2 className="h-display text-[clamp(2rem,5.5vw,4.5rem)] text-ink max-w-[20ch] mb-16">
                    A better way to source metalwork.
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-line">
                    {BLOCKS.map((b, i) => {
                        const Icon = b.icon;
                        return (
                            <motion.div
                                key={b.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ duration: 0.7, delay: i * 0.1 }}
                                className="border-r border-b border-line p-8 md:p-10 bg-bg-0"
                            >
                                <div className="w-12 h-12 mb-8 flex items-center justify-center border border-line-strong text-brand">
                                    <Icon size={20} strokeWidth={1.8} />
                                </div>
                                <h3 className="h-display text-3xl text-ink mb-4">
                                    {b.title}
                                </h3>
                                <p className="text-ink-2 leading-relaxed">{b.text}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
