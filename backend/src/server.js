require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set');
  process.exit(1);
}
connectDB()
  .then(() => app.listen(PORT, () => console.log(`SkillBridge API running on port ${PORT}`)))
  .catch((e) => { console.error('DB connection failed:', e.message); process.exit(1); });
