import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SERVICES } from '@/lib/constants';

export default function ServicesShowcase() {
    return (
        <section
            id="services"
            data-testid="services-showcase"
            className="relative py-24 sm:py-32 bg-bg-1 border-b border-line"
        >
            <div className="container-x">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div>
                        <div className="overline brand mb-4">
                            <span className="inline-block w-6 h-px bg-brand mr-3 align-middle" />
                            Capabilities
                        </div>
                        <h2 className="h-display text-[clamp(2rem,5.5vw,4.5rem)] text-ink max-w-[18ch]">
                            One point of contact.<br />
                            <span className="text-outline">Every process covered.</span>
                        </h2>
                        <p className="mt-6 max-w-xl text-ink-2 text-base leading-relaxed">
                            Cutting, profiling, folding, fabrication and finishing —
                            sourced and managed through our UK supplier network.
                        </p>
                    </div>
                    <Link
                        to="/services"
                        data-testid="services-showcase-cta"
                        className="btn-fill inline-flex items-center gap-2 px-6 py-3 border border-line-strong text-ink text-sm font-semibold uppercase tracking-wider hover:text-white shrink-0"
                    >
                        See all services
                        <ArrowUpRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {SERVICES.map((s, i) => (
                        <motion.div
                            key={s.slug}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{
                                duration: 0.7,
                                delay: i * 0.06,
                                ease: [0.7, 0, 0.2, 1],
                            }}
                            className={i === 0 ? 'md:col-span-2 lg:col-span-2' : ''}
                        >
                            <Link
                                to={`/services/${s.slug}`}
                                data-testid={`service-card-${s.slug}`}
                                className="group block h-full border border-line bg-bg-0 hover:border-brand transition-colors duration-300"
                            >
                                <div className="relative overflow-hidden aspect-[4/5]">
                                    <img
                                        src={s.image}
                                        alt={s.imageAlt || s.title}
                                        loading="lazy"
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[900ms] ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-bg-0 via-bg-0/40 to-transparent" />
                                    <div className="absolute top-4 left-4 flex items-center gap-2 overline brand">
                                        /{s.n}
                                    </div>
                                    <div className="absolute top-4 right-4 w-9 h-9 border border-line-strong text-ink flex items-center justify-center group-hover:bg-brand group-hover:border-brand transition-colors">
                                        <ArrowUpRight size={16} strokeWidth={2.2} />
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="h-display text-2xl lg:text-3xl text-ink leading-none">
                                            {s.title}
                                        </h3>
                                        <div className="mt-1 text-xs uppercase tracking-widest text-ink-2">
                                            {s.strap}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5 border-t border-line">
                                    <p className="text-sm text-ink-2 leading-relaxed line-clamp-4">
                                        {s.blurb}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
