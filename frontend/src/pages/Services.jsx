import PageHero from '@/components/PageHero';
import ServicesShowcase from '@/components/ServicesShowcase';
import ManifestoChapters from '@/components/ManifestoChapters';
import CTASection from '@/components/CTASection';

export default function Services() {
    return (
        <div data-testid="services-page">
            <PageHero
                overline="Services"
                title={['A single source', 'for everything', 'metalwork.']}
                subtitle="From laser-cut prototypes to fully-fabricated production batches — every process is coordinated by us and delivered through a vetted UK supplier network."
                image="https://images.pexels.com/photos/12951623/pexels-photo-12951623.jpeg"
            />
            <ServicesShowcase />
            <ManifestoChapters />
            <CTASection />
        </div>
    );
}
