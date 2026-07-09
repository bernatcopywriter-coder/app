import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function NotFound() {
    return (
        <div data-testid="not-found-page" className="min-h-screen bg-bg-0 pt-32 pb-24">
            <div className="container-x">
                <div className="overline brand mb-6">404 — Not Found</div>
                <h1 className="h-display text-[clamp(3rem,10vw,9rem)] text-ink leading-none">
                    Off the drawing.
                </h1>
                <p className="mt-6 text-ink-2 text-lg max-w-xl">
                    That page doesn&apos;t exist. Head back to the homepage or request a
                    quote — we&apos;ll get you what you need.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                    <Link
                        to="/"
                        className="btn-fill inline-flex items-center gap-2 px-6 py-3 border border-line-strong text-ink text-sm font-semibold uppercase tracking-wider hover:text-white"
                    >
                        Home
                        <ArrowUpRight size={16} />
                    </Link>
                    <Link
                        to="/quote"
                        className="btn-fill inline-flex items-center gap-2 px-6 py-3 bg-brand text-white text-sm font-semibold uppercase tracking-wider hover:text-white"
                    >
                        Request a Quote
                        <ArrowUpRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
