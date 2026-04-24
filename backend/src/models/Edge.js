const mongoose = require('mongoose');

const edgeSchema = new mongoose.Schema({
  graphId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Graph',
    required: true,
    index: true
  },
  source: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Node',
    required: true,
    index: true
  },
  target: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Node',
    required: true,
    index: true
  },
  weight: {
    type: Number,
    default: 1
  },
  label: {
    type: String,
    default: ''
  },
  relationship: {
    type: String,
    default: 'parent-child'
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
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

// Index for efficient traversal queries
edgeSchema.index({ graphId: 1, source: 1, target: 1 }, { unique: true });
edgeSchema.index({ graphId: 1, source: 1 });
edgeSchema.index({ graphId: 1, target: 1 });

module.exports = mongoose.model('Edge', edgeSchema);
