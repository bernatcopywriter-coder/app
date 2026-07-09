import PageHero from '@/components/PageHero';

export default function Privacy() {
    return (
        <div data-testid="privacy-page">
            <PageHero overline="Privacy" title={['Privacy Policy']} />
            <section className="py-16 sm:py-24 border-b border-line bg-bg-0">
                <div className="container-x max-w-3xl space-y-6 text-ink-2 text-base leading-relaxed">
                    <p>
                        This privacy policy explains how Bernat Solutions (&quot;we&quot;,
                        &quot;us&quot;) collects and uses your information when you request a
                        quote, submit a contact enquiry, or otherwise interact with our website.
                    </p>
                    <h2 className="h-display text-2xl text-ink pt-6">What we collect</h2>
                    <p>
                        When you send a quote enquiry or contact us we collect the contact
                        details you provide (name, company, email, phone), the job details you
                        share (postcode, materials, quantity, processes, notes) and any
                        drawings or files you upload. We also record basic technical
                        information (IP address, user agent) to help protect against spam.
                    </p>
                    <h2 className="h-display text-2xl text-ink pt-6">How we use it</h2>
                    <p>
                        Your information is used solely to respond to your enquiry, prepare a
                        quote, coordinate the work with supplier partners where applicable,
                        and manage delivery. We do not sell or share your data with third
                        parties for marketing.
                    </p>
                    <h2 className="h-display text-2xl text-ink pt-6">How long we keep it</h2>
                    <p>
                        We keep enquiry records for as long as is reasonably necessary to
                        support ongoing customer relationships and satisfy legal/tax
                        requirements. You can request deletion at any time by emailing us.
                    </p>
                    <h2 className="h-display text-2xl text-ink pt-6">Your rights</h2>
                    <p>
                        Under UK GDPR you have the right to access, correct or request deletion
                        of your personal data. To exercise these rights please contact
                        alex@bernatsolutions.com.
                    </p>
                    <h2 className="h-display text-2xl text-ink pt-6">Contact</h2>
                    <p>
                        Questions? Email alex@bernatsolutions.com — we&apos;ll come back to
                        you within a working day.
                    </p>
                </div>
            </section>
        </div>
    );
}
