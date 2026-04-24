import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export const GraphVisualization = ({ nodes, edges, onNodeClick, selectedNodeId }) => {
  const svgRef = useRef()
  const containerRef = useRef()

  useEffect(() => {
    if (!nodes || nodes.length === 0 || !edges) return

    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove()

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)

    // Add arrowhead marker
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('markerWidth', 10)
      .attr('markerHeight', 10)
      .attr('refX', 9)
      .attr('refY', 3)
      .attr('orient', 'auto')
      .append('polygon')
      .attr('points', '0 0, 10 3, 0 6')
      .attr('fill', '#999')

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges)
        .id(d => d._id)
        .distance(100)
        .strength(0.5))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30))

    // Links
    const link = svg.append('g')
      .selectAll('line')
      .data(edges)
      .join('line')
      .attr('class', 'link')
      .attr('marker-end', 'url(#arrowhead)')

    // Nodes
    const nodeGroup = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'node-group')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))

    nodeGroup.append('circle')
      .attr('class', 'node-circle')
      .attr('r', 15)
      .attr('fill', d => d._id === selectedNodeId ? '#ff7f0e' : d.metadata?.color || '#1f77b4')
      .on('click', (event, d) => {
        event.stopPropagation()
        onNodeClick?.(d)
      })

    nodeGroup.append('text')
      .attr('class', 'node-label')
      .attr('dy', '.3em')
      .text(d => d.label?.substring(0, 1) || d.externalId?.substring(0, 1) || '?')
      .style('pointer-events', 'none')

    // Update positions
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      nodeGroup.attr('transform', d => `translate(${d.x},${d.y})`)
    })

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event, d) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    return () => {
      simulation.stop()
    }
  }, [nodes, edges, selectedNodeId, onNodeClick])

  return (
    <div ref={containerRef} className="graph-container w-full h-full">
      <svg ref={svgRef} className="graph-svg" />
    </div>
  )
}
