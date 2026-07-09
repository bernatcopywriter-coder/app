import { useEffect } from 'react';
import Lenis from 'lenis';

/** Global smooth momentum scrolling.
 *  Skips on touch to preserve native mobile inertia. */
export default function useLenis() {
    useEffect(() => {
        if (typeof window === 'undefined') return undefined;
        // Respect reduced motion + skip on coarse pointers (touch devices)
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isTouch = window.matchMedia('(pointer: coarse)').matches;
        if (reduce || isTouch) return undefined;

        const lenis = new Lenis({
            duration: 1.15,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            wheelMultiplier: 1,
            smoothWheel: true,
            smoothTouch: false,
        });

        let rafId;
        const raf = (time) => {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);
}
