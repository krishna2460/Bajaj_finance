const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  graphId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Graph',
    required: true,
    index: true
  },
  externalId: {
    type: String,
    required: true,
    index: true
  },
  label: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  metadata: {
    depth: { type: Number, default: 0 },
    color: { type: String, default: '#1f77b4' },
    size: { type: Number, default: 20 }
  },
  parents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Node',
    index: true
  }],
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Node',
    index: true
  }],
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

// Compound index for efficient lookups
nodeSchema.index({ graphId: 1, externalId: 1 }, { unique: true });
nodeSchema.index({ graphId: 1, depth: 1 });

module.exports = mongoose.model('Node', nodeSchema);
