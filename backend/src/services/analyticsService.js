const Node = require('../models/Node');
const Edge = require('../models/Edge');
const Graph = require('../models/Graph');

class AnalyticsService {
  // Get graph statistics
  async getGraphStats(graphId) {
    const graph = await Graph.findById(graphId);
    const nodeCount = await Node.countDocuments({ graphId });
    const edgeCount = await Edge.countDocuments({ graphId });

    const rootNodes = await Node.find({ graphId, parents: { $size: 0 } });
    const leafNodes = await Node.find({ graphId, children: { $size: 0 } });

    const nodes = await Node.find({ graphId });
    const depths = nodes.map(n => n.metadata.depth);
    const maxDepth = depths.length > 0 ? Math.max(...depths) : 0;
    const avgDepth = depths.length > 0 ? depths.reduce((a, b) => a + b, 0) / depths.length : 0;

    return {
      graphId,
      name: graph.name,
      nodeCount,
      edgeCount,
      rootNodeCount: rootNodes.length,
      leafNodeCount: leafNodes.length,
      maxDepth,
      avgDepth: avgDepth.toFixed(2),
      isCyclic: graph.stats.isCyclic,
      type: graph.type,
      createdAt: graph.createdAt,
      updatedAt: graph.updatedAt
    };
  }

  // Get node centrality metrics
  async getNodeMetrics(graphId) {
    const nodes = await Node.find({ graphId });
    const metrics = [];

    for (const node of nodes) {
      const inDegree = node.parents.length;
      const outDegree = node.children.length;
      const totalDegree = inDegree + outDegree;

      metrics.push({
        nodeId: node._id,
        label: node.label,
        externalId: node.externalId,
        inDegree,
        outDegree,
        totalDegree,
        depth: node.metadata.depth,
        isRoot: inDegree === 0,
        isLeaf: outDegree === 0
      });
    }

    return metrics.sort((a, b) => b.totalDegree - a.totalDegree);
  }

  // Get distribution by depth
  async getDepthDistribution(graphId) {
    const nodes = await Node.find({ graphId });
    const distribution = {};

    nodes.forEach(node => {
      const depth = node.metadata.depth;
      distribution[depth] = (distribution[depth] || 0) + 1;
    });

    return Object.entries(distribution)
      .map(([depth, count]) => ({ depth: parseInt(depth), count }))
      .sort((a, b) => a.depth - b.depth);
  }

  // Get node statistics
  async getNodeStats(nodeId) {
    const node = await Node.findById(nodeId);
    const ancestors = await Node.find({ _id: { $in: node.parents } });
    const descendants = await Node.find({ _id: { $in: node.children } });

    // Get all ancestors recursively
    const allAncestors = new Set(node.parents.map(p => p.toString()));
    const queue = [...node.parents];
    while (queue.length > 0) {
      const parentId = queue.shift();
      const parent = await Node.findById(parentId);
      if (parent) {
        parent.parents.forEach(gp => {
          if (!allAncestors.has(gp.toString())) {
            allAncestors.add(gp.toString());
            queue.push(gp);
          }
        });
      }
    }

    // Get all descendants recursively
    const allDescendants = new Set(node.children.map(c => c.toString()));
    const queue2 = [...node.children];
    while (queue2.length > 0) {
      const childId = queue2.shift();
      const child = await Node.findById(childId);
      if (child) {
        child.children.forEach(gc => {
          if (!allDescendants.has(gc.toString())) {
            allDescendants.add(gc.toString());
            queue2.push(gc);
          }
        });
      }
    }

    return {
      nodeId: node._id,
      label: node.label,
      depth: node.metadata.depth,
      directParentCount: node.parents.length,
      directChildCount: node.children.length,
      allAncestorsCount: allAncestors.size,
      allDescendantsCount: allDescendants.size,
      totalConnectedNodes: allAncestors.size + allDescendants.size + 1
    };
  }

  // Get path analysis
  async getPathAnalysis(sourceId, targetId) {
    // This would be enhanced with path analysis data
    return {
      sourceId,
      targetId,
      timestamp: new Date()
    };
  }

  // Export graph data
  async exportGraphData(graphId) {
    const graph = await Graph.findById(graphId);
    const nodes = await Node.find({ graphId });
    const edges = await Edge.find({ graphId });

    return {
      graph: {
        id: graph._id,
        name: graph.name,
        description: graph.description,
        type: graph.type,
        stats: graph.stats
      },
      nodes: nodes.map(n => ({
        id: n._id,
        externalId: n.externalId,
        label: n.label,
        data: n.data,
        metadata: n.metadata
      })),
      edges: edges.map(e => ({
        id: e._id,
        source: e.source,
        target: e.target,
        weight: e.weight,
        label: e.label,
        relationship: e.relationship
      }))
    };
  }
}

module.exports = new AnalyticsService();
