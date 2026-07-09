import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import CTASection from '@/components/CTASection';

const VALUES = [
    {
        n: '01',
        title: 'Shopfloor eyes',
        text: 'Every enquiry is read by someone who has actually run a laser cutter and a press brake — so the quote reflects the real job, not a checkbox.',
    },
    {
        n: '02',
        title: 'Straight talk',
        text: 'If a job needs tweaking to make it cheaper or faster, we say so. If something is going to slip, we say so before you have to ask.',
    },
    {
        n: '03',
        title: 'One point of contact',
        text: 'No account manager relay. You email one person, that person owns your job through to delivery.',
    },
    {
        n: '04',
        title: 'Lean by design',
        text: 'A lean, sharp operation means quicker quotes, better prices and fewer people to lose the plot in the middle.',
    },
];

export default function About() {
    return (
        <div data-testid="about-page">
            <PageHero
                overline="About"
                title={['Built on the', 'shopfloor.', 'Sharpened for buyers.']}
                subtitle="Bernat Solutions was built by someone with hands-on experience in laser cutting, press brake work, steel processing, estimating and customer account management — someone who has read the drawings and stood by the machine."
                image="https://images.unsplash.com/photo-1563083165-32e6c6918e49"
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
                            The Idea
                        </div>
                        <h2 className="h-display text-[clamp(2rem,5vw,4rem)] text-ink mb-8">
                            A sharper way to source metalwork.
                        </h2>
                        <div className="space-y-6 text-ink-2 text-lg leading-relaxed">
                            <p>
                                Too many UK buyers know the routine. Send a drawing. Wait
                                three days. Chase. Then get a quote you can&apos;t quite
                                make sense of. Bernat Solutions was built to end that
                                pattern.
                            </p>
                            <p>
                                We understand both sides — the shopfloor and the customer.
                                That means enquiries are handled properly, drawings are
                                actually read, and communication stays clear from the
                                first email to the final delivery.
                            </p>
                            <p>
                                We&apos;re not trying to sound huge. We&apos;re lean, sharp
                                and reliable — a serious backup or main supplier for
                                companies who want fewer surprises and better answers.
                            </p>
                        </div>
                    </motion.div>

                    <div className="lg:col-span-5 lg:col-start-8">
                        <div className="relative overflow-hidden border border-line-strong aspect-[3/4]">
                            <img
                                src="https://images.pexels.com/photos/177872/pexels-photo-177872.jpeg"
                                alt="Welding sparks"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-bg-0 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="overline brand mb-1">Since 2024</div>
                                <div className="h-display text-3xl text-ink">
                                    Nottinghamshire based · UK-wide
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
