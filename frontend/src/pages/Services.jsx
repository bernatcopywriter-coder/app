import PageHero from '@/components/PageHero';
import ServicesShowcase from '@/components/ServicesShowcase';
import CapabilitiesStrip from '@/components/CapabilitiesStrip';
import MaterialsStrip from '@/components/MaterialsStrip';
import ManifestoChapters from '@/components/ManifestoChapters';
import CTASection from '@/components/CTASection';

export default function Services() {
    return (
        <div data-testid="services-page">
            <PageHero
                overline="Services"
                title={['A single source', 'for cutting, fabrication', 'and finishing.']}
                subtitle="Bernat Solutions helps UK businesses source and manage laser cutting, tube and section cutting, heavy plate profiling, folding, fabrication and finishing through a trusted supplier network — quoted and coordinated as one job."
                image="/services/laser-flat.jpg"
            />
            <ServicesShowcase />
            <CapabilitiesStrip />
            <MaterialsStrip />
            <ManifestoChapters />
            <CTASection />
        </div>
    );
}
