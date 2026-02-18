"use client";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function D3FluidGraph({ data }: { data: any[] }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Mapping Region sebagai Node
    const regions = Array.from(
      new Set(data.map((d) => d.city?.state?.region || "Unknown"))
    );
    const nodes = regions.map((name, i) => ({ id: name, group: i }));
    const links: any[] = nodes.map((n, i) => ({
      source: n.id,
      target: nodes[(i + 1) % nodes.length].id,
    }));

    // Tooltip Element
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "#0d121b")
      .style("color", "#00f2ff")
      .style("padding", "8px 12px")
      .style("border", "1px solid #1e293b")
      .style("border-radius", "8px")
      .style("font-size", "10px")
      .style("pointer-events", "none")
      .style("visibility", "hidden")
      .style("z-index", "9999");

    const simulation = d3
      .forceSimulation(nodes as any)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(120)
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append("g")
      .attr("stroke", "#3b82f6")
      .attr("stroke-opacity", 0.3)
      .selectAll("line")
      .data(links)
      .join("line");

    const node = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 12)
      .attr("fill", "#00f2ff")
      .attr("stroke", "#fff")
      .on("mouseover", (e, d: any) => {
        tooltip
          .style("visibility", "visible")
          .html(`REGION: ${d.id}<br/>STATUS: STABLE_NODE`);
      })
      .on("mousemove", (e) => {
        tooltip
          .style("top", e.pageY - 20 + "px")
          .style("left", e.pageX + 20 + "px");
      })
      .on("mouseout", () => tooltip.style("visibility", "hidden"));

    const label = svg
      .append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d: any) => d.id)
      .attr("font-size", "9px")
      .attr("fill", "#4d5d7e")
      .attr("dy", -20)
      .attr("text-anchor", "middle");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
      label.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y);
    });

    return () => {
      tooltip.remove();
    };
  }, [data]);

  return <svg ref={svgRef} className="w-full h-full" />;
}
