import PageHero from '@/components/PageHero';

export default function Terms() {
    return (
        <div data-testid="terms-page">
            <PageHero overline="Terms" title={['Terms & Conditions']} />
            <section className="py-16 sm:py-24 border-b border-line bg-bg-0">
                <div className="container-x max-w-3xl space-y-6 text-ink-2 text-base leading-relaxed">
                    <p>
                        These terms govern your use of the Bernat Solutions website. By using
                        this site or submitting an enquiry you accept the terms below.
                    </p>
                    <h2 className="h-display text-2xl text-ink pt-6">Quotes and orders</h2>
                    <p>
                        Prices provided are quotations, not contracts. A quotation is
                        considered accepted only once we confirm your order in writing.
                        Delivery lead times are given in good faith and may vary depending on
                        material availability and supplier capacity.
                    </p>
                    <h2 className="h-display text-2xl text-ink pt-6">Intellectual property</h2>
                    <p>
                        Drawings, files and information you upload remain your property. We
                        will only use them to prepare a quote and, if the job proceeds, to
                        manufacture and deliver the work. We will not share them with third
                        parties outside of the supplier chain required to fulfil the order.
                    </p>
                    <h2 className="h-display text-2xl text-ink pt-6">Warranty & liability</h2>
                    <p>
                        Parts are supplied to the drawing and specification agreed. Any
                        defects must be reported in writing within 14 days of delivery. Our
                        liability is limited to the value of the affected work.
                    </p>
                    <h2 className="h-display text-2xl text-ink pt-6">Website content</h2>
                    <p>
                        We take reasonable steps to keep content accurate, but content on
                        this site is provided for information only and is not a legally
                        binding offer.
                    </p>
                    <h2 className="h-display text-2xl text-ink pt-6">Contact</h2>
                    <p>
                        For any queries about these terms, email alex@bernatsolutions.com.
                    </p>
                </div>
            </section>
        </div>
    );
}
