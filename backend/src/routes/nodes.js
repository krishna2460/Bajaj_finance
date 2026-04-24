const express = require('express');
const router = express.Router();
const nodeService = require('../services/nodeService');
const graphService = require('../services/graphService');

// Create a new node
router.post('/', async (req, res, next) => {
  try {
    const { graphId, externalId, label, data, metadata } = req.body;
    const node = await nodeService.createNode(graphId, externalId, label, data, metadata);
    
    // Update graph stats
    await graphService.updateGraphStats(graphId);
    
    // Broadcast through WebSocket
    const io = req.app.get('io');
    if (io) {
      io.to(`graph-${graphId}`).emit('node-created', node);
    }
    
    res.status(201).json(node);
  } catch (error) {
    next(error);
  }
});

// Get nodes by graph
router.get('/', async (req, res, next) => {
  try {
    const graphId = req.query.graphId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    
    if (!graphId) {
      return res.status(400).json({ error: 'graphId is required' });
    }
    
    const result = await nodeService.getNodesByGraph(graphId, page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get node by ID
router.get('/:id', async (req, res, next) => {
  try {
    const node = await nodeService.getNode(req.params.id);
    if (!node) {
      return res.status(404).json({ error: 'Node not found' });
    }
    res.json(node);
  } catch (error) {
    next(error);
  }
});

// Update node
router.put('/:id', async (req, res, next) => {
  try {
    const node = await nodeService.updateNode(req.params.id, req.body);
    
    // Get graph ID and broadcast
    const graphId = node.graphId;
    const io = req.app.get('io');
    if (io) {
      io.to(`graph-${graphId}`).emit('node-updated', node);
    }
    
    res.json(node);
  } catch (error) {
    next(error);
  }
});

// Delete node
router.delete('/:id', async (req, res, next) => {
  try {
    const node = await nodeService.getNode(req.params.id);
    const graphId = node.graphId;
    
    await nodeService.deleteNode(req.params.id);
    await graphService.updateGraphStats(graphId);
    
    // Broadcast through WebSocket
    const io = req.app.get('io');
    if (io) {
      io.to(`graph-${graphId}`).emit('node-deleted', req.params.id);
    }
    
    res.json({ message: 'Node deleted', id: req.params.id });
  } catch (error) {
    next(error);
  }
});

// Get ancestors
router.get('/:id/ancestors', async (req, res, next) => {
  try {
    const ancestors = await nodeService.getAncestors(req.params.id);
    res.json({ nodeId: req.params.id, ancestors });
  } catch (error) {
    next(error);
  }
});

// Get descendants
router.get('/:id/descendants', async (req, res, next) => {
  try {
    const descendants = await nodeService.getDescendants(req.params.id);
    res.json({ nodeId: req.params.id, descendants });
  } catch (error) {
    next(error);
  }
});

// Get siblings
router.get('/:id/siblings', async (req, res, next) => {
  try {
    const siblings = await nodeService.getSiblings(req.params.id);
    res.json({ nodeId: req.params.id, siblings });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
