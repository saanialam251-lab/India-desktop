import { useEffect } from "react";

// Locks body scroll while a modal is open (mobile-friendly).
export function useScrollLock() {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);
}
