"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function PageEffects() {
  const hasIntroRun = useRef(false);
  const pathname = usePathname();

  // Run intro overlay hide only once on first mount
  useEffect(() => {
    if (hasIntroRun.current) return;
    hasIntroRun.current = true;
    const overlay = document.getElementById("page-transition-overlay");
    if (overlay) {
      requestAnimationFrame(() => {
        overlay.classList.add("hidden");
      });
    }
  }, []);

  // Re-initialize scroll reveal on route changes
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal-up, .stagger"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target as Element);
          }
        });
      },
      { rootMargin: "0px 0px -5% 0px", threshold: 0.0 }
    );
    els.forEach((el) => {
      io.observe(el);
    });
    // Watch for dynamically added nodes that need reveal behavior
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          const candidates: HTMLElement[] = [];
          if (node.matches?.(".reveal-up, .stagger")) candidates.push(node);
          candidates.push(...Array.from(node.querySelectorAll<HTMLElement>(".reveal-up, .stagger")));
          candidates.forEach((el) => {
            io.observe(el);
          });
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return (
    <div id="page-transition-overlay" className="page-transition" aria-hidden="true" role="presentation" />
  );
}
