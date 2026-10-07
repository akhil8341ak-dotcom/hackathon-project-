const express = require('express');
const router = express.Router();
const {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncidentStatus,
  generateReport,
} = require('../controllers/incidentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createIncident);
router.get('/', getIncidents);
router.get('/:id', getIncidentById);
router.put('/:id/status', updateIncidentStatus);
router.post('/:id/report', generateReport);

module.exports = router;
