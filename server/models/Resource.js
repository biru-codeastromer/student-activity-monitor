const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['document', 'video', 'link', 'assignment', 'project', 'announcement'],
    required: true
  },
  category: {
    type: String,
    enum: ['study_material', 'event', 'workshop', 'competition', 'other'],
    required: true
  },
  content: {
    url: String,
    text: String,
    fileType: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetAudience: [{
    type: String,
    enum: ['all', 'juniors', 'seniors', 'faculty']
  }],
  visibility: {
    type: String,
    enum: ['public', 'private', 'restricted'],
    default: 'public'
  },
  accessList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [String],
  metadata: {
    size: Number,
    duration: Number,
    format: String
  },
  stats: {
    views: {
      type: Number,
      default: 0
    },
    downloads: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    }
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  expiryDate: Date
}, {
  timestamps: true
});

// Index for better search performance
resourceSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Resource', resourceSchema);
