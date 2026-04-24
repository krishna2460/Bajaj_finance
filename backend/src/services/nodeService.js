const Node = require('../models/Node');
const Edge = require('../models/Edge');

class NodeService {
  // Create a new node
  async createNode(graphId, externalId, label, data = {}, metadata = {}) {
    const node = new Node({
      graphId,
      externalId,
      label,
      data,
      metadata: {
        depth: 0,
        color: '#1f77b4',
        size: 20,
        ...metadata
      }
    });
    return await node.save();
  }

  // Get node by ID
  async getNode(nodeId) {
    return await Node.findById(nodeId)
      .populate('parents', 'label externalId')
      .populate('children', 'label externalId');
  }

  // Get nodes by graph ID
  async getNodesByGraph(graphId, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const nodes = await Node.find({ graphId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await Node.countDocuments({ graphId });
    return { nodes, total, pages: Math.ceil(total / limit) };
  }

  // Update node
  async updateNode(nodeId, updates) {
    return await Node.findByIdAndUpdate(
      nodeId,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
  }

  // Delete node
  async deleteNode(nodeId) {
    // Remove all edges connected to this node
    await Edge.deleteMany({ $or: [{ source: nodeId }, { target: nodeId }] });
    
    // Remove from parents' children lists
    await Node.updateMany(
      { children: nodeId },
      { $pull: { children: nodeId } }
    );
    
    // Remove from children's parents lists
    await Node.updateMany(
      { parents: nodeId },
      { $pull: { parents: nodeId } }
    );
    
    return await Node.findByIdAndDelete(nodeId);
  }

  // Add parent relationship
  async addParent(nodeId, parentId) {
    await Node.findByIdAndUpdate(
      nodeId,
      { $addToSet: { parents: parentId } }
    );
    return await Node.findByIdAndUpdate(
      parentId,
      { $addToSet: { children: nodeId } },
      { new: true }
    );
  }

  // Remove parent relationship
  async removeParent(nodeId, parentId) {
    await Node.findByIdAndUpdate(
      nodeId,
      { $pull: { parents: parentId } }
    );
    return await Node.findByIdAndUpdate(
      parentId,
      { $pull: { children: nodeId } },
      { new: true }
    );
  }

  // Get all ancestors
  async getAncestors(nodeId) {
    const ancestors = [];
    const visited = new Set();

    const traverse = async (currentNodeId) => {
      if (visited.has(currentNodeId.toString())) return;
      visited.add(currentNodeId.toString());

      const node = await Node.findById(currentNodeId).populate('parents');
      if (!node || !node.parents) return;

      for (const parent of node.parents) {
        ancestors.push({
          _id: parent._id,
          label: parent.label,
          externalId: parent.externalId
        });
        await traverse(parent._id);
      }
    };

    await traverse(nodeId);
    return ancestors;
  }

  // Get all descendants
  async getDescendants(nodeId) {
    const descendants = [];
    const visited = new Set();

    const traverse = async (currentNodeId) => {
      if (visited.has(currentNodeId.toString())) return;
      visited.add(currentNodeId.toString());

      const node = await Node.findById(currentNodeId).populate('children');
      if (!node || !node.children) return;

      for (const child of node.children) {
        descendants.push({
          _id: child._id,
          label: child.label,
          externalId: child.externalId
        });
        await traverse(child._id);
      }
    };

    await traverse(nodeId);
    return descendants;
  }

  // Get siblings (nodes with same parent)
  async getSiblings(nodeId) {
    const node = await Node.findById(nodeId).populate('parents');
    if (!node || node.parents.length === 0) return [];

    const siblings = new Set();
    for (const parent of node.parents) {
      const parentNode = await Node.findById(parent._id).populate('children');
      for (const child of parentNode.children) {
        if (child._id.toString() !== nodeId) {
          siblings.add(JSON.stringify({
            _id: child._id,
            label: child.label,
            externalId: child.externalId
          }));
        }
      }
    }

    return Array.from(siblings).map(s => JSON.parse(s));
  }

  // Update depth metadata
  async updateDepth(nodeId, depth) {
    return await Node.findByIdAndUpdate(
      nodeId,
      { 'metadata.depth': depth, updatedAt: new Date() },
      { new: true }
    );
  }
}

module.exports = new NodeService();
