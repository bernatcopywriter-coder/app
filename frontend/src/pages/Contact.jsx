import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, ArrowUpRight, Loader2, Check } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { submitContact } from '@/lib/api';
import { CONTACT } from '@/lib/constants';

export default function Contact() {
    const [state, setState] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
        honeypot: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    const set = (k) => (e) => setState((s) => ({ ...s, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        if (!state.name || !state.email || !state.message) {
            toast.error('Please add your name, email and a short message.');
            return;
        }
        setSubmitting(true);
        try {
            await submitContact(state);
            setDone(true);
            toast.success('Message sent. Thanks — we&#39;ll be in touch.');
            setState({ name: '', email: '', phone: '', company: '', message: '', honeypot: '' });
        } catch (err) {
            toast.error(err?.response?.data?.detail || 'Could not send. Please email us directly.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div data-testid="contact-page">
            <PageHero
                overline="Contact"
                title={['Get in touch.']}
                subtitle="Prefer to send drawings? Head to the quote page. For anything else — email, call, or drop us a message below."
                image="https://images.pexels.com/photos/12951623/pexels-photo-12951623.jpeg"
            />

            <section className="py-24 sm:py-32 bg-bg-0 border-b border-line">
                <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-5 space-y-4">
                        <a
                            href={`mailto:${CONTACT.email}`}
                            data-testid="contact-block-email"
                            className="group block border border-line bg-bg-1 p-8 hover:border-brand transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="overline brand">Email</div>
                                <ArrowUpRight size={16} className="text-ink-2 group-hover:text-brand transition-colors" />
                            </div>
                            <div className="flex items-center gap-4 mt-6">
                                <Mail size={24} className="text-brand" />
                                <span className="h-display text-2xl md:text-3xl text-ink">
                                    {CONTACT.email}
                                </span>
                            </div>
                        </a>

                        <a
                            href={`tel:${CONTACT.phoneRaw}`}
                            data-testid="contact-block-phone"
                            className="group block border border-line bg-bg-1 p-8 hover:border-brand transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="overline brand">Phone</div>
                                <ArrowUpRight size={16} className="text-ink-2 group-hover:text-brand transition-colors" />
                            </div>
                            <div className="flex items-center gap-4 mt-6">
                                <Phone size={24} className="text-brand" />
                                <span className="h-display text-2xl md:text-3xl text-ink">
                                    {CONTACT.phone}
                                </span>
                            </div>
                        </a>

                        <div className="border border-line bg-bg-1 p-8">
                            <div className="overline brand mb-6">Where we are</div>
                            <div className="flex items-center gap-4">
                                <MapPin size={24} className="text-brand" />
                                <span className="h-display text-2xl md:text-3xl text-ink">
                                    {CONTACT.location}
                                </span>
                            </div>
                            <p className="mt-4 text-sm text-ink-2">
                                Servicing customers UK-wide with deliveries to postcode.
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        {done ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                data-testid="contact-success"
                                className="border border-line-strong bg-bg-1 p-10 md:p-14"
                            >
                                <div className="w-14 h-14 flex items-center justify-center bg-brand text-white mb-8">
                                    <Check size={26} strokeWidth={2.5} />
                                </div>
                                <h3 className="h-display text-4xl md:text-5xl text-ink mb-6">
                                    Message received.
                                </h3>
                                <p className="text-ink-2 text-lg max-w-md">
                                    Thanks — we&apos;ll come back to you shortly. If it&apos;s
                                    urgent, feel free to call.
                                </p>
                            </motion.div>
                        ) : (
                            <form
                                onSubmit={submit}
                                data-testid="contact-form"
                                className="border border-line bg-bg-1"
                            >
                                <input
                                    type="text"
                                    value={state.honeypot}
                                    onChange={set('honeypot')}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    aria-hidden="true"
                                    className="hidden"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 border-b border-line">
                                    <ContactField label="Name" required value={state.name} onChange={set('name')} tid="cf-name" />
                                    <ContactField label="Company" value={state.company} onChange={set('company')} tid="cf-company" left />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 border-b border-line">
                                    <ContactField label="Email" type="email" required value={state.email} onChange={set('email')} tid="cf-email" />
                                    <ContactField label="Phone" value={state.phone} onChange={set('phone')} tid="cf-phone" left />
                                </div>
                                <div className="px-6 md:px-8 py-6">
                                    <label className="overline block mb-3">Message *</label>
                                    <textarea
                                        rows={7}
                                        value={state.message}
                                        onChange={set('message')}
                                        required
                                        data-testid="cf-message"
                                        placeholder="Tell us what you&#39;re looking to source or ask a question…"
                                        className="w-full bg-bg-0 border border-line-strong text-ink px-4 py-3 outline-none focus:border-brand transition-colors leading-relaxed"
                                    />
                                </div>
                                <div className="border-t border-line px-6 md:px-8 py-6 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        data-testid="cf-submit"
                                        className="btn-fill inline-flex items-center gap-3 px-7 py-4 bg-brand text-white text-sm font-semibold uppercase tracking-widest disabled:opacity-60"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                Sending…
                                            </>
                                        ) : (
                                            <>
                                                Send Message
                                                <ArrowUpRight size={16} strokeWidth={2.4} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

function ContactField({ label, value, onChange, type = 'text', required, tid, left = false }) {
    return (
        <div className={`px-6 md:px-8 py-5 ${left ? 'md:border-l border-line' : ''}`}>
            <label className="overline block mb-2">
                {label}
                {required && <span className="text-brand ml-1">*</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                data-testid={tid}
                className="w-full bg-transparent border-0 border-b border-line text-ink text-lg py-2 outline-none focus:border-brand transition-colors"
            />
        </div>
    );
}
