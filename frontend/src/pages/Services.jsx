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
                overline="Capabilities"
                title={['A single source', 'for cutting, fabrication', 'and finishing.']}
                subtitle="Kingsford Metals coordinates laser cutting, tube and section cutting, heavy plate profiling, folding, fabrication, welding and finishing for UK businesses — quoted and delivered as one job."
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
