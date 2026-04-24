const Graph = require('../models/Graph');
const Node = require('../models/Node');
const Edge = require('../models/Edge');

class GraphService {
  // Create a new graph
  async createGraph(name, description = '', type = 'directed') {
    const graph = new Graph({
      name,
      description,
      type,
      stats: {
        nodeCount: 0,
        edgeCount: 0,
        maxDepth: 0,
        isCyclic: false
      }
    });
    return await graph.save();
  }

  // Get graph by ID
  async getGraph(graphId) {
    return await Graph.findById(graphId);
  }

  // Get all graphs with pagination
  async getAllGraphs(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const graphs = await Graph.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await Graph.countDocuments();
    return { graphs, total, pages: Math.ceil(total / limit) };
  }

  // Update graph
  async updateGraph(graphId, updates) {
    return await Graph.findByIdAndUpdate(
      graphId,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
  }

  // Delete graph and associated data
  async deleteGraph(graphId) {
    await Node.deleteMany({ graphId });
    await Edge.deleteMany({ graphId });
    return await Graph.findByIdAndDelete(graphId);
  }

  // Update graph statistics
  async updateGraphStats(graphId) {
    const nodeCount = await Node.countDocuments({ graphId });
    const edgeCount = await Edge.countDocuments({ graphId });
    
    // Calculate max depth
    const maxDepthNode = await Node.findOne({ graphId })
      .sort({ 'metadata.depth': -1 });
    const maxDepth = maxDepthNode ? maxDepthNode.metadata.depth : 0;

    // Check for cycles
    const isCyclic = await this.detectCycles(graphId);

    return await Graph.findByIdAndUpdate(
      graphId,
      {
        'stats.nodeCount': nodeCount,
        'stats.edgeCount': edgeCount,
        'stats.maxDepth': maxDepth,
        'stats.isCyclic': isCyclic,
        'stats.lastUpdated': new Date()
      },
      { new: true }
    );
  }

  // Detect cycles using DFS
  async detectCycles(graphId) {
    const nodes = await Node.find({ graphId });
    const edges = await Edge.find({ graphId });
    
    if (nodes.length === 0) return false;

    const adjList = {};
    nodes.forEach(node => {
      adjList[node._id.toString()] = [];
    });

    edges.forEach(edge => {
      adjList[edge.source.toString()].push(edge.target.toString());
    });

    const visited = {};
    const recStack = {};

    const hasCycleDFS = (nodeId) => {
      visited[nodeId] = true;
      recStack[nodeId] = true;

      for (const neighbor of adjList[nodeId]) {
        if (!visited[neighbor]) {
          if (hasCycleDFS(neighbor)) return true;
        } else if (recStack[neighbor]) {
          return true;
        }
      }

      recStack[nodeId] = false;
      return false;
    };

    for (const nodeId of Object.keys(adjList)) {
      if (!visited[nodeId]) {
        if (hasCycleDFS(nodeId)) return true;
      }
    }

    return false;
  }
}

module.exports = new GraphService();
