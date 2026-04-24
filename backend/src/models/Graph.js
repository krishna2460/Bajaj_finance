const mongoose = require('mongoose');

const graphSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['directed', 'undirected'],
    default: 'directed'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  stats: {
    nodeCount: { type: Number, default: 0 },
    edgeCount: { type: Number, default: 0 },
    maxDepth: { type: Number, default: 0 },
    isCyclic: { type: Boolean, default: false },
    lastUpdated: { type: Date, default: Date.now }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for efficient queries
graphSchema.index({ name: 1, createdAt: -1 });

module.exports = mongoose.model('Graph', graphSchema);
