const router = require('express').Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const wrap = require('../middleware/wrap');
const { protect, restrictTo } = require('../middleware/auth');

const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const toList = (v) => (typeof v === 'string' ? v.split(',').map((s) => s.trim()).filter(Boolean) : v);

// Public: search + filter + pagination
router.get('/', wrap(async (req, res) => {
  const { q, type, mode, location } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 9, 50);
  const filter = { isActive: true };
  if (type) filter.type = type;
  if (mode) filter.mode = mode;
  if (location) filter.location = new RegExp(esc(location), 'i');
  if (q) {
    const r = new RegExp(esc(q), 'i');
    filter.$or = [{ title: r }, { company: r }, { skills: r }];
  }
  const [jobs, total] = await Promise.all([
    Job.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Job.countDocuments(filter),
  ]);
  res.json({ jobs, page, total, pages: Math.max(Math.ceil(total / limit), 1) });
}));

// Recruiter: own listings with applicant counts
router.get('/mine/list', protect, restrictTo('recruiter', 'admin'), wrap(async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 }).lean();
  const counts = await Application.aggregate([
    { $match: { job: { $in: jobs.map((j) => j._id) } } },
    { $group: { _id: '$job', n: { $sum: 1 } } },
  ]);
  const map = Object.fromEntries(counts.map((c) => [String(c._id), c.n]));
  res.json({ jobs: jobs.map((j) => ({ ...j, applicants: map[String(j._id)] || 0 })) });
}));

router.get('/:id', wrap(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('postedBy', 'name company');
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.json({ job });
}));

router.post('/', protect, restrictTo('recruiter', 'admin'), wrap(async (req, res) => {
  const { title, company, location, type, mode, salary, description, skills } = req.body;
  const job = await Job.create({ title, company: company || req.user.company, location, type, mode, salary, description, skills: toList(skills), postedBy: req.user.id });
  res.status(201).json({ job });
}));

const ownerOrAdmin = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) { res.status(404).json({ message: 'Job not found' }); return null; }
  if (req.user.role !== 'admin' && String(job.postedBy) !== req.user.id) { res.status(403).json({ message: 'Not your listing' }); return null; }
  return job;
};

router.put('/:id', protect, restrictTo('recruiter', 'admin'), wrap(async (req, res) => {
  const job = await ownerOrAdmin(req, res); if (!job) return;
  const { title, company, location, type, mode, salary, description, skills, isActive } = req.body;
  Object.assign(job, { title, company, location, type, mode, salary, description, ...(skills && { skills: toList(skills) }), ...(isActive !== undefined && { isActive }) });
  await job.save();
  res.json({ job });
}));

router.delete('/:id', protect, restrictTo('recruiter', 'admin'), wrap(async (req, res) => {
  const job = await ownerOrAdmin(req, res); if (!job) return;
  await Application.deleteMany({ job: job._id });
  await job.deleteOne();
  res.json({ message: 'Job deleted' });
}));

// Student: save / unsave
router.post('/:id/save', protect, restrictTo('student'), wrap(async (req, res) => {
  if (!(await Job.exists({ _id: req.params.id }))) return res.status(404).json({ message: 'Job not found' });
  const has = req.user.savedJobs.some((j) => String(j) === req.params.id);
  req.user.savedJobs = has ? req.user.savedJobs.filter((j) => String(j) !== req.params.id) : [...req.user.savedJobs, req.params.id];
  await req.user.save();
  res.json({ saved: !has });
}));

module.exports = router;
