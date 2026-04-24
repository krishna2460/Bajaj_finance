const express = require('express');
const router = express.Router();
const analyticsService = require('../services/analyticsService');
const traversalService = require('../services/traversalService');

// Get graph statistics
router.get('/graph/:graphId', async (req, res, next) => {
  try {
    const stats = await analyticsService.getGraphStats(req.params.graphId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// Get node metrics
router.get('/metrics/:graphId', async (req, res, next) => {
  try {
    const metrics = await analyticsService.getNodeMetrics(req.params.graphId);
    res.json(metrics);
  } catch (error) {
    next(error);
  }
});

// Get depth distribution
router.get('/depth/:graphId', async (req, res, next) => {
  try {
    const distribution = await analyticsService.getDepthDistribution(req.params.graphId);
    res.json(distribution);
  } catch (error) {
    next(error);
  }
});

// Get node statistics
router.get('/node/:nodeId', async (req, res, next) => {
  try {
    const stats = await analyticsService.getNodeStats(req.params.nodeId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// DFS traversal
router.get('/traverse/dfs/:graphId/:startNodeId', async (req, res, next) => {
  try {
    const direction = req.query.direction || 'down';
    const result = await traversalService.dfs(
      req.params.graphId,
      req.params.startNodeId,
      direction
    );
    res.json({ algorithm: 'DFS', direction, result });
  } catch (error) {
    next(error);
  }
});

// BFS traversal
router.get('/traverse/bfs/:graphId/:startNodeId', async (req, res, next) => {
  try {
    const direction = req.query.direction || 'down';
    const result = await traversalService.bfs(
      req.params.graphId,
      req.params.startNodeId,
      direction
    );
    res.json({ algorithm: 'BFS', direction, result });
  } catch (error) {
    next(error);
  }
});

// Find all paths between nodes
router.get('/paths/all/:startNodeId/:endNodeId', async (req, res, next) => {
  try {
    const paths = await traversalService.findAllPaths(
      req.params.startNodeId,
      req.params.endNodeId
    );
    res.json({ startNodeId: req.params.startNodeId, endNodeId: req.params.endNodeId, paths });
  } catch (error) {
    next(error);
  }
});

// Find shortest path
router.get('/paths/shortest/:startNodeId/:endNodeId', async (req, res, next) => {
  try {
    const path = await traversalService.findShortestPath(
      req.params.startNodeId,
      req.params.endNodeId
    );
    res.json({ startNodeId: req.params.startNodeId, endNodeId: req.params.endNodeId, path });
  } catch (error) {
    next(error);
  }
});

// Get subtree
router.get('/subtree/:nodeId', async (req, res, next) => {
  try {
    const depth = parseInt(req.query.depth) || -1;
    const subtree = await traversalService.getSubtree(req.params.nodeId, depth);
    res.json(subtree);
  } catch (error) {
    next(error);
  }
});

// Get nodes by level
router.get('/level/:graphId/:level', async (req, res, next) => {
  try {
    const level = parseInt(req.params.level);
    const nodes = await traversalService.getNodesByLevel(req.params.graphId, level);
    res.json({ level, nodeCount: nodes.length, nodes });
  } catch (error) {
    next(error);
  }
});

// Get leaf nodes
router.get('/leaves/:graphId', async (req, res, next) => {
  try {
    const leaves = await traversalService.getLeafNodes(req.params.graphId);
    res.json({ graphId: req.params.graphId, leafCount: leaves.length, leaves });
  } catch (error) {
    next(error);
  }
});

// Get root nodes
router.get('/roots/:graphId', async (req, res, next) => {
  try {
    const roots = await traversalService.getRootNodes(req.params.graphId);
    res.json({ graphId: req.params.graphId, rootCount: roots.length, roots });
  } catch (error) {
    next(error);
  }
});

// Export graph data
router.get('/export/:graphId', async (req, res, next) => {
  try {
    const data = await analyticsService.exportGraphData(req.params.graphId);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
