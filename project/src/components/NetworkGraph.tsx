import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Network, InfectionStatus, Person } from '../types';

interface NetworkGraphProps {
  network: Network;
  width: number;
  height: number;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ network, width, height }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { people, links } = network;

  // Color mapping for infection states with gradients
  const getNodeColor = (status: InfectionStatus) => {
    switch (status) {
      case InfectionStatus.SUSCEPTIBLE: return 'url(#gradientGreen)';
      case InfectionStatus.EXPOSED: return 'url(#gradientYellow)';
      case InfectionStatus.INFECTIOUS: return 'url(#gradientRed)';
      case InfectionStatus.RECOVERED: return 'url(#gradientBlue)';
      default: return 'url(#gradientGray)';
    }
  };

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto;');

    // Define gradients
    const defs = svg.append('defs');

    // Green gradient for susceptible
    const gradientGreen = defs.append('radialGradient')
      .attr('id', 'gradientGreen')
      .attr('gradientUnits', 'objectBoundingBox');
    gradientGreen.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#86efac');
    gradientGreen.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#22c55e');

    // Yellow gradient for exposed
    const gradientYellow = defs.append('radialGradient')
      .attr('id', 'gradientYellow')
      .attr('gradientUnits', 'objectBoundingBox');
    gradientYellow.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#fde047');
    gradientYellow.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#eab308');

    // Red gradient for infectious
    const gradientRed = defs.append('radialGradient')
      .attr('id', 'gradientRed')
      .attr('gradientUnits', 'objectBoundingBox');
    gradientRed.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#fca5a5');
    gradientRed.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#dc2626');

    // Blue gradient for recovered
    const gradientBlue = defs.append('radialGradient')
      .attr('id', 'gradientBlue')
      .attr('gradientUnits', 'objectBoundingBox');
    gradientBlue.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#93c5fd');
    gradientBlue.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#2563eb');

    // Gray gradient for default
    const gradientGray = defs.append('radialGradient')
      .attr('id', 'gradientGray')
      .attr('gradientUnits', 'objectBoundingBox');
    gradientGray.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#e5e7eb');
    gradientGray.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#6b7280');

    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    // Create a group for the graph
    const g = svg.append('g');
    
    // Create the force simulation with adjusted parameters
    const simulation = d3.forceSimulation(people as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(links)
        .id((d: any) => d.id)
        .distance(50)
        .strength(0.5)
      )
      .force('charge', d3.forceManyBody()
        .strength(-100)
        .distanceMax(200)
      )
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(8))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05));
    
    // Create links with gradient effect
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#4b5563')
      .attr('stroke-opacity', d => Math.min(0.2 + d.strength / 2, 0.8))
      .attr('stroke-width', d => d.strength * 1.5);
    
    // Create nodes with gradient fills
    const node = g.append('g')
      .selectAll('circle')
      .data(people)
      .join('circle')
      .attr('r', 5)
      .attr('fill', d => getNodeColor(d.status))
      .attr('stroke', 'none')
      .call(drag(simulation) as any);
    
    // Add hover tooltip
    node.append('title')
      .text(d => `Person #${d.id}\nStatus: ${d.status}\nCommunity: ${d.community}`);
    
    // Update positions on each simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);
      
      node
        .attr('cx', d => Math.max(10, Math.min(width - 10, d.x as number)))
        .attr('cy', d => Math.max(10, Math.min(height - 10, d.y as number)));
    });

    // Heat up the simulation initially then cool it down
    simulation.alpha(1).restart();
    
    // Implement drag behavior
    function drag(simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [network, width, height]);

  return (
    <div className="rounded-lg overflow-hidden bg-gray-800">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
};

export default NetworkGraph;