import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import QuoteForm from '@/components/QuoteForm';
import { CONTACT } from '@/lib/constants';

const TRUST_POINTS = [
    'Access to laser cutting, tube laser, waterjet, flame, plasma, folding, welding, fabrication and finishing',
    'Vetted UK supplier network — jobs matched to the right process and shop',
    'One person owns the enquiry from drawing to delivery',
    'PDF, DXF, DWG, STEP, STL, images and ZIP packs — all accepted',
    'Useful as a backup, second-quote or main supplier',
];

export default function Quote() {
    return (
        <div data-testid="quote-page">
            <PageHero
                overline="Request a Quote"
                title={['Send us the job.', 'We’ll source', 'the right route.']}
                subtitle="Send your drawings and we’ll help source the right process, price and supplier route for the job. If you only have a drawing and a delivery date — that’s enough to get started."
                image="https://images.unsplash.com/photo-1581093806997-124204d9fa9d"
            />

            <section className="py-16 sm:py-24 bg-bg-0 border-b border-line">
                <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8">
                        <QuoteForm />
                    </div>

                    <aside className="lg:col-span-4">
                        <div className="lg:sticky lg:top-28 space-y-8">
                            <div className="border border-line bg-bg-1 p-8">
                                <div className="overline brand mb-4">Why buyers stay</div>
                                <ul className="space-y-4">
                                    {TRUST_POINTS.map((p) => (
                                        <li key={p} className="flex items-start gap-3 text-ink">
                                            <span className="w-2 h-2 rotate-45 bg-brand mt-2 shrink-0" />
                                            <span className="text-sm leading-relaxed">{p}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border border-line bg-bg-1 p-8">
                                <div className="overline brand mb-4">Prefer to talk?</div>
                                <a
                                    href={`mailto:${CONTACT.email}`}
                                    data-testid="quote-side-email"
                                    className="flex items-start gap-3 text-ink hover:text-brand transition-colors py-2"
                                >
                                    <Mail size={16} className="mt-1 text-brand shrink-0" />
                                    <span className="text-sm">{CONTACT.email}</span>
                                </a>
                                <a
                                    href={`tel:${CONTACT.phoneRaw}`}
                                    data-testid="quote-side-phone"
                                    className="flex items-start gap-3 text-ink hover:text-brand transition-colors py-2"
                                >
                                    <Phone size={16} className="mt-1 text-brand shrink-0" />
                                    <span className="text-sm">{CONTACT.phone}</span>
                                </a>
                                <div className="flex items-start gap-3 text-ink-2 py-2">
                                    <MapPin size={16} className="mt-1 text-brand shrink-0" />
                                    <span className="text-sm">{CONTACT.location}</span>
                                </div>
                            </div>

                            <div className="border border-line bg-bg-1 p-8">
                                <div className="overline brand mb-4">Response times</div>
                                <div className="h-display text-4xl text-ink mb-2">≤ 24h</div>
                                <p className="text-sm text-ink-2 leading-relaxed">
                                    Enquiries received before 4pm on a working day are
                                    typically quoted or replied to inside 24 hours.
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </div>
    );
}
