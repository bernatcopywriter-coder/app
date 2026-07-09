import Hero from '@/components/Hero';
import BackupBlock from '@/components/BackupBlock';
import EditorialMarquee from '@/components/Marquee';
import BenefitsGrid from '@/components/BenefitsGrid';
import ServicesShowcase from '@/components/ServicesShowcase';
import ManifestoChapters from '@/components/ManifestoChapters';
import IndustryChips from '@/components/IndustryChips';
import TrustBlocks from '@/components/TrustBlocks';
import CTASection from '@/components/CTASection';

export default function Home() {
    return (
        <div data-testid="home-page">
            <Hero />
            <BackupBlock />
            <EditorialMarquee />
            <BenefitsGrid />
            <ServicesShowcase />
            <ManifestoChapters />
            <IndustryChips />
            <TrustBlocks />
            <CTASection />
        </div>
    );
}
