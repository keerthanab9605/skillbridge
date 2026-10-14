require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

(async () => {
  await connectDB();
  await Promise.all([User.deleteMany(), Job.deleteMany(), Application.deleteMany()]);
  await User.create({ name: 'Admin', email: 'admin@skillbridge.dev', password: 'Admin@123', role: 'admin' });
  const rec = await User.create({ name: 'Riya Recruiter', email: 'recruiter@skillbridge.dev', password: 'Recruiter@123', role: 'recruiter', company: 'Nimbus Labs' });
  const stu = await User.create({ name: 'Arjun Student', email: 'student@skillbridge.dev', password: 'Student@123', role: 'student', headline: 'Final-year CSE student', education: 'B.Tech CSE', skills: ['React', 'Node.js', 'MongoDB'] });
  const base = [
    ['Frontend Developer Intern', 'Nimbus Labs', 'Bengaluru', 'Internship', 'Hybrid', '₹20k/month', ['React', 'TypeScript', 'Tailwind']],
    ['Backend Engineer', 'Stackline', 'Hyderabad', 'Job', 'Onsite', '₹8-12 LPA', ['Node.js', 'Express', 'PostgreSQL']],
    ['Full Stack Developer', 'Orbit Systems', 'Remote', 'Job', 'Remote', '₹10-15 LPA', ['React', 'Node.js', 'MongoDB']],
    ['Data Analyst Intern', 'Quantiva', 'Pune', 'Internship', 'Onsite', '₹15k/month', ['SQL', 'Excel', 'Python']],
    ['UI/UX Design Intern', 'Pixelforge', 'Mumbai', 'Internship', 'Remote', '₹12k/month', ['Figma', 'Prototyping']],
    ['DevOps Engineer', 'Cloudnest', 'Bengaluru', 'Job', 'Hybrid', '₹12-18 LPA', ['Docker', 'GitHub Actions', 'AWS']],
    ['QA Automation Engineer', 'Testify', 'Chennai', 'Job', 'Onsite', '₹6-9 LPA', ['Selenium', 'JavaScript']],
    ['Machine Learning Intern', 'Neurala', 'Remote', 'Internship', 'Remote', '₹25k/month', ['Python', 'scikit-learn']],
    ['React Native Developer', 'Appwise', 'Gurugram', 'Job', 'Hybrid', '₹9-14 LPA', ['React Native', 'TypeScript']],
    ['Technical Content Intern', 'DevDaily', 'Remote', 'Internship', 'Remote', '₹8k/month', ['Writing', 'JavaScript']],
    ['Cloud Support Associate', 'Skyport', 'Kochi', 'Job', 'Onsite', '₹5-7 LPA', ['Linux', 'Networking']],
    ['Product Engineering Intern', 'Nimbus Labs', 'Bengaluru', 'Internship', 'Onsite', '₹30k/month', ['Node.js', 'React']],
  ];
  const jobs = await Job.insertMany(base.map(([title, company, location, type, mode, salary, skills]) => ({
    title, company, location, type, mode, salary, skills, postedBy: rec._id,
    description: `${company} is hiring a ${title}. You will work with a small, friendly team on real product features, ship code weekly, and learn from experienced mentors. Freshers are welcome to apply.`,
  })));
  await Application.create({ job: jobs[0]._id, student: stu._id, status: 'Shortlisted', coverNote: 'Excited to contribute!' });
  await Application.create({ job: jobs[2]._id, student: stu._id });
  console.log('Seeded. Logins:\n admin@skillbridge.dev / Admin@123\n recruiter@skillbridge.dev / Recruiter@123\n student@skillbridge.dev / Student@123');
  process.exit(0);
})();
