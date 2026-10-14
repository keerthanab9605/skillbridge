const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true },
  company: { type: String, required: [true, 'Company is required'], trim: true },
  location: { type: String, required: [true, 'Location is required'], trim: true },
  type: { type: String, enum: ['Job', 'Internship'], default: 'Job' },
  mode: { type: String, enum: ['Onsite', 'Remote', 'Hybrid'], default: 'Onsite' },
  salary: { type: String, default: '' },
  description: { type: String, required: [true, 'Description is required'] },
  skills: [{ type: String, trim: true }],
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

jobSchema.index({ type: 1, mode: 1, createdAt: -1 });

module.exports = mongoose.model('Job', jobSchema);
