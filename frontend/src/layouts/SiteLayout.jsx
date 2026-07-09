import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export default function SiteLayout({ children, showFooter = true }) {
    return (
        <div className="relative min-h-screen bg-bg-0 text-ink">
            <Nav />
            <main className="relative z-10">{children}</main>
            {showFooter && <Footer />}
        </div>
    );
}
