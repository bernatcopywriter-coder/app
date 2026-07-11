import { Component } from 'react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        // eslint-disable-next-line no-console
        console.error('App error:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-bg-0 text-ink flex items-center justify-center px-6">
                    <div className="max-w-lg text-center">
                        <div className="overline brand mb-6">Something went wrong</div>
                        <h1 className="h-display text-4xl md:text-5xl text-ink mb-6">
                            The page hit a snag.
                        </h1>
                        <p className="text-ink-2 mb-8 leading-relaxed">
                            Try refreshing. If it happens again, email{' '}
                            <a
                                className="text-brand hover:underline"
                                href="mailto:alex@bernatsolutions.com"
                            >
                                alex@bernatsolutions.com
                            </a>
                            .
                        </p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="btn-fill inline-flex items-center gap-2 px-6 py-3 border border-line-strong text-ink text-sm font-semibold uppercase tracking-wider hover:text-white"
                        >
                            Reload
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
