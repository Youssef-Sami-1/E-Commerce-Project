"use client";
import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={onClick}
      aria-label="Back to top"
      className={`fixed bottom-5 right-5 z-50 rounded-full border border-slate-200 bg-slate-100/60 backdrop-blur-md text-slate-900 shadow-sm hover:shadow-md hover:ring-2 hover:ring-slate-200/80 transition-all p-3 md:p-3.5 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-3"
      }`}
    >
      {/* Up arrow icon */}
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5l7 7M12 5L5 12M12 5v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}
