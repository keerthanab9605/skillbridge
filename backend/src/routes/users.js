const router = require('express').Router();
const User = require('../models/User');
const wrap = require('../middleware/wrap');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/me', (req, res) => res.json({ user: req.user }));

router.put('/me', wrap(async (req, res) => {
  const { name, headline, bio, education, company } = req.body;
  let { skills } = req.body;
  if (typeof skills === 'string') skills = skills.split(',').map((s) => s.trim()).filter(Boolean);
  Object.assign(req.user, { name, headline, bio, education, company, ...(skills && { skills }) });
  await req.user.save();
  res.json({ user: req.user });
}));

router.post('/me/resume', upload.single('resume'), wrap(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Attach a PDF file' });
  req.user.resumeUrl = `/uploads/resumes/${req.file.filename}`;
  await req.user.save();
  res.json({ resumeUrl: req.user.resumeUrl });
}));

router.get('/me/saved', wrap(async (req, res) => {
  const user = await User.findById(req.user.id).populate('savedJobs');
  res.json({ jobs: user.savedJobs });
}));

module.exports = router;
