const mongoose = require('mongoose');
const Incident = require('../models/Incident');
const Resource = require('../models/Resource');
const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get complete command center dashboard statistics & feeds
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    // If DB is still connecting/seeding, return immediate command center initial state
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        kpis: {
          totalIncidents: 3,
          criticalIncidents: 1,
          resourcesAssigned: 2,
          resourcesTotal: 6,
          activeWorkflows: 2,
        },
        distributions: {
          severity: { Critical: 1, High: 1, Moderate: 1, Low: 0 },
          status: { Open: 1, InProgress: 1, Resolved: 1 },
        },
        criticalAlerts: [
          {
            _id: 'seed1',
            title: 'High-Altitude Flash Flood in Sector 9',
            location: 'Sector 9 - Water Intake Facility',
            severity: 'Critical',
            status: 'In Progress',
            summary: 'Rapid water level rise cutoff access road to Sector 9 intake station with personnel trapped on upper deck.',
          },
        ],
        recentActivity: [
          {
            _id: 'act1',
            action: 'AI Analysis Complete',
            description: 'AI classified incident as Critical severity. Task created & Heavy Rescue Unit assigned.',
            timestamp: new Date().toISOString(),
          },
        ],
      });
    }

    const totalIncidents = await Incident.countDocuments();
    const criticalIncidents = await Incident.countDocuments({ severity: 'Critical', status: { $ne: 'Resolved' } });

    const totalResources = await Resource.countDocuments();
    const assignedResources = await Resource.countDocuments({ status: 'Assigned' });

    const activeWorkflows = await Task.countDocuments({ status: { $ne: 'Completed' } });

    // Distributions
    const severityCounts = {
      Critical: await Incident.countDocuments({ severity: 'Critical' }),
      High: await Incident.countDocuments({ severity: 'High' }),
      Moderate: await Incident.countDocuments({ severity: 'Moderate' }),
      Low: await Incident.countDocuments({ severity: 'Low' }),
    };

    const statusCounts = {
      Open: await Incident.countDocuments({ status: 'Open' }),
      InProgress: await Incident.countDocuments({ status: 'In Progress' }),
      Resolved: await Incident.countDocuments({ status: 'Resolved' }),
    };

    // Critical Alerts Feed (Active Critical & High Incidents)
    const criticalAlerts = await Incident.find({
      severity: { $in: ['Critical', 'High'] },
      status: { $ne: 'Resolved' },
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent Activity Feed
    const recentActivity = await ActivityLog.find()
      .populate('incidentId', 'title severity')
      .sort({ timestamp: -1 })
      .limit(8);

    res.json({
      kpis: {
        totalIncidents,
        criticalIncidents,
        resourcesAssigned: assignedResources,
        resourcesTotal: totalResources,
        activeWorkflows,
      },
      distributions: {
        severity: severityCounts,
        status: statusCounts,
      },
      criticalAlerts,
      recentActivity,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
