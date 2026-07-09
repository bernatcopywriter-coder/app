import PageHero from '@/components/PageHero';
import IndustryChips from '@/components/IndustryChips';
import CTASection from '@/components/CTASection';
import { motion } from 'framer-motion';
import { INDUSTRIES } from '@/lib/constants';

const NARRATIVES = {
    'Engineering companies': 'Overflow capacity, prototypes, replacement parts and structural sub-assemblies for busy engineering teams.',
    'Construction companies': 'Steel supply, brackets, plates, guarding and site-ready fabricated components delivered to programme.',
    Manufacturers: 'Repeat batches, kitted deliveries and consistent quality — treated like an extension of your production line.',
    'Agricultural businesses': 'Robust replacement parts, chassis brackets, hoppers, guards and repair fabrications for working kit.',
    'Motorsport suppliers': 'Fast-turnaround laser and folded parts for chassis, brackets, dashboards and prototype tooling.',
    'Signage companies': 'Precision laser-cut letterforms, sub-frames, brackets and finished panels ready for install.',
    'Maintenance teams': 'One-off urgent jobs, obsolete part remakes, guarding and site fixes with genuine responsiveness.',
    Fabricators: 'Sub-let laser cutting and folding when your own machines are full — same-day quotes, no hassle.',
    'Steel stockholders': 'Processing support for cut-to-size sheet, plate, box section and general steel preparation.',
    'Machinery builders': 'Chassis panels, guarding, brackets and pre-finished parts nested and delivered ready-to-fit.',
    Contractors: 'Ad-hoc fabrication, secondary steelwork and site-friendly kits delivered to postcode.',
    'Commercial fit-out': 'Feature panels, brackets, sub-frames and powder-coated fabrications for interior installers.',
};

export default function Industries() {
    return (
        <div data-testid="industries-page">
            <PageHero
                overline="Industries"
                title={['Sectors', 'we serve.']}
                subtitle="Bernat Solutions supports UK businesses that build, maintain and manufacture. Whatever the sector — the standards, the drawings and the communication stay the same."
                image="https://images.unsplash.com/photo-1496247749665-49cf5b1022e9"
            />

            <IndustryChips />

            <section className="py-24 sm:py-32 border-b border-line bg-bg-0">
                <div className="container-x">
                    <div className="overline brand mb-5">Sector Detail</div>
                    <h2 className="h-display text-[clamp(2rem,5vw,4rem)] text-ink mb-16 max-w-[20ch]">
                        A closer look at who we support.
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-line">
                        {INDUSTRIES.map((ind, i) => (
                            <motion.article
                                key={ind}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ duration: 0.6, delay: (i % 4) * 0.05 }}
                                className="border-r border-b border-line p-8 md:p-10 group hover:bg-bg-1 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <span className="font-display text-brand text-lg">
                                        /{String(i + 1).padStart(2, '0')}
                                    </span>
                                    <span className="w-2 h-2 rotate-45 bg-line-strong group-hover:bg-brand transition-colors" />
                                </div>
                                <h3 className="h-display text-2xl md:text-3xl text-ink mb-4">
                                    {ind}
                                </h3>
                                <p className="text-ink-2 leading-relaxed">
                                    {NARRATIVES[ind]}
                                </p>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            <CTASection />
        </div>
    );
}
