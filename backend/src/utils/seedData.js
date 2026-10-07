const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Resource = require('../models/Resource');
const Incident = require('../models/Incident');
const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

async function seedData() {
  try {
    const userCount = await User.countDocuments();
    let managerUser, officerUser;

    if (userCount === 0) {
      console.log('🌱 Seeding initial user accounts...');
      const hashedPassword = await bcrypt.hash('password123', 10);

      managerUser = await User.create({
        name: 'Commander Sarah Jenkins',
        email: 'manager@opspilot.ai',
        password: hashedPassword,
        role: 'Operations Manager',
      });

      officerUser = await User.create({
        name: 'Officer Alex Rivera',
        email: 'officer@opspilot.ai',
        password: hashedPassword,
        role: 'Field Officer',
      });

      console.log('✅ Users seeded: manager@opspilot.ai & officer@opspilot.ai');
    } else {
      managerUser = await User.findOne({ email: 'manager@opspilot.ai' });
      officerUser = await User.findOne({ email: 'officer@opspilot.ai' });
    }

    const resourceCount = await Resource.countDocuments();
    if (resourceCount === 0) {
      console.log('🌱 Seeding operational resources...');
      await Resource.insertMany([
        { name: 'Response Team Alpha', type: 'Ground Response', status: 'Available' },
        { name: 'Emergency Medical Unit 1', type: 'Medical', status: 'Available' },
        { name: 'All-Terrain Transport Vehicle', type: 'Transport', status: 'Available' },
        { name: 'Rapid Communications Unit', type: 'Telecom', status: 'Available' },
        { name: 'Heavy Rescue Equipment Unit', type: 'Rescue', status: 'Available' },
        { name: 'Aerial Drone Recon Squad', type: 'Surveillance', status: 'Maintenance' },
      ]);
      console.log('✅ 6 Default operational resources seeded.');
    }

    const incidentCount = await Incident.countDocuments();
    if (incidentCount === 0 && managerUser) {
      console.log('🌱 Seeding initial command center incidents...');

      // Incident 1: Critical
      const inc1 = await Incident.create({
        title: 'High-Altitude Flash Flood in Sector 9',
        description: 'Sudden flash flood damaged perimeter fencing and isolated 3 field researchers near water intake station.',
        location: 'Sector 9 - Water Intake Facility',
        type: 'Environmental / Emergency',
        category: 'Environmental',
        severity: 'Critical',
        priority: 'High',
        summary: 'Rapid water level rise cutoff access road to Sector 9 intake station with personnel trapped on upper deck.',
        impact: 'High immediate risk of structural collapse and hypothermia to stranded personnel.',
        recommendedAction: '1. Dispatch Aerial Drone Recon Squad to confirm exact grid coordinates.\n2. Mobilize Heavy Rescue Unit for water extraction.',
        requiredResources: ['Heavy Rescue Equipment Unit', 'Aerial Drone Recon Squad'],
        assignedTeam: 'Heavy Rescue Equipment Unit',
        estimatedResponseTime: '20 minutes',
        status: 'In Progress',
        createdBy: managerUser._id,
      });

      await Task.create({
        incidentId: inc1._id,
        title: 'Execute Aerial Grid Recon & Deploy Rescue Line',
        assignedTeam: 'Heavy Rescue Equipment Unit',
        status: 'In Progress',
        priority: 'High',
      });

      await ActivityLog.create({
        incidentId: inc1._id,
        action: 'AI Analysis Complete',
        description: 'AI classified incident as Critical severity. Task created & Heavy Rescue Unit assigned.',
      });

      // Incident 2: High
      const inc2 = await Incident.create({
        title: 'Main Grid Power Failure at Substation Gamma',
        description: 'Unscheduled transformer trip caused power blackout across Sector 3 communications relay.',
        location: 'Sector 3 - Substation Gamma',
        type: 'Infrastructure',
        category: 'Infrastructure',
        severity: 'High',
        priority: 'High',
        summary: 'Relay station lost main line power, switching to emergency battery backup with 4 hours runtime.',
        impact: 'Tactical comms coverage down to 60% if generator fails to kick in.',
        recommendedAction: '1. Dispatch Rapid Communications Unit for mobile repeater backup.\n2. Send electrical team to inspect circuit breakers.',
        requiredResources: ['Rapid Communications Unit'],
        assignedTeam: 'Rapid Communications Unit',
        estimatedResponseTime: '15 minutes',
        status: 'Open',
        createdBy: officerUser ? officerUser._id : managerUser._id,
      });

      await Task.create({
        incidentId: inc2._id,
        title: 'Deploy Mobile Repeater Unit & Reset Breakers',
        assignedTeam: 'Rapid Communications Unit',
        status: 'Pending',
        priority: 'High',
      });

      await ActivityLog.create({
        incidentId: inc2._id,
        action: 'Incident Created',
        description: 'Substation Gamma power failure logged by Field Officer. Rapid Comms reserved.',
      });

      // Incident 3: Resolved
      const inc3 = await Incident.create({
        title: 'Chemical Containment Spill in Warehouse B',
        description: 'Minor hydraulic fluid leak during cargo unloading. Perimeter cleared and neutralized.',
        location: 'Warehouse B - Dock 4',
        type: 'Hazardous Materials',
        category: 'Hazmat',
        severity: 'Moderate',
        priority: 'Medium',
        summary: 'Containment team neutralized 50L hydraulic fluid leak using absorbent polymers.',
        impact: 'Hazard fully remediated. Dock 4 reopened for standard traffic.',
        recommendedAction: 'Complete final environmental air sweep and close report.',
        requiredResources: ['Response Team Alpha'],
        assignedTeam: 'Response Team Alpha',
        estimatedResponseTime: 'Resolved',
        status: 'Resolved',
        createdBy: managerUser._id,
      });

      await Task.create({
        incidentId: inc3._id,
        title: 'Apply Polymer Absorbent & Conduct Air Quality Sweep',
        assignedTeam: 'Response Team Alpha',
        status: 'Completed',
        priority: 'Medium',
        completedAt: new Date(),
      });

      await ActivityLog.create({
        incidentId: inc3._id,
        action: 'Incident Resolved',
        description: 'Warehouse B spill fully remediated. All resources released to Available.',
      });

      console.log('✅ 3 Initial operational incidents seeded.');
    }
  } catch (error) {
    console.error('❌ Error during data seeding:', error);
  }
}

module.exports = seedData;
