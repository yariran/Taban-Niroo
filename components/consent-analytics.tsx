"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";

const STORAGE_KEY = "tn:consent:v1";

/**
 * Mounts Vercel Analytics only after the visitor has explicitly accepted
 * first-party analytics cookies (`tn:consent:v1` = accept).
 */
export function ConsentAnalytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => {
      try {
        setAllowed(window.localStorage.getItem(STORAGE_KEY) === "accept");
      } catch {
        setAllowed(false);
      }
    };

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("tn:consent", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("tn:consent", sync);
    };
  }, []);

  if (!allowed) return null;
  return <Analytics />;
}
