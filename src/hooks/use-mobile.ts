"use client";

import { useState, useEffect } from "react";

/**
 * TITAN VIEWPORT DETECTOR v32.9
 * Fix: Export naming sync to prevent Build Error
 */
export function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < breakpoint);
      // Trigger resize event untuk memaksa Re-render ECharts & D3
      window.dispatchEvent(new Event("resize"));
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, [breakpoint]);

  return isMobile;
}
