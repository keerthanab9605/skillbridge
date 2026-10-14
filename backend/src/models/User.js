const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
  password: { type: String, required: true, minlength: [6, 'Password must be at least 6 characters'], select: false },
  role: { type: String, enum: ['student', 'recruiter', 'admin'], default: 'student' },
  headline: { type: String, default: '', maxlength: 120 },
  bio: { type: String, default: '', maxlength: 600 },
  education: { type: String, default: '' },
  skills: [{ type: String, trim: true }],
  company: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.matchPassword = function (plain) { return bcrypt.compare(plain, this.password); };

module.exports = mongoose.model('User', userSchema);
