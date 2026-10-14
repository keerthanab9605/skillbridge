const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Applied', 'Shortlisted', 'Interview', 'Offered', 'Rejected'], default: 'Applied' },
  coverNote: { type: String, default: '', maxlength: 1000 },
}, { timestamps: true });

applicationSchema.index({ job: 1, student: 1 }, { unique: true }); // one application per job per student

module.exports = mongoose.model('Application', applicationSchema);
