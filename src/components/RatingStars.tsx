"use client";
import React from "react";

type Props = {
  value?: number; // 0..5
  count?: number;
  className?: string;
};

export default function RatingStars({ value = 0, count, className }: Props) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  const stars: React.ReactNode[] = [];
  for (let i = 0; i < full; i++) stars.push(<Star key={`f${i}`} type="full" />);
  if (half) stars.push(<Star key="half" type="half" />);
  for (let i = 0; i < empty; i++) stars.push(<Star key={`e${i}`} type="empty" />);
  return (
    <div className={"inline-flex items-center gap-1 " + (className || "")}
         title={count != null ? `${value} (${count})` : String(value)}>
      {stars}
      {count != null && <span className="ml-1 text-sm text-slate-600">({count})</span>}
    </div>
  );
}

function Star({ type }: { type: "full" | "half" | "empty" }) {
  const color = type === "empty" ? "#CBD5E1" : "#0F172A"; // slate-300 vs slate-900
  if (type === "half") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
        <defs>
          <linearGradient id="half">
            <stop offset="50%" stopColor="#0F172A" />
            <stop offset="50%" stopColor="#CBD5E1" />
          </linearGradient>
        </defs>
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="url(#half)" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill={color} />
    </svg>
  );
}
