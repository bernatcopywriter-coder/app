import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import '@/App.css';

import useLenis from '@/hooks/useLenis';
import { AuthProvider } from '@/providers/AuthProvider';
import SiteLayout from '@/layouts/SiteLayout';

import Home from '@/pages/Home';
import Services from '@/pages/Services';
import ServiceDetail from '@/pages/ServiceDetail';
import Industries from '@/pages/Industries';
import About from '@/pages/About';
import Quote from '@/pages/Quote';
import Contact from '@/pages/Contact';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import NotFound from '@/pages/NotFound';
import Login from '@/pages/Login';
import AuthCallback from '@/pages/AuthCallback';
import Admin from '@/pages/Admin';

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, [pathname]);
    return null;
}

/** AppRouter checks for OAuth callback fragment synchronously during render.
 *  This is critical to avoid the AuthProvider race condition where /auth/me
 *  runs before the session cookie is set. */
function AppRouter() {
    const location = useLocation();
    if (location.hash?.includes('session_id=')) {
        return <AuthCallback />;
    }
    return (
        <Routes>
            {/* Marketing site — wrapped in SiteLayout (nav + footer) */}
            <Route
                path="/"
                element={
                    <SiteLayout>
                        <Home />
                    </SiteLayout>
                }
            />
            <Route
                path="/services"
                element={
                    <SiteLayout>
                        <Services />
                    </SiteLayout>
                }
            />
            <Route
                path="/services/:slug"
                element={
                    <SiteLayout>
                        <ServiceDetail />
                    </SiteLayout>
                }
            />
            <Route
                path="/industries"
                element={
                    <SiteLayout>
                        <Industries />
                    </SiteLayout>
                }
            />
            <Route
                path="/about"
                element={
                    <SiteLayout>
                        <About />
                    </SiteLayout>
                }
            />
            <Route
                path="/quote"
                element={
                    <SiteLayout>
                        <Quote />
                    </SiteLayout>
                }
            />
            <Route
                path="/contact"
                element={
                    <SiteLayout>
                        <Contact />
                    </SiteLayout>
                }
            />
            <Route
                path="/privacy"
                element={
                    <SiteLayout>
                        <Privacy />
                    </SiteLayout>
                }
            />
            <Route
                path="/terms"
                element={
                    <SiteLayout>
                        <Terms />
                    </SiteLayout>
                }
            />

            {/* Auth + admin — no site layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />

            {/* 404 */}
            <Route
                path="*"
                element={
                    <SiteLayout>
                        <NotFound />
                    </SiteLayout>
                }
            />
        </Routes>
    );
}

function App() {
    useLenis();
    return (
        <div className="App">
            <BrowserRouter>
                <AuthProvider>
                    <ScrollToTop />
                    <AppRouter />
                    <Toaster
                        theme="dark"
                        position="top-right"
                        toastOptions={{
                            style: {
                                background: '#111111',
                                color: '#f4f4f5',
                                border: '1px solid #262626',
                                borderRadius: '2px',
                                fontFamily: 'Manrope, sans-serif',
                            },
                        }}
                    />
                </AuthProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
