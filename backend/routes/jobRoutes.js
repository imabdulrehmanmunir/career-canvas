const express = require('express');
const router = express.Router();
const { getJobs, setJob, updateJob, deleteJob } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware'); // The Bouncer


router.route('/').get(protect, getJobs).post(protect, setJob);

router.route('/:id').put(protect, updateJob).delete(protect, deleteJob);

module.exports = router;