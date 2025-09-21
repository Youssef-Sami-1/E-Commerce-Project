"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * HeaderSpacer renders a spacer div with the same height as the fixed header,
 * so content below doesn't overlap. It is disabled on the Home page ('/').
 */
export default function HeaderSpacer() {
  const pathname = usePathname();
  const [h, setH] = useState<number>(0);

  useEffect(() => {
    const readHeaderH = () => {
      const root = getComputedStyle(document.documentElement);
      const varVal = root.getPropertyValue("--header-h");
      const parsed = parseInt(varVal || "0", 10);
      setH(isNaN(parsed) ? 88 : parsed);
    };
    readHeaderH();
    window.addEventListener("resize", readHeaderH);
    return () => window.removeEventListener("resize", readHeaderH);
  }, []);

  // Do not render spacer on Home; we want the header overlaying the hero there
  if (pathname === "/") return null;

  return <div aria-hidden style={{ height: h }} />;
}
