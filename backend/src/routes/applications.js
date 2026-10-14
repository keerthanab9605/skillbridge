const router = require('express').Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const wrap = require('../middleware/wrap');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);

// Student: apply
router.post('/job/:jobId', restrictTo('student'), wrap(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job || !job.isActive) return res.status(404).json({ message: 'Job not available' });
  if (await Application.exists({ job: job._id, student: req.user.id })) return res.status(409).json({ message: 'You already applied to this job' });
  const application = await Application.create({ job: job._id, student: req.user.id, coverNote: req.body.coverNote });
  res.status(201).json({ application });
}));

// Student: my applications
router.get('/mine', restrictTo('student'), wrap(async (req, res) => {
  const applications = await Application.find({ student: req.user.id }).populate('job', 'title company location type').sort({ createdAt: -1 });
  res.json({ applications: applications.filter((a) => a.job) });
}));

// Student: withdraw
router.delete('/:id', restrictTo('student'), wrap(async (req, res) => {
  const a = await Application.findOneAndDelete({ _id: req.params.id, student: req.user.id });
  if (!a) return res.status(404).json({ message: 'Application not found' });
  res.json({ message: 'Application withdrawn' });
}));

// Recruiter: applicants of own job
router.get('/job/:jobId', restrictTo('recruiter', 'admin'), wrap(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  if (req.user.role !== 'admin' && String(job.postedBy) !== req.user.id) return res.status(403).json({ message: 'Not your listing' });
  const applications = await Application.find({ job: job._id }).populate('student', 'name email headline skills education resumeUrl').sort({ createdAt: -1 });
  res.json({ applications });
}));

// Recruiter: update status
router.patch('/:id/status', restrictTo('recruiter', 'admin'), wrap(async (req, res) => {
  const a = await Application.findById(req.params.id).populate('job');
  if (!a) return res.status(404).json({ message: 'Application not found' });
  if (req.user.role !== 'admin' && String(a.job.postedBy) !== req.user.id) return res.status(403).json({ message: 'Not your listing' });
  a.status = req.body.status;
  await a.save();
  res.json({ application: a });
}));

module.exports = router;
