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

  // Color mapping for infection states
  const getNodeColor = (status: InfectionStatus) => {
    switch (status) {
      case InfectionStatus.SUSCEPTIBLE: return '#4ade80'; // Green
      case InfectionStatus.EXPOSED: return '#facc15'; // Yellow
      case InfectionStatus.INFECTIOUS: return '#ef4444'; // Red
      case InfectionStatus.RECOVERED: return '#3b82f6'; // Blue
      default: return '#9ca3af'; // Gray
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
    
    // Create the force simulation
    const simulation = d3.forceSimulation(people as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(links)
        .id((d: any) => d.id)
        .distance(d => 50 * (1 - (d as any).strength))
      )
      .force('charge', d3.forceManyBody().strength(-30))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(5));
    
    // Create a group for links and append line elements
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', d => d.strength / 2)
      .attr('stroke-width', d => d.strength * 2);
    
    // Create a group for nodes and append circle elements
    const node = svg.append('g')
      .selectAll('circle')
      .data(people)
      .join('circle')
      .attr('r', 4)
      .attr('fill', d => getNodeColor(d.status))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
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
        .attr('cx', d => Math.max(5, Math.min(width - 5, d.x as number)))
        .attr('cy', d => Math.max(5, Math.min(height - 5, d.y as number)));
    });

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
    <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
};

export default NetworkGraph;