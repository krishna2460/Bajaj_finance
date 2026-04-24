const express = require('express');
const router = express.Router();
const edgeService = require('../services/edgeService');
const graphService = require('../services/graphService');

// Create edge
router.post('/', async (req, res, next) => {
  try {
    const { graphId, sourceId, targetId, weight, label, relationship } = req.body;
    const edge = await edgeService.createEdge(
      graphId,
      sourceId,
      targetId,
      weight,
      label,
      relationship
    );
    
    // Update graph stats
    await graphService.updateGraphStats(graphId);
    
    // Broadcast through WebSocket
    const io = req.app.get('io');
    if (io) {
      io.to(`graph-${graphId}`).emit('edge-created', edge);
    }
    
    res.status(201).json(edge);
  } catch (error) {
    next(error);
  }
});

// Get edges by graph
router.get('/', async (req, res, next) => {
  try {
    const graphId = req.query.graphId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    
    if (!graphId) {
      return res.status(400).json({ error: 'graphId is required' });
    }
    
    const result = await edgeService.getEdgesByGraph(graphId, page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get edge by ID
router.get('/:id', async (req, res, next) => {
  try {
    const edge = await edgeService.getEdge(req.params.id);
    if (!edge) {
      return res.status(404).json({ error: 'Edge not found' });
    }
    res.json(edge);
  } catch (error) {
    next(error);
  }
});

// Delete edge
router.delete('/:id', async (req, res, next) => {
  try {
    const edge = await edgeService.getEdge(req.params.id);
    const graphId = edge.graphId;
    
    await edgeService.deleteEdge(req.params.id);
    await graphService.updateGraphStats(graphId);
    
    // Broadcast through WebSocket
    const io = req.app.get('io');
    if (io) {
      io.to(`graph-${graphId}`).emit('edge-deleted', req.params.id);
    }
    
    res.json({ message: 'Edge deleted', id: req.params.id });
  } catch (error) {
    next(error);
  }
});

// Get incoming edges for a node
router.get('/incoming/:nodeId', async (req, res, next) => {
  try {
    const edges = await edgeService.getIncomingEdges(req.params.nodeId);
    res.json(edges);
  } catch (error) {
    next(error);
  }
});

// Get outgoing edges for a node
router.get('/outgoing/:nodeId', async (req, res, next) => {
  try {
    const edges = await edgeService.getOutgoingEdges(req.params.nodeId);
    res.json(edges);
  } catch (error) {
    next(error);
  }
});

// Update edge weight
router.patch('/:id/weight', async (req, res, next) => {
  try {
    const { weight } = req.body;
    const edge = await edgeService.updateEdgeWeight(req.params.id, weight);
    res.json(edge);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
