const multer = require('multer');
const path = require('path');
const fs = require('fs');

const dir = path.join(__dirname, '..', '..', 'uploads', 'resumes');
fs.mkdirSync(dir, { recursive: true });

module.exports = multer({
  storage: multer.diskStorage({
    destination: dir,
    filename: (req, file, cb) => cb(null, `${req.user.id}-${Date.now()}.pdf`),
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    file.mimetype === 'application/pdf' ? cb(null, true) : cb(Object.assign(new Error('Only PDF resumes are allowed'), { status: 400 })),
});
