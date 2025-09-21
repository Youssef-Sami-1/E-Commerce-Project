import React from 'react';

export default function HeartIcon({
  filled = false,
  className = '',
  strokeWidth = 1.8,
}: {
  filled?: boolean;
  className?: string;
  strokeWidth?: number;
}) {
  if (filled) {
    return (
      <svg
        className={className}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M11.645 20.91l-.01-.01C7.36 17.245 4.5 14.6 4.5 11.5 4.5 9.015 6.514 7 9 7c1.398 0 2.64.64 3.5 1.64C13.36 7.64 14.602 7 16 7c2.486 0 4.5 2.015 4.5 4.5 0 3.1-2.86 5.745-7.135 9.4l-.01.01a1 1 0 01-1.41 0z" />
      </svg>
    );
  }
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
      <path
        d="M16 7c-1.398 0-2.64.64-3.5 1.64C11.64 7.64 10.398 7 9 7 6.514 7 4.5 9.015 4.5 11.5c0 3.1 2.86 5.745 7.135 9.4l.01.01a1 1 0 001.41 0l.01-.01C18.64 17.245 21.5 14.6 21.5 11.5 21.5 9.015 19.486 7 17 7z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
