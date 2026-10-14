const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const wrap = require('../middleware/wrap');
const { protect } = require('../middleware/auth');

const sign = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });

router.post('/register', wrap(async (req, res) => {
  const { name, email, password, role, company } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
  if (await User.findOne({ email: String(email).toLowerCase() })) return res.status(409).json({ message: 'Email is already registered' });
  // Only student/recruiter can self-register; admins are created via seed
  const user = await User.create({ name, email, password, role: role === 'recruiter' ? 'recruiter' : 'student', company });
  res.status(201).json({ token: sign(user), user: publicUser(user) });
}));

router.post('/login', wrap(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Incorrect email or password' });
  res.json({ token: sign(user), user: publicUser(user) });
}));

router.get('/me', protect, (req, res) => res.json({ user: publicUser(req.user) }));

module.exports = router;
