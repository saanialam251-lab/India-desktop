import { useEffect, useRef, useState } from "react";
// True once the element has scrolled into view (used to start entrance animations when the fan actually sees them).
export function useReveal(dep) {
  const ref = useRef(null), [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el || seen) return;
    if (typeof IntersectionObserver === "undefined") { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.06 });
    io.observe(el); return () => io.disconnect();
  }, [seen, dep]);
  return [ref, seen];
}
// Stops the page behind a pop-up from scrolling while the pop-up is open.
export function useScrollLock() {
  useEffect(() => {
    const h = document.documentElement, b = document.body, ph = h.style.overflow, pb = b.style.overflow;
    h.style.overflow = "hidden"; b.style.overflow = "hidden";
    return () => { h.style.overflow = ph; b.style.overflow = pb; };
  }, []);
}
