import React from 'react';

export default function UserIcon({ className = '', strokeWidth = 1.8 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M4 20c0-4.418 3.582-6 8-6s8 1.582 8 6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"/>
    </svg>
  );
}
