const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['academic', 'extracurricular', 'achievement', 'certification', 'project'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  startDate: Date,
  endDate: Date,
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  metrics: {
    score: Number,
    timeSpent: Number,
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard']
    }
  },
  feedback: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comment: String,
    rating: Number,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  tags: [String]
}, {
  timestamps: true
});

// Index for better search performance
activitySchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Activity', activitySchema);
