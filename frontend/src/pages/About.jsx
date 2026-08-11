import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import CTASection from '@/components/CTASection';

const VALUES = [
    {
        n: '01',
        title: 'Engineering understanding',
        text: 'Every enquiry is reviewed by someone who understands drawings, tolerances and how the part is actually going to be made — so the quote reflects the real job.',
    },
    {
        n: '02',
        title: 'Straight communication',
        text: 'Clear pricing, honest lead times, and early warning if anything looks likely to slip. No jargon, no hidden extras.',
    },
    {
        n: '03',
        title: 'One point of contact',
        text: 'You email one person who owns the job from enquiry through to delivery — cutting, folding, welding, finishing and dispatch.',
    },
    {
        n: '04',
        title: 'Dependable delivery',
        text: 'Careful coordination behind the scenes so quoted lead times are the lead times you actually get.',
    },
];

export default function About() {
    return (
        <div data-testid="about-page">
            <PageHero
                overline="About"
                title={['A straightforward', 'metalwork supplier.']}
                subtitle="Kingsford Metals provides UK businesses with a straightforward way to source laser cutting, folding, fabrication and associated metalwork. We coordinate the manufacturing process from enquiry through to delivery — giving customers one reliable point of contact across multiple processes."
                image="https://images.unsplash.com/photo-1567789884554-0b844b597180"
            />

            <section className="py-24 sm:py-32 border-b border-line bg-bg-0">
                <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.7 }}
                        className="lg:col-span-6"
                    >
                        <div className="overline brand mb-5">
                            <span className="inline-block w-6 h-px bg-brand mr-3 align-middle" />
                            Our Focus
                        </div>
                        <h2 className="h-display text-[clamp(2rem,5vw,4rem)] text-ink mb-8">
                            Reliable metalwork. One point of contact.
                        </h2>
                        <div className="space-y-6 text-ink-2 text-lg leading-relaxed">
                            <p>
                                Sourcing metalwork should not mean managing five suppliers.
                                Most engineering and procurement teams have felt it — a
                                drawing sent to one shop for laser cutting, another for
                                folding, a third for welding, a fourth for finishing. Days
                                spent chasing quotes and coordinating deliveries.
                            </p>
                            <p>
                                Kingsford Metals provides a simpler route. We handle laser
                                cutting, folding, fabrication, welding and finishing as a
                                single piece of work — quoted competitively, coordinated
                                carefully, and delivered on time. You send the drawings; we
                                manage the rest.
                            </p>
                            <p>
                                Our focus is simple: competitive pricing, dependable supply,
                                clear communication and consistent quality — whether the job
                                is a one-off part or a repeat production batch.
                            </p>
                        </div>
                    </motion.div>

                    <div className="lg:col-span-5 lg:col-start-8">
                        <div className="relative overflow-hidden border border-line-strong aspect-[3/4]">
                            <img
                                src="https://images.pexels.com/photos/12475054/pexels-photo-12475054.jpeg"
                                alt="Welding sparks in an industrial workshop"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-bg-0 via-transparent to-transparent" />
                            <div className="absolute top-4 left-4 text-[10px] uppercase tracking-widest text-ink-3 bg-bg-0/60 px-2 py-1 border border-line-strong">
                                Representative workshop image
                            </div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="overline brand mb-1">UK-wide</div>
                                <div className="h-display text-3xl text-ink">
                                    Nottinghamshire based · Serving the UK
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 sm:py-32 border-b border-line bg-bg-1">
                <div className="container-x">
                    <div className="overline brand mb-5">
                        <span className="inline-block w-6 h-px bg-brand mr-3 align-middle" />
                        How We Work
                    </div>
                    <h2 className="h-display text-[clamp(2rem,5vw,4rem)] text-ink mb-16 max-w-[18ch]">
                        Four principles we won&apos;t compromise on.
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-line">
                        {VALUES.map((v, i) => (
                            <motion.div
                                key={v.n}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ duration: 0.6, delay: (i % 2) * 0.08 }}
                                className="border-r border-b border-line p-8 md:p-12 bg-bg-1 group hover:bg-bg-0 transition-colors"
                            >
                                <div className="flex items-baseline justify-between mb-8">
                                    <span className="font-display text-brand text-2xl">/{v.n}</span>
                                    <span className="w-2 h-2 rotate-45 bg-line-strong group-hover:bg-brand transition-colors" />
                                </div>
                                <h3 className="h-display text-3xl md:text-4xl text-ink mb-4">
                                    {v.title}
                                </h3>
                                <p className="text-ink-2 leading-relaxed">{v.text}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Link
                            to="/quote"
                            data-testid="about-cta"
                            className="btn-fill inline-flex items-center gap-3 px-8 py-4 bg-brand text-white text-sm font-semibold uppercase tracking-widest hover:text-white"
                        >
                            Work with us
                            <ArrowUpRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            <CTASection />
        </div>
    );
}
