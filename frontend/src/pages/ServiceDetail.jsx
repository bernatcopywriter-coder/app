import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import PageHero from '@/components/PageHero';
import CTASection from '@/components/CTASection';
import { SERVICES } from '@/lib/constants';

export default function ServiceDetail() {
    const { slug } = useParams();
    const service = SERVICES.find((s) => s.slug === slug);
    if (!service) return <Navigate to="/services" replace />;

    const others = SERVICES.filter((s) => s.slug !== slug);

    return (
        <div data-testid={`service-detail-${slug}`}>
            <PageHero
                overline={`Capability /${service.n}`}
                title={[service.title]}
                subtitle={service.blurb}
                image={service.image}
            />

            <section className="py-24 sm:py-32 border-b border-line bg-bg-0">
                <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-7">
                        <div className="overline brand mb-5">Capabilities</div>
                        <h2 className="h-display text-4xl md:text-5xl text-ink mb-10">
                            What we cover
                        </h2>
                        <ul className="space-y-4">
                            {service.details.map((d) => (
                                <motion.li
                                    key={d}
                                    initial={{ opacity: 0, x: -12 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4 }}
                                    className="flex items-start gap-3 text-lg text-ink"
                                >
                                    <CheckCircle2 size={20} className="text-brand mt-1 shrink-0" />
                                    <span>{d}</span>
                                </motion.li>
                            ))}
                        </ul>

                        <div className="mt-12 border-t border-line pt-8">
                            <Link
                                to="/quote"
                                data-testid="service-detail-cta"
                                className="btn-fill inline-flex items-center gap-3 px-7 py-4 bg-brand text-white text-sm font-semibold uppercase tracking-widest hover:text-white"
                            >
                                Quote for {service.title}
                                <ArrowUpRight size={16} />
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="relative overflow-hidden border border-line-strong aspect-[3/4]">
                            <img
                                src={service.image}
                                alt={service.imageAlt || service.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-bg-0 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="overline brand mb-2">/{service.n}</div>
                                <div className="h-display text-3xl text-ink">
                                    {service.title}
                                </div>
                                <div className="text-sm text-ink-2 uppercase tracking-widest mt-1">
                                    {service.strap}
                                </div>
                            </div>
                        </div>

                        {service.secondaryImage && (
                            <div className="mt-6 relative overflow-hidden border border-line-strong aspect-[4/3]">
                                <img
                                    src={service.secondaryImage}
                                    alt={service.secondaryImageAlt || service.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-bg-0/80 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="overline brand mb-1">Fabrication</div>
                                    <div className="h-display text-xl text-ink">
                                        Welded &amp; assembled steelwork
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="py-24 border-b border-line bg-bg-1">
                <div className="container-x">
                    <div className="overline brand mb-5">Explore</div>
                    <h3 className="h-display text-3xl md:text-4xl text-ink mb-10">
                        Other capabilities
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {others.map((s) => (
                            <Link
                                key={s.slug}
                                to={`/services/${s.slug}`}
                                data-testid={`related-service-${s.slug}`}
                                className="group block border border-line hover:border-brand transition-colors bg-bg-0"
                            >
                                <div className="relative aspect-[4/5] overflow-hidden">
                                    <img
                                        src={s.image}
                                        alt={s.imageAlt || s.title}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-bg-0/95 via-bg-0/30 to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="overline brand mb-1">/{s.n}</div>
                                        <div className="h-display text-2xl text-ink">
                                            {s.title}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <CTASection />
        </div>
    );
}
