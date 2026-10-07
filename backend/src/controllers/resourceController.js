const Resource = require('../models/Resource');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all resources
// @route   GET /api/resources
// @access  Private
const getResources = async (req, res, next) => {
  try {
    const resources = await Resource.find().populate('assignedIncident', 'title severity location status');
    res.json(resources);
  } catch (error) {
    next(error);
  }
};

// @desc    Update resource status
// @route   PUT /api/resources/:id/status
// @access  Private
const updateResourceStatus = async (req, res, next) => {
  try {
    const { status, assignedIncident } = req.body;

    if (!['Available', 'Assigned', 'Maintenance'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    const oldStatus = resource.status;
    resource.status = status;
    if (assignedIncident !== undefined) {
      resource.assignedIncident = assignedIncident;
    } else if (status === 'Available' || status === 'Maintenance') {
      resource.assignedIncident = null;
    }

    await resource.save();

    await ActivityLog.create({
      action: 'Resource Status Change',
      description: `Resource "${resource.name}" changed from ${oldStatus} to ${status}.`,
    });

    res.json(resource);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new operational resource asset
// @route   POST /api/resources
// @access  Private
const createResource = async (req, res, next) => {
  try {
    const { name, type, status } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'Please provide resource name and type' });
    }

    const resource = await Resource.create({
      name,
      type,
      status: status || 'Available',
    });

    await ActivityLog.create({
      action: 'Resource Added',
      description: `New resource "${name}" (${type}) registered into fleet inventory.`,
    });

    res.status(201).json(resource);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getResources,
  updateResourceStatus,
  createResource,
};
