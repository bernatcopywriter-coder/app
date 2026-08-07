import { motion } from 'framer-motion';
import RevealLines from '@/components/RevealText';

/** Reusable inner page hero — smaller than home hero but keeps the mood. */
export default function PageHero({
    overline,
    title,
    subtitle,
    image,
    align = 'left',
}) {
    return (
        <section
            data-testid="page-hero"
            className="relative pt-[156px] pb-16 md:pt-[196px] md:pb-24 border-b border-line overflow-hidden"
        >
            {image && (
                <div className="absolute inset-0" aria-hidden>
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-30"
                        style={{ backgroundImage: `url('${image}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-bg-0/80 via-bg-0/70 to-bg-0" />
                </div>
            )}
            <div className="absolute inset-0 grid-lines opacity-60" aria-hidden />

            <div className={`container-x relative ${align === 'center' ? 'text-center' : ''}`}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="overline brand mb-6"
                >
                    <span className="inline-block w-6 h-px bg-brand mr-3 align-middle" />
                    {overline}
                </motion.div>

                <RevealLines
                    as="h1"
                    lines={Array.isArray(title) ? title : [title]}
                    className="h-display text-[clamp(2.2rem,7vw,6rem)] text-ink max-w-[20ch]"
                />

                {subtitle && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.7 }}
                        className="mt-8 max-w-2xl text-ink-2 text-lg leading-relaxed"
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>
        </section>
    );
}
