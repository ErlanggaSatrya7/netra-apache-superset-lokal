"use client";

import React, { useRef, useEffect } from "react";
import * as echarts from "echarts";
import { cn } from "@/lib/utils";

interface EChartNodeProps {
  option: any;
  className?: string;
  theme?: "dark" | "light";
}

/**
 * TITAN ECHARTS WRAPPER v31.0
 * Logic: Auto-Resize & Layout-Sync Handshake
 */
export default function EchartNode({
  option,
  className,
  theme = "dark",
}: EChartNodeProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Initialize if not exists
      if (!chartInstance.current) {
        chartInstance.current = echarts.init(chartRef.current, theme);
      }
      chartInstance.current.setOption(option);
    }

    // Zero-Spill Strategy: Resize chart when window or container change
    const resizeObserver = new ResizeObserver(() => {
      chartInstance.current?.resize();
    });

    if (chartRef.current) resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [option, theme]);

  return (
    <div
      ref={chartRef}
      className={cn("w-full h-full min-h-[350px] transition-all", className)}
    />
  );
}
