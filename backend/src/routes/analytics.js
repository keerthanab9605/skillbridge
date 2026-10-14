const router = require('express').Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const wrap = require('../middleware/wrap');
const { protect } = require('../middleware/auth');

const byStatus = async (match) => {
  const rows = await Application.aggregate([{ $match: match }, { $group: { _id: '$status', n: { $sum: 1 } } }]);
  return Object.fromEntries(rows.map((r) => [r._id, r.n]));
};
const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);

router.get('/', protect, wrap(async (req, res) => {
  const { role } = req.user;
  if (role === 'student') {
    const status = await byStatus({ student: req.user._id });
    return res.json({ role, total: sum(status), status, saved: req.user.savedJobs.length });
  }
  if (role === 'recruiter') {
    const jobs = await Job.find({ postedBy: req.user._id }).select('_id');
    const status = await byStatus({ job: { $in: jobs.map((j) => j._id) } });
    return res.json({ role, jobs: jobs.length, total: sum(status), status });
  }
  const [students, recruiters, jobs, status] = await Promise.all([
    User.countDocuments({ role: 'student' }), User.countDocuments({ role: 'recruiter' }), Job.countDocuments(), byStatus({}),
  ]);
  res.json({ role, students, recruiters, jobs, total: sum(status), status });
}));

module.exports = router;
