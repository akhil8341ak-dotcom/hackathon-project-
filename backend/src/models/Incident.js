const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  type: {
    type: String,
    default: 'General Operational',
  },
  category: {
    type: String,
    default: 'Unclassified',
  },
  severity: {
    type: String,
    enum: ['Critical', 'High', 'Moderate', 'Low'],
    default: 'Moderate',
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
  },
  summary: {
    type: String,
    default: '',
  },
  impact: {
    type: String,
    default: '',
  },
  recommendedAction: {
    type: String,
    default: '',
  },
  requiredResources: [{
    type: String,
  }],
  assignedTeam: {
    type: String,
    default: 'Unassigned',
  },
  estimatedResponseTime: {
    type: String,
    default: 'Pending Assessment',
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved'],
    default: 'Open',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  aiAnalysis: {
    type: Object,
    default: {},
  },
  aiReport: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

IncidentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Incident', IncidentSchema);
