const router = require('express').Router();
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const wrap = require('../middleware/wrap');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect, restrictTo('admin'));

router.get('/users', wrap(async (req, res) => {
  const users = await User.find().select('name email role company createdAt').sort({ createdAt: -1 });
  res.json({ users });
}));

router.delete('/users/:id', wrap(async (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ message: 'You cannot delete your own account' });
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const jobs = await Job.find({ postedBy: user._id }).select('_id');
  await Application.deleteMany({ $or: [{ student: user._id }, { job: { $in: jobs.map((j) => j._id) } }] });
  await Job.deleteMany({ postedBy: user._id });
  res.json({ message: 'User and related data removed' });
}));

module.exports = router;
