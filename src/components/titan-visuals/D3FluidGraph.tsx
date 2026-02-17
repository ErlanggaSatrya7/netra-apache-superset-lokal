"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function D3FluidGraph({ data }: { data: any }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const width = 600;
    const height = 600;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const root = d3
      .hierarchy(data)
      .sum((d: any) => d.value)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const pack = d3.pack().size([width, height]).padding(3);
    const nodes = pack(root).descendants();

    const g = svg.append("g").attr("transform", `translate(0,0)`);

    const circle = g
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("fill", (d) => (d.children ? "#1e293b" : "#3b82f6"))
      .attr("fill-opacity", (d) => (d.children ? 0.1 : 0.6))
      .attr("stroke", (d) => (d.children ? "#334155" : "none"))
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", (d) => d.r)
      .style("cursor", "pointer")
      .on("mouseover", function () {
        d3.select(this).attr("stroke", "#60a5fa").attr("stroke-width", 2);
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke", (d: any) =>
          d.children ? "#334155" : "none"
        );
      });

    g.selectAll("text")
      .data(nodes.filter((d) => d.r > 20))
      .join("text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("text-anchor", "middle")
      .attr("fill", "#f8fafc")
      .style("font-size", (d) => Math.min(d.r / 3, 10))
      .style("font-weight", "900")
      .style("pointer-events", "none")
      .text((d) => d.data.name);
  }, [data]);

  return <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 600 600" />;
}
