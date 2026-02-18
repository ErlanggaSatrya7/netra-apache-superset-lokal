"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

export default function EchartNode({ option }: { option: any }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // Hanya setOption jika data series dan xAxis valid
    if (option && option.series && option.series.length > 0) {
      try {
        chartInstance.current.setOption(option, true); // true = force update
      } catch (err) {
        console.warn("ECharts_Pending_Data...");
      }
    }

    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [option]);

  return <div ref={chartRef} className="w-full h-full min-h-[300px]" />;
}
