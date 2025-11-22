const Job = require('../models/jobModel');

const getJobs = async (req, res) => {
  // Only find jobs that belong to the logged-in user
  const jobs = await Job.find({ user: req.user.id });
  res.status(200).json(jobs);
};

const setJob = async (req, res) => {
  if (!req.body.company || !req.body.position) {
    res.status(400).json({ message: 'Please add company and position' });
    return;
  }

  const job = await Job.create({
    company: req.body.company,
    position: req.body.position,
    status: req.body.status || 'Applied',
    user: req.user.id, // Attach the user ID automatically
  });

  res.status(200).json(job);
};

const updateJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(400).json({ message: 'Job not found' });
    return;
  }

  // Check if user matches the job owner
  if (job.user.toString() !== req.user.id) {
    res.status(401).json({ message: 'User not authorized' });
    return;
  }

  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedJob);
};

const deleteJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(400).json({ message: 'Job not found' });
    return;
  }

  if (job.user.toString() !== req.user.id) {
    res.status(401).json({ message: 'User not authorized' });
    return;
  }

  await job.deleteOne();
  res.status(200).json({ id: req.params.id });
};

module.exports = {
  getJobs,
  setJob,
  updateJob,
  deleteJob,
};