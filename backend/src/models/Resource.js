const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Resource name is required'],
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Resource type is required'],
  },
  status: {
    type: String,
    enum: ['Available', 'Assigned', 'Maintenance'],
    default: 'Available',
  },
  assignedIncident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incident',
    default: null,
  },
});

module.exports = mongoose.model('Resource', ResourceSchema);
