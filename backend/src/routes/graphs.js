const express = require('express');
const router = express.Router();
const graphService = require('../services/graphService');

// Create a new graph
router.post('/', async (req, res, next) => {
  try {
    const { name, description, type } = req.body;
    const graph = await graphService.createGraph(name, description, type);
    res.status(201).json(graph);
  } catch (error) {
    next(error);
  }
});

// Get all graphs
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await graphService.getAllGraphs(page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get graph by ID
router.get('/:id', async (req, res, next) => {
  try {
    const graph = await graphService.getGraph(req.params.id);
    if (!graph) {
      return res.status(404).json({ error: 'Graph not found' });
    }
    res.json(graph);
  } catch (error) {
    next(error);
  }
});

// Update graph
router.put('/:id', async (req, res, next) => {
  try {
    const { name, description, metadata } = req.body;
    const graph = await graphService.updateGraph(req.params.id, {
      name,
      description,
      metadata
    });
    
    // Broadcast update through WebSocket
    const io = req.app.get('io');
    if (io) {
      io.to(`graph-${req.params.id}`).emit('graph-updated', graph);
    }
    
    res.json(graph);
  } catch (error) {
    next(error);
  }
});

// Delete graph
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await graphService.deleteGraph(req.params.id);
    
    // Broadcast deletion through WebSocket
    const io = req.app.get('io');
    if (io) {
      io.to(`graph-${req.params.id}`).emit('graph-deleted', req.params.id);
    }
    
    res.json({ message: 'Graph deleted', id: req.params.id });
  } catch (error) {
    next(error);
  }
});

// Update graph statistics
router.post('/:id/refresh-stats', async (req, res, next) => {
  try {
    const graph = await graphService.updateGraphStats(req.params.id);
    
    // Broadcast stats update
    const io = req.app.get('io');
    if (io) {
      io.to(`graph-${req.params.id}`).emit('stats-updated', graph.stats);
    }
    
    res.json(graph);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
