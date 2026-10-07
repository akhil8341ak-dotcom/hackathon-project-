const express = require('express');
const router = express.Router();
const {
  getResources,
  updateResourceStatus,
  createResource,
} = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getResources);
router.post('/', createResource);
router.put('/:id/status', updateResourceStatus);

module.exports = router;
