const Node = require('../models/Node');
const Edge = require('../models/Edge');

class TraversalService {
  // Depth-First Search (DFS)
  async dfs(graphId, startNodeId, direction = 'down') {
    const visited = new Set();
    const result = [];

    const traverse = async (nodeId) => {
      if (visited.has(nodeId.toString())) return;
      visited.add(nodeId.toString());

      const node = await Node.findById(nodeId);
      result.push({
        _id: node._id,
        label: node.label,
        externalId: node.externalId,
        depth: node.metadata.depth
      });

      if (direction === 'down') {
        for (const childId of node.children) {
          await traverse(childId);
        }
      } else if (direction === 'up') {
        for (const parentId of node.parents) {
          await traverse(parentId);
        }
      }
    };

    await traverse(startNodeId);
    return result;
  }

  // Breadth-First Search (BFS)
  async bfs(graphId, startNodeId, direction = 'down') {
    const visited = new Set();
    const result = [];
    const queue = [startNodeId];

    visited.add(startNodeId.toString());

    while (queue.length > 0) {
      const nodeId = queue.shift();
      const node = await Node.findById(nodeId);

      result.push({
        _id: node._id,
        label: node.label,
        externalId: node.externalId,
        depth: node.metadata.depth
      });

      const nextNodes = direction === 'down' ? node.children : node.parents;
      for (const nextId of nextNodes) {
        if (!visited.has(nextId.toString())) {
          visited.add(nextId.toString());
          queue.push(nextId);
        }
      }
    }

    return result;
  }

  // Find all paths between two nodes
  async findAllPaths(startNodeId, endNodeId) {
    const paths = [];
    const visited = new Set();

    const findPath = async (currentId, targetId, currentPath) => {
      if (currentId.toString() === targetId.toString()) {
        paths.push([...currentPath, currentId]);
        return;
      }

      if (visited.has(currentId.toString())) return;
      visited.add(currentId.toString());

      const node = await Node.findById(currentId);
      for (const childId of node.children) {
        await findPath(childId, targetId, [...currentPath, currentId]);
      }

      visited.delete(currentId.toString());
    };

    await findPath(startNodeId, endNodeId, []);
    return paths;
  }

  // Find shortest path using BFS
  async findShortestPath(startNodeId, endNodeId) {
    const visited = new Set();
    const queue = [[startNodeId]];
    visited.add(startNodeId.toString());

    while (queue.length > 0) {
      const path = queue.shift();
      const nodeId = path[path.length - 1];

      if (nodeId.toString() === endNodeId.toString()) {
        return path;
      }

      const node = await Node.findById(nodeId);
      for (const childId of node.children) {
        if (!visited.has(childId.toString())) {
          visited.add(childId.toString());
          queue.push([...path, childId]);
        }
      }
    }

    return null; // No path found
  }

  // Get subtree of a node
  async getSubtree(nodeId, depth = -1, currentDepth = 0) {
    if (depth !== -1 && currentDepth >= depth) return null;

    const node = await Node.findById(nodeId);
    const subtree = {
      _id: node._id,
      label: node.label,
      externalId: node.externalId,
      depth: node.metadata.depth,
      children: []
    };

    for (const childId of node.children) {
      const childSubtree = await this.getSubtree(childId, depth, currentDepth + 1);
      if (childSubtree) {
        subtree.children.push(childSubtree);
      }
    }

    return subtree;
  }

  // Get level-wise nodes
  async getNodesByLevel(graphId, level) {
    return await Node.find({ graphId, 'metadata.depth': level });
  }

  // Get all leaf nodes
  async getLeafNodes(graphId) {
    return await Node.find({ graphId, children: { $size: 0 } });
  }

  // Get all root nodes
  async getRootNodes(graphId) {
    return await Node.find({ graphId, parents: { $size: 0 } });
  }
}

module.exports = new TraversalService();
