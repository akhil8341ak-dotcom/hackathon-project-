const Incident = require('../models/Incident');
const Task = require('../models/Task');
const Resource = require('../models/Resource');
const ActivityLog = require('../models/ActivityLog');
const { analyzeIncidentWithGemini, generateOperationalReport } = require('../services/geminiService');

// @desc    Create a new incident with AI analysis & auto orchestration
// @route   POST /api/incidents
// @access  Private
const createIncident = async (req, res, next) => {
  try {
    const { title, description, location, type } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ message: 'Please provide title, description, and location' });
    }

    console.log(`🤖 Triggering Gemini AI analysis for incident: "${title}"...`);

    // 1. AI Analysis
    const aiAnalysis = await analyzeIncidentWithGemini({
      title,
      description,
      location,
      type: type || 'General Operational',
    });

    // 2. Save Incident Document
    const newIncident = new Incident({
      title,
      description,
      location,
      type: type || 'General Operational',
      category: aiAnalysis.category || 'Operational',
      severity: aiAnalysis.severity || 'Moderate',
      priority: aiAnalysis.priority || 'Medium',
      summary: aiAnalysis.summary || '',
      impact: aiAnalysis.impact || '',
      recommendedAction: aiAnalysis.recommendedAction || '',
      requiredResources: aiAnalysis.requiredResources || [],
      assignedTeam: aiAnalysis.assignedTeam || 'Emergency Response Team Alpha',
      estimatedResponseTime: aiAnalysis.estimatedResponseTime || '30 minutes',
      status: 'Open',
      createdBy: req.user ? req.user._id : null,
      aiAnalysis: aiAnalysis,
    });

    const savedIncident = await newIncident.save();
    console.log(`✅ Incident saved with ID: ${savedIncident._id}`);

    // 3. Auto-create Task document tied to incident
    const task = await Task.create({
      incidentId: savedIncident._id,
      title: `Operational Action: ${title}`,
      assignedTeam: savedIncident.assignedTeam,
      status: 'Pending',
      priority: savedIncident.severity === 'Critical' ? 'High' : 'Medium',
    });

    // 4. Auto-reserve matching Available Resources
    const availableResources = await Resource.find({ status: 'Available' });
    let reservedResources = [];

    if (availableResources.length > 0) {
      // Try to match required resources or pick top available ones
      for (const resItem of availableResources) {
        const isMatched = savedIncident.requiredResources.some(
          rReq => rReq.toLowerCase().includes(resItem.name.toLowerCase()) ||
                  rReq.toLowerCase().includes(resItem.type.toLowerCase()) ||
                  resItem.name.toLowerCase().includes(savedIncident.assignedTeam.toLowerCase())
        );

        if (isMatched || reservedResources.length < 2) {
          resItem.status = 'Assigned';
          resItem.assignedIncident = savedIncident._id;
          await resItem.save();
          reservedResources.push(resItem.name);
          if (reservedResources.length >= 2) break;
        }
      }
    }

    // 5. Create ActivityLog entry
    await ActivityLog.create({
      incidentId: savedIncident._id,
      action: 'AI Analysis & Auto-Dispatch Complete',
      description: `AI assessment finalized. Task created for ${savedIncident.assignedTeam}. Resources reserved: [${reservedResources.join(', ') || 'Standard Dispatch'}].`,
    });

    // 6. Return populated response
    res.status(201).json(savedIncident);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all incidents (with optional status & severity filters)
// @route   GET /api/incidents
// @access  Private
const getIncidents = async (req, res, next) => {
  try {
    const { status, severity, search } = req.query;
    const filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (severity && severity !== 'All') {
      filter.severity = severity;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const incidents = await Incident.find(filter)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    res.json(incidents);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single incident details with tasks, activity logs, and assigned resources
// @route   GET /api/incidents/:id
// @access  Private
const getIncidentById = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id).populate('createdBy', 'name email role');

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    const tasks = await Task.find({ incidentId: incident._id });
    const activityLogs = await ActivityLog.find({ incidentId: incident._id }).sort({ timestamp: -1 });
    const assignedResources = await Resource.find({ assignedIncident: incident._id });

    res.json({
      incident,
      tasks,
      activityLogs,
      assignedResources,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update incident status (Open -> In Progress -> Resolved)
// @route   PUT /api/incidents/:id/status
// @access  Private
const updateIncidentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['Open', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    const oldStatus = incident.status;
    incident.status = status;
    await incident.save();

    // If resolved, update tasks and release resources
    if (status === 'Resolved') {
      await Task.updateMany(
        { incidentId: incident._id },
        { status: 'Completed', completedAt: new Date() }
      );

      await Resource.updateMany(
        { assignedIncident: incident._id },
        { status: 'Available', assignedIncident: null }
      );
    } else if (status === 'In Progress') {
      await Task.updateMany(
        { incidentId: incident._id, status: 'Pending' },
        { status: 'In Progress' }
      );
    }

    // Log Activity
    await ActivityLog.create({
      incidentId: incident._id,
      action: 'Status Update',
      description: `Incident status changed from "${oldStatus}" to "${status}" by ${req.user ? req.user.name : 'System'}.`,
    });

    res.json({ message: 'Status updated successfully', incident });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate Situational Command Report using Gemini
// @route   POST /api/incidents/:id/report
// @access  Private
const generateReport = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    const tasks = await Task.find({ incidentId: incident._id });
    const assignedResources = await Resource.find({ assignedIncident: incident._id });

    console.log(`📄 Generating AI Command Report for incident: ${incident.title}...`);

    const reportText = await generateOperationalReport(incident, assignedResources, tasks);

    incident.aiReport = reportText;
    await incident.save();

    await ActivityLog.create({
      incidentId: incident._id,
      action: 'Command Report Generated',
      description: `AI Operational Situational Briefing generated for executive review.`,
    });

    res.json({
      report: reportText,
      incident,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncidentStatus,
  generateReport,
};
