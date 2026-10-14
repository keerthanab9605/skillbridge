const jwt = require('jsonwebtoken');
const User = require('../models/User');
const wrap = require('./wrap');

exports.protect = wrap(async (req, res, next) => {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Please log in' });
  let payload;
  try { payload = jwt.verify(token, process.env.JWT_SECRET); }
  catch { return res.status(401).json({ message: 'Session expired, log in again' }); }
  const user = await User.findById(payload.id);
  if (!user) return res.status(401).json({ message: 'Account no longer exists' });
  req.user = user;
  next();
});

// Role-based access control
exports.restrictTo = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'You do not have access to this action' });
