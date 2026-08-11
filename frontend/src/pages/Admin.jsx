import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
    Loader2, LogOut, FileText, Download, Trash2, ArrowLeft, X,
    Mail as MailIcon, Phone as PhoneIcon, MapPin, KeyRound, Eye, EyeOff,
} from 'lucide-react';
import {
    listAdminQuotes,
    getAdminQuote,
    updateAdminQuoteStatus,
    deleteAdminQuote,
    adminFileUrl,
    listAdminMessages,
    changePassword,
} from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';

const STATUS_OPTIONS = [
    { v: 'new', label: 'New' },
    { v: 'in_progress', label: 'In Progress' },
    { v: 'quoted', label: 'Quoted' },
    { v: 'closed', label: 'Closed' },
];

export default function Admin() {
    const { user, loading, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);
    const [tab, setTab] = useState('quotes');
    const [data, setData] = useState({ items: [], stats: {} });
    const [messages, setMessages] = useState({ items: [], total: 0 });
    const [loadingData, setLoadingData] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selected, setSelected] = useState(null);
    const [pwOpen, setPwOpen] = useState(false);

    // Auth guard
    useEffect(() => {
        if (loading) return;
        const passed = location.state?.user;
        const effective = passed || user;
        if (!effective) {
            navigate('/login', { replace: true });
            return;
        }
        if (!effective.is_admin) {
            toast.error('This account is not authorised for the admin dashboard.');
            navigate('/', { replace: true });
            return;
        }
        setChecking(false);
    }, [user, loading, navigate, location.state]);

    // Load data
    useEffect(() => {
        if (checking) return;
        (async () => {
            setLoadingData(true);
            try {
                const [q, m] = await Promise.all([
                    listAdminQuotes(),
                    listAdminMessages(),
                ]);
                setData(q);
                setMessages(m);
            } catch (e) {
                toast.error('Could not load dashboard data.');
            } finally {
                setLoadingData(false);
            }
        })();
    }, [checking]);

    // Load selected quote
    useEffect(() => {
        if (!selectedId) {
            setSelected(null);
            return;
        }
        (async () => {
            try {
                const q = await getAdminQuote(selectedId);
                setSelected(q);
            } catch (_) {
                toast.error('Quote not found.');
                setSelectedId(null);
            }
        })();
    }, [selectedId]);

    const refresh = async () => {
        try {
            const q = await listAdminQuotes();
            setData(q);
        } catch (_) {}
    };

    const changeStatus = async (id, statusVal) => {
        try {
            await updateAdminQuoteStatus(id, statusVal);
            toast.success('Status updated');
            refresh();
            if (selected?.quote_id === id) setSelected((s) => ({ ...s, status: statusVal }));
        } catch (_) {
            toast.error('Could not update status');
        }
    };

    const remove = async (id) => {
        // eslint-disable-next-line no-alert
        if (!window.confirm('Delete this quote permanently?')) return;
        try {
            await deleteAdminQuote(id);
            toast.success('Quote deleted');
            setSelectedId(null);
            refresh();
        } catch (_) {
            toast.error('Could not delete');
        }
    };

    if (loading || checking) {
        return (
            <div className="min-h-screen bg-bg-0 flex items-center justify-center text-ink-2">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    const effUser = location.state?.user || user;

    return (
        <div data-testid="admin-page" className="min-h-screen bg-bg-0 text-ink">
            {/* Admin nav */}
            <header className="sticky top-0 z-40 border-b border-line bg-bg-0/90 backdrop-blur-xl">
                <div className="container-x flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-3">
                        <span
                            aria-hidden
                            className="w-8 h-8 border border-brand flex items-center justify-center text-brand font-display text-[13px] font-semibold tracking-widest"
                        >
                            KM
                        </span>
                        <span className="font-display uppercase tracking-tight text-lg">
                            Kingsford Metals <span className="text-ink-3">/ Admin</span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="hidden md:flex items-center gap-2 text-ink-2">
                            {effUser?.picture && (
                                <img
                                    src={effUser.picture}
                                    alt=""
                                    className="w-7 h-7 border border-line-strong object-cover"
                                />
                            )}
                            <span data-testid="admin-user-email">{effUser?.email}</span>
                        </div>
                        <button
                            data-testid="admin-change-password"
                            onClick={() => setPwOpen(true)}
                            className="btn-fill inline-flex items-center gap-2 px-4 py-2 border border-line-strong text-ink text-xs font-semibold uppercase tracking-widest hover:text-white"
                        >
                            <KeyRound size={14} />
                            <span className="hidden sm:inline">Change password</span>
                        </button>
                        <button
                            data-testid="admin-logout"
                            onClick={async () => {
                                await logout();
                                navigate('/login', { replace: true });
                            }}
                            className="btn-fill inline-flex items-center gap-2 px-4 py-2 border border-line-strong text-ink text-xs font-semibold uppercase tracking-widest hover:text-white"
                        >
                            <LogOut size={14} />
                            Log out
                        </button>
                    </div>
                </div>
            </header>

            <div className="container-x py-10">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 border border-line bg-bg-1 mb-8">
                    <StatCell label="Total" value={data.stats.total || 0} accent />
                    <StatCell label="New" value={data.stats.new || 0} />
                    <StatCell label="In Progress" value={data.stats.in_progress || 0} />
                    <StatCell label="Quoted" value={data.stats.quoted || 0} />
                    <StatCell label="Closed" value={data.stats.closed || 0} />
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-line mb-8">
                    {[
                        { k: 'quotes', label: `Quotes (${data.items?.length || 0})` },
                        { k: 'messages', label: `Messages (${messages.total || 0})` },
                    ].map((t) => (
                        <button
                            key={t.k}
                            onClick={() => setTab(t.k)}
                            data-testid={`admin-tab-${t.k}`}
                            className={`relative py-3 text-sm uppercase tracking-widest font-medium transition-colors ${
                                tab === t.k ? 'text-ink' : 'text-ink-2 hover:text-ink'
                            }`}
                        >
                            {t.label}
                            {tab === t.k && (
                                <motion.span
                                    layoutId="admin-tab-underline"
                                    className="absolute left-0 right-0 -bottom-px h-[2px] bg-brand"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {loadingData ? (
                    <div className="flex items-center gap-3 text-ink-2 py-16">
                        <Loader2 className="animate-spin" size={18} />
                        Loading…
                    </div>
                ) : tab === 'quotes' ? (
                    <QuotesTable
                        items={data.items || []}
                        onOpen={setSelectedId}
                        onStatus={changeStatus}
                    />
                ) : (
                    <MessagesList items={messages.items || []} />
                )}
            </div>

            <AnimatePresence>
                {selected && (
                    <QuoteDrawer
                        quote={selected}
                        onClose={() => setSelectedId(null)}
                        onStatus={changeStatus}
                        onDelete={remove}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {pwOpen && <ChangePasswordModal onClose={() => setPwOpen(false)} />}
            </AnimatePresence>
        </div>
    );
}

function StatCell({ label, value, accent = false }) {
    return (
        <div className={`p-6 border-r last:border-r-0 border-line ${accent ? 'bg-bg-0' : ''}`}>
            <div className="overline mb-2">{label}</div>
            <div className={`h-display text-4xl ${accent ? 'text-brand' : 'text-ink'}`}>{value}</div>
        </div>
    );
}

function QuotesTable({ items, onOpen, onStatus }) {
    if (!items.length) {
        return (
            <div className="border border-line bg-bg-1 p-16 text-center text-ink-2" data-testid="admin-quotes-empty">
                No quote enquiries yet. When one is submitted it will appear here.
            </div>
        );
    }
    return (
        <div className="border border-line bg-bg-1 overflow-x-auto" data-testid="admin-quotes-table">
            <table className="w-full text-sm">
                <thead className="text-ink-3 text-xs uppercase tracking-widest">
                    <tr className="border-b border-line">
                        <Th>Ref</Th>
                        <Th>Company / Contact</Th>
                        <Th>Processes</Th>
                        <Th>Files</Th>
                        <Th>Received</Th>
                        <Th>Status</Th>
                        <Th className="text-right pr-6">Action</Th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((q) => (
                        <tr
                            key={q.quote_id}
                            className="border-b border-line hover:bg-bg-0/70 transition-colors"
                        >
                            <Td>
                                <span className="font-mono text-brand text-xs">
                                    {q.quote_id}
                                </span>
                            </Td>
                            <Td>
                                <div className="text-ink">{q.company}</div>
                                <div className="text-ink-3 text-xs">
                                    {q.name} · {q.email}
                                </div>
                            </Td>
                            <Td>
                                <div className="flex flex-wrap gap-1.5">
                                    {(q.processes || []).slice(0, 3).map((p) => (
                                        <span
                                            key={p}
                                            className="text-[10px] uppercase tracking-widest border border-line-strong px-2 py-0.5 text-ink-2"
                                        >
                                            {p}
                                        </span>
                                    ))}
                                    {q.processes?.length > 3 && (
                                        <span className="text-[10px] text-ink-3">
                                            +{q.processes.length - 3}
                                        </span>
                                    )}
                                </div>
                            </Td>
                            <Td>
                                <div className="flex items-center gap-1 text-ink-2">
                                    <FileText size={14} /> {q.files?.length || 0}
                                </div>
                            </Td>
                            <Td>
                                <span className="text-ink-2 text-xs">
                                    {new Date(q.created_at).toLocaleString('en-GB')}
                                </span>
                            </Td>
                            <Td>
                                <select
                                    value={q.status}
                                    onChange={(e) => onStatus(q.quote_id, e.target.value)}
                                    data-testid={`admin-status-${q.quote_id}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-bg-0 border border-line-strong text-ink text-xs px-2 py-1"
                                >
                                    {STATUS_OPTIONS.map((s) => (
                                        <option key={s.v} value={s.v}>
                                            {s.label}
                                        </option>
                                    ))}
                                </select>
                            </Td>
                            <Td className="text-right pr-6">
                                <button
                                    onClick={() => onOpen(q.quote_id)}
                                    data-testid={`admin-open-${q.quote_id}`}
                                    className="text-brand hover:underline text-xs uppercase tracking-widest"
                                >
                                    View
                                </button>
                            </Td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Th({ children, className = '' }) {
    return (
        <th className={`text-left px-6 py-4 font-medium ${className}`}>{children}</th>
    );
}
function Td({ children, className = '' }) {
    return <td className={`px-6 py-4 align-top ${className}`}>{children}</td>;
}

function MessagesList({ items }) {
    if (!items.length)
        return (
            <div className="border border-line bg-bg-1 p-16 text-center text-ink-2" data-testid="admin-messages-empty">
                No contact messages yet.
            </div>
        );
    return (
        <ul className="space-y-3" data-testid="admin-messages-list">
            {items.map((m) => (
                <li key={m.message_id} className="border border-line bg-bg-1 p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="font-display text-ink text-lg">
                            {m.name}{' '}
                            {m.company && <span className="text-ink-3">· {m.company}</span>}
                        </div>
                        <span className="text-xs text-ink-3">
                            {new Date(m.created_at).toLocaleString('en-GB')}
                        </span>
                    </div>
                    <div className="text-sm text-ink-2 mb-4 flex flex-wrap gap-4">
                        <span className="inline-flex items-center gap-2">
                            <MailIcon size={14} className="text-brand" /> {m.email}
                        </span>
                        {m.phone && (
                            <span className="inline-flex items-center gap-2">
                                <PhoneIcon size={14} className="text-brand" /> {m.phone}
                            </span>
                        )}
                    </div>
                    <p className="text-ink leading-relaxed whitespace-pre-line">
                        {m.message}
                    </p>
                </li>
            ))}
        </ul>
    );
}

function QuoteDrawer({ quote, onClose, onStatus, onDelete }) {
    return (
        <motion.div
            data-testid="admin-quote-drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-bg-0/80 backdrop-blur-md flex justify-end"
            onClick={onClose}
        >
            <motion.aside
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 40, opacity: 0 }}
                transition={{ ease: [0.7, 0, 0.2, 1], duration: 0.35 }}
                className="w-full max-w-2xl h-full bg-bg-1 border-l border-line overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 flex items-center justify-between px-8 py-5 border-b border-line bg-bg-1/90 backdrop-blur">
                    <button
                        onClick={onClose}
                        data-testid="admin-drawer-close"
                        className="inline-flex items-center gap-2 text-ink-2 text-xs uppercase tracking-widest hover:text-ink"
                    >
                        <ArrowLeft size={14} /> Back
                    </button>
                    <button
                        onClick={onClose}
                        className="text-ink-2 hover:text-brand"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="px-8 py-8">
                    <div className="overline brand mb-2">
                        Ref <span className="text-brand font-mono">{quote.quote_id}</span>
                    </div>
                    <h2 className="h-display text-4xl text-ink mb-2">{quote.company}</h2>
                    <div className="text-ink-2 text-sm">
                        {quote.name} · Received{' '}
                        {new Date(quote.created_at).toLocaleString('en-GB')}
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Info label="Email" value={quote.email} />
                        <Info label="Phone" value={quote.phone} />
                        <Info label="Postcode" value={quote.postcode || '—'} />
                        <Info label="Lead Time" value={quote.lead_time || '—'} />
                        <Info label="Material" value={quote.material || '—'} />
                        <Info label="Thickness / Size" value={quote.thickness || '—'} />
                        <Info label="Quantity" value={quote.quantity || '—'} />
                        <div>
                            <div className="overline mb-2">Status</div>
                            <select
                                value={quote.status}
                                onChange={(e) => onStatus(quote.quote_id, e.target.value)}
                                data-testid="admin-drawer-status"
                                className="w-full bg-bg-0 border border-line-strong text-ink text-sm px-3 py-2"
                            >
                                {STATUS_OPTIONS.map((s) => (
                                    <option key={s.v} value={s.v}>
                                        {s.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="overline mb-3">Processes</div>
                        <div className="flex flex-wrap gap-2">
                            {(quote.processes || []).length === 0 && (
                                <span className="text-ink-3 text-sm">—</span>
                            )}
                            {(quote.processes || []).map((p) => (
                                <span
                                    key={p}
                                    className="text-xs uppercase tracking-widest border border-line-strong px-3 py-1.5 text-ink"
                                >
                                    {p}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="overline mb-3">Notes</div>
                        <p className="text-ink whitespace-pre-line leading-relaxed">
                            {quote.notes || <span className="text-ink-3">No notes provided.</span>}
                        </p>
                    </div>

                    <div className="mt-8">
                        <div className="overline mb-3">Drawings ({quote.files?.length || 0})</div>
                        {(quote.files || []).length === 0 ? (
                            <div className="text-ink-3 text-sm">No files attached.</div>
                        ) : (
                            <ul className="divide-y divide-line border border-line">
                                {quote.files.map((f) => (
                                    <li
                                        key={f.file_id}
                                        className="flex items-center justify-between p-3 bg-bg-0"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <FileText size={16} className="text-brand shrink-0" />
                                            <span className="truncate text-sm text-ink">
                                                {f.filename}
                                            </span>
                                            <span className="text-xs text-ink-3 shrink-0">
                                                {(f.size / 1024).toFixed(0)} KB
                                            </span>
                                        </div>
                                        <a
                                            href={adminFileUrl(quote.quote_id, f.file_id)}
                                            target="_blank"
                                            rel="noreferrer"
                                            data-testid={`admin-download-${f.file_id}`}
                                            className="text-brand hover:text-white inline-flex items-center gap-2 text-xs uppercase tracking-widest"
                                        >
                                            <Download size={14} /> Download
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="mt-12 pt-6 border-t border-line flex justify-between items-center">
                        <a
                            href={`mailto:${quote.email}?subject=Re: Your Kingsford Metals enquiry ${quote.quote_id}`}
                            className="btn-fill inline-flex items-center gap-2 px-5 py-3 bg-brand text-white text-xs uppercase tracking-widest font-semibold"
                        >
                            <MailIcon size={14} /> Reply
                        </a>
                        <button
                            onClick={() => onDelete(quote.quote_id)}
                            data-testid="admin-drawer-delete"
                            className="inline-flex items-center gap-2 px-4 py-2 border border-line-strong text-ink-2 text-xs uppercase tracking-widest hover:text-red-500 hover:border-red-500 transition-colors"
                        >
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                </div>
            </motion.aside>
        </motion.div>
    );
}

function Info({ label, value }) {
    return (
        <div>
            <div className="overline mb-2">{label}</div>
            <div className="text-ink text-sm break-words">{value}</div>
        </div>
    );
}


function ChangePasswordModal({ onClose }) {
    const [current, setCurrent] = useState('');
    const [next, setNext] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNext, setShowNext] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (next.length < 8) {
            toast.error('New password must be at least 8 characters.');
            return;
        }
        if (next !== confirm) {
            toast.error('New password and confirmation do not match.');
            return;
        }
        if (next === current) {
            toast.error('New password must be different from the current one.');
            return;
        }
        setSubmitting(true);
        try {
            await changePassword(current, next);
            toast.success('Password updated. Other sessions have been signed out.');
            onClose();
        } catch (err) {
            const msg = err?.response?.data?.detail || 'Could not change password.';
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            data-testid="change-password-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-bg-0/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.form
                onSubmit={submit}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ ease: [0.7, 0, 0.2, 1], duration: 0.3 }}
                className="w-full max-w-md bg-bg-1 border border-line"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-line">
                    <div className="flex items-center gap-3">
                        <KeyRound size={16} className="text-brand" />
                        <span className="font-display uppercase tracking-tight text-ink">
                            Change password
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        data-testid="change-password-close"
                        className="text-ink-2 hover:text-brand"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="px-6 py-6 space-y-5">
                    <PwField
                        label="Current password"
                        value={current}
                        onChange={setCurrent}
                        show={showCurrent}
                        toggle={() => setShowCurrent((v) => !v)}
                        testid="current-password"
                        autoFocus
                    />
                    <PwField
                        label="New password"
                        value={next}
                        onChange={setNext}
                        show={showNext}
                        toggle={() => setShowNext((v) => !v)}
                        testid="new-password"
                        hint="Minimum 8 characters."
                    />
                    <PwField
                        label="Confirm new password"
                        value={confirm}
                        onChange={setConfirm}
                        show={showNext}
                        toggle={() => setShowNext((v) => !v)}
                        testid="confirm-password"
                    />
                </div>

                <div className="px-6 py-4 border-t border-line flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-line-strong text-ink-2 text-xs uppercase tracking-widest hover:text-ink"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        data-testid="change-password-submit"
                        className="btn-fill inline-flex items-center gap-2 px-5 py-2 bg-brand text-white text-xs uppercase tracking-widest font-semibold disabled:opacity-50"
                    >
                        {submitting ? (
                            <>
                                <Loader2 size={14} className="animate-spin" /> Saving…
                            </>
                        ) : (
                            <>Update password</>
                        )}
                    </button>
                </div>
            </motion.form>
        </motion.div>
    );
}

function PwField({ label, value, onChange, show, toggle, testid, hint, autoFocus }) {
    return (
        <div>
            <label className="overline mb-2 block">{label}</label>
            <div className="relative">
                <input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    data-testid={testid}
                    autoFocus={autoFocus}
                    required
                    className="w-full bg-bg-0 border border-line-strong text-ink text-sm px-3 py-2.5 pr-10 focus:outline-none focus:border-brand"
                />
                <button
                    type="button"
                    onClick={toggle}
                    tabIndex={-1}
                    aria-label={show ? 'Hide password' : 'Show password'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink"
                >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
            {hint && <div className="text-ink-3 text-xs mt-1.5">{hint}</div>}
        </div>
    );
}
