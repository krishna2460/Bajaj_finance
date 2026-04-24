const Node = require('../models/Node');
const Edge = require('../models/Edge');
const Graph = require('../models/Graph');

class EdgeService {
  // Create edge
  async createEdge(graphId, sourceId, targetId, weight = 1, label = '', relationship = 'parent-child') {
    const edge = new Edge({
      graphId,
      source: sourceId,
      target: targetId,
      weight,
      label,
      relationship
    });

    // Update parent-child relationships
    await Node.findByIdAndUpdate(sourceId, { $addToSet: { children: targetId } });
    await Node.findByIdAndUpdate(targetId, { $addToSet: { parents: sourceId } });

    return await edge.save();
  }

  // Get edge by ID
  async getEdge(edgeId) {
    return await Edge.findById(edgeId)
      .populate('source', 'label externalId')
      .populate('target', 'label externalId');
  }

  // Get edges by graph
  async getEdgesByGraph(graphId, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const edges = await Edge.find({ graphId })
      .populate('source', 'label externalId')
      .populate('target', 'label externalId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Edge.countDocuments({ graphId });
    return { edges, total, pages: Math.ceil(total / limit) };
  }

  // Delete edge
  async deleteEdge(edgeId) {
    const edge = await Edge.findById(edgeId);
    
    // Update node relationships
    await Node.findByIdAndUpdate(edge.source, { $pull: { children: edge.target } });
    await Node.findByIdAndUpdate(edge.target, { $pull: { parents: edge.source } });

    return await Edge.findByIdAndDelete(edgeId);
  }

  // Get incoming edges
  async getIncomingEdges(nodeId) {
    return await Edge.find({ target: nodeId })
      .populate('source', 'label externalId');
  }

  // Get outgoing edges
  async getOutgoingEdges(nodeId) {
    return await Edge.find({ source: nodeId })
      .populate('target', 'label externalId');
  }

  // Update edge weight
  async updateEdgeWeight(edgeId, weight) {
    return await Edge.findByIdAndUpdate(
      edgeId,
      { weight, updatedAt: new Date() },
      { new: true }
    );
  }
}

module.exports = new EdgeService();
