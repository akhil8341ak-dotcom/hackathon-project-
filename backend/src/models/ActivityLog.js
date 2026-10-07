const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  incidentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incident',
    default: null,
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
