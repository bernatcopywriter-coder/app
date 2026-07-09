import { motion } from 'framer-motion';

/**
 * Masked line-by-line reveal.
 * `lines` should be an array of strings.
 * `delay` shifts the start; `stagger` between each line.
 */
export default function RevealLines({
    lines = [],
    className = '',
    as: Tag = 'h1',
    delay = 0.15,
    stagger = 0.08,
    lineClassName = '',
}) {
    return (
        <Tag className={className}>
            {lines.map((line, i) => (
                <span key={i} className="reveal-mask">
                    <motion.span
                        style={{ display: 'block', willChange: 'transform' }}
                        initial={{ y: '110%' }}
                        animate={{ y: '0%' }}
                        transition={{
                            delay: delay + i * stagger,
                            duration: 0.9,
                            ease: [0.7, 0, 0.2, 1],
                        }}
                        className={lineClassName}
                    >
                        {line}
                    </motion.span>
                </span>
            ))}
        </Tag>
    );
}

/** Simple word-level reveal for smaller text. */
export function RevealWords({ text = '', className = '', delay = 0.2 }) {
    const words = text.split(' ');
    return (
        <span className={className} aria-label={text}>
            {words.map((w, i) => (
                <span
                    key={i}
                    className="reveal-mask"
                    style={{ display: 'inline-block', marginRight: '0.28em' }}
                >
                    <motion.span
                        style={{ display: 'inline-block' }}
                        initial={{ y: '110%', opacity: 0 }}
                        animate={{ y: '0%', opacity: 1 }}
                        transition={{
                            delay: delay + i * 0.035,
                            duration: 0.7,
                            ease: [0.7, 0, 0.2, 1],
                        }}
                    >
                        {w}
                    </motion.span>
                </span>
            ))}
        </span>
    );
}
