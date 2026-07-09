import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
    Upload, X, Loader2, FileText, ArrowUpRight, Check,
} from 'lucide-react';
import { PROCESS_OPTIONS, MATERIAL_OPTIONS } from '@/lib/constants';
import { submitQuote } from '@/lib/api';

const initial = {
    name: '',
    company: '',
    email: '',
    phone: '',
    postcode: '',
    lead_time: '',
    material: '',
    thickness: '',
    quantity: '',
    processes: [],
    notes: '',
    consent: false,
    honeypot: '',
};

const MATERIALS = MATERIAL_OPTIONS;

const LEAD_TIMES = [
    'ASAP / Urgent',
    'Within 1 week',
    '1–2 weeks',
    '2–4 weeks',
    'Flexible',
];

export default function QuoteForm() {
    const [state, setState] = useState(initial);
    const [files, setFiles] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);
    const fileRef = useRef(null);

    const set = (k) => (e) =>
        setState((s) => ({ ...s, [k]: e.target?.value ?? e }));

    const toggleProcess = (p) =>
        setState((s) => ({
            ...s,
            processes: s.processes.includes(p)
                ? s.processes.filter((x) => x !== p)
                : [...s.processes, p],
        }));

    const addFiles = (fs) => {
        const arr = Array.from(fs || []);
        setFiles((cur) => [...cur, ...arr].slice(0, 8));
    };
    const removeFile = (i) =>
        setFiles((cur) => cur.filter((_, idx) => idx !== i));

    const onDrop = (e) => {
        e.preventDefault();
        addFiles(e.dataTransfer.files);
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!state.consent) {
            toast.error('Please tick the consent box to continue.');
            return;
        }
        if (!state.name || !state.company || !state.email || !state.phone) {
            toast.error('Please fill the required contact details.');
            return;
        }

        setSubmitting(true);
        try {
            const fd = new FormData();
            Object.entries(state).forEach(([k, v]) => {
                if (k === 'processes') fd.append(k, v.join(','));
                else if (typeof v === 'boolean') fd.append(k, v ? 'true' : 'false');
                else fd.append(k, v ?? '');
            });
            files.forEach((f) => fd.append('files', f));
            const res = await submitQuote(fd);
            setSuccess(res.quote_id);
            toast.success('Enquiry received. We will be in touch shortly.');
            setState(initial);
            setFiles([]);
        } catch (err) {
            const msg = err?.response?.data?.detail || 'Something went wrong. Please try again or email us directly.';
            toast.error(String(msg));
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                data-testid="quote-success"
                className="border border-line-strong bg-bg-1 p-10 md:p-14"
            >
                <div className="w-14 h-14 flex items-center justify-center bg-brand text-white mb-8">
                    <Check size={26} strokeWidth={2.5} />
                </div>
                <div className="overline brand mb-3">Enquiry received</div>
                <h3 className="h-display text-4xl md:text-5xl text-ink mb-6">
                    Thanks — we&apos;ve got your job.
                </h3>
                <p className="text-ink-2 max-w-xl leading-relaxed text-lg">
                    We&apos;ll review your drawings and come back to you as soon as
                    possible. Your reference is{' '}
                    <span className="text-brand font-mono">{success}</span>.
                </p>
                <button
                    onClick={() => setSuccess(null)}
                    data-testid="quote-send-another"
                    className="mt-10 btn-fill inline-flex items-center gap-2 px-6 py-3 border border-line-strong text-ink text-sm font-semibold uppercase tracking-wider hover:text-white"
                >
                    Send another enquiry
                    <ArrowUpRight size={16} />
                </button>
            </motion.div>
        );
    }

    return (
        <form
            data-testid="quote-form"
            onSubmit={submit}
            className="border border-line bg-bg-1"
        >
            {/* Honeypot */}
            <input
                type="text"
                name="website"
                value={state.honeypot}
                onChange={set('honeypot')}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
            />

            <SectionHeader n="01" title="Your details" />
            <div className="grid grid-cols-1 md:grid-cols-2 border-t border-line">
                <Field label="Name" name="name" value={state.name} onChange={set('name')} required tid="qf-name" />
                <Field label="Company" name="company" value={state.company} onChange={set('company')} required tid="qf-company" />
                <Field type="email" label="Email" name="email" value={state.email} onChange={set('email')} required tid="qf-email" />
                <Field label="Phone" name="phone" value={state.phone} onChange={set('phone')} required tid="qf-phone" />
                <Field label="Delivery Postcode" name="postcode" value={state.postcode} onChange={set('postcode')} tid="qf-postcode" />
                <SelectField
                    label="Required Lead Time"
                    value={state.lead_time}
                    onChange={set('lead_time')}
                    options={LEAD_TIMES}
                    tid="qf-lead-time"
                />
            </div>

            <SectionHeader n="02" title="The job" />
            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-line">
                <SelectField
                    label="Material"
                    value={state.material}
                    onChange={set('material')}
                    options={MATERIALS}
                    tid="qf-material"
                />
                <Field
                    label="Thickness / Size"
                    placeholder="e.g. 3mm sheet, 50x50x3 box"
                    value={state.thickness}
                    onChange={set('thickness')}
                    tid="qf-thickness"
                />
                <Field
                    label="Quantity"
                    placeholder="e.g. 25 off / batch of 100"
                    value={state.quantity}
                    onChange={set('quantity')}
                    tid="qf-quantity"
                />
            </div>

            <div className="border-t border-line px-6 md:px-8 py-8">
                <div className="overline mb-4">Processes required</div>
                <div className="flex flex-wrap gap-2.5">
                    {PROCESS_OPTIONS.map((p) => {
                        const active = state.processes.includes(p);
                        const tid = p
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)/g, '');
                        return (
                            <button
                                type="button"
                                key={p}
                                data-testid={`qf-process-${tid}`}
                                onClick={() => toggleProcess(p)}
                                className={`px-4 py-2 border text-sm transition-colors ${
                                    active
                                        ? 'border-brand bg-brand text-white'
                                        : 'border-line-strong text-ink hover:border-brand hover:text-brand'
                                }`}
                            >
                                {p}
                            </button>
                        );
                    })}
                </div>
            </div>

            <SectionHeader n="03" title="Drawings" />
            <div className="border-t border-line px-6 md:px-8 py-8">
                <div
                    onClick={() => fileRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={onDrop}
                    role="button"
                    tabIndex={0}
                    data-testid="qf-dropzone"
                    className="cursor-pointer border border-dashed border-line-strong hover:border-brand transition-colors p-10 flex flex-col items-center text-center"
                >
                    <div className="w-12 h-12 flex items-center justify-center border border-line-strong text-brand mb-4">
                        <Upload size={20} />
                    </div>
                    <div className="text-ink font-medium">Drop drawings here or click to upload</div>
                    <div className="text-ink-3 text-sm mt-2">
                        PDF, DXF, DWG, STEP, STL, images or ZIP drawing packs. Up to 8 files, 15MB each.
                    </div>
                    <input
                        ref={fileRef}
                        type="file"
                        multiple
                        onChange={(e) => addFiles(e.target.files)}
                        accept=".pdf,.dxf,.dwg,.step,.stp,.iges,.igs,.stl,.png,.jpg,.jpeg,.webp,.gif,.zip,.x_t"
                        className="hidden"
                        data-testid="qf-file-input"
                    />
                </div>

                {files.length > 0 && (
                    <ul className="mt-6 divide-y divide-line border border-line">
                        {files.map((f, i) => (
                            <li
                                key={`${f.name}-${i}`}
                                className="flex items-center justify-between p-3 bg-bg-0"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <FileText size={16} className="text-brand shrink-0" />
                                    <span className="truncate text-sm text-ink">
                                        {f.name}
                                    </span>
                                    <span className="text-xs text-ink-3 shrink-0">
                                        {(f.size / 1024).toFixed(0)} KB
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeFile(i)}
                                    aria-label="Remove"
                                    data-testid={`qf-remove-file-${i}`}
                                    className="text-ink-2 hover:text-brand"
                                >
                                    <X size={16} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <SectionHeader n="04" title="Anything else" />
            <div className="border-t border-line px-6 md:px-8 py-8">
                <div className="overline mb-3">Additional notes</div>
                <textarea
                    rows={5}
                    value={state.notes}
                    onChange={set('notes')}
                    data-testid="qf-notes"
                    placeholder="Tolerances, finish, delivery constraints, anything unusual…"
                    className="w-full bg-bg-0 border border-line-strong text-ink px-4 py-3 outline-none focus:border-brand transition-colors leading-relaxed"
                />
            </div>

            <div className="border-t border-line px-6 md:px-8 py-8 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={state.consent}
                        onChange={(e) => setState((s) => ({ ...s, consent: e.target.checked }))}
                        data-testid="qf-consent"
                        className="mt-1 w-4 h-4 accent-[#ff5a1f]"
                    />
                    <span className="text-sm text-ink-2 max-w-md">
                        I understand Bernat Solutions may contact me for clarification on
                        my enquiry.
                    </span>
                </label>

                <button
                    type="submit"
                    disabled={submitting}
                    data-testid="qf-submit"
                    className="btn-fill inline-flex items-center gap-3 px-8 py-4 bg-brand text-white text-sm font-semibold uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {submitting ? (
                        <>
                            <Loader2 size={18} className="animate-spin" /> Sending…
                        </>
                    ) : (
                        <>
                            Submit Enquiry
                            <ArrowUpRight size={18} strokeWidth={2.4} />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

function SectionHeader({ n, title }) {
    return (
        <div className="flex items-center gap-4 px-6 md:px-8 py-6">
            <span className="font-display text-brand text-xl">/{n}</span>
            <span className="overline">{title}</span>
        </div>
    );
}

function Field({
    label,
    value,
    onChange,
    type = 'text',
    required = false,
    placeholder,
    tid,
}) {
    return (
        <div className="border-t border-line md:border-t-0 md:[&:nth-child(-n+2)]:border-t-0 md:border-l border-line first:border-l-0 md:first:border-l-0 md:[&:nth-child(2n+1)]:border-l-0 px-6 md:px-8 py-5">
            <label className="overline block mb-2">
                {label}
                {required && <span className="text-brand ml-1">*</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                data-testid={tid}
                className="w-full bg-transparent border-0 border-b border-line text-ink text-lg py-2 outline-none focus:border-brand transition-colors placeholder:text-ink-3"
            />
        </div>
    );
}

function SelectField({ label, value, onChange, options, tid }) {
    return (
        <div className="border-t border-line md:border-t-0 md:border-l border-line first:border-l-0 md:first:border-l-0 px-6 md:px-8 py-5">
            <label className="overline block mb-2">{label}</label>
            <select
                value={value}
                onChange={onChange}
                data-testid={tid}
                className="w-full bg-transparent border-0 border-b border-line text-ink text-lg py-2 outline-none focus:border-brand transition-colors"
            >
                <option value="" className="bg-bg-1 text-ink-2">Select…</option>
                {options.map((o) => (
                    <option key={o} value={o} className="bg-bg-1 text-ink">
                        {o}
                    </option>
                ))}
            </select>
        </div>
    );
}
