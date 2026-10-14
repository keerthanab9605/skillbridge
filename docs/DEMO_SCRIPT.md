# 5–10 minute demo video script
Intro must be in **English**. Walkthrough can be English or Hindi. Fill in the brackets.

## 0:00 Introduction (English, mandatory, ~30 sec)
"Hello, my name is [Full Name], currently pursuing [B.Tech in Computer Science] from [College Name]. I'm in my [final] year and have completed my internship with LaunchED in the Full Stack Development domain. In this video I'll be demonstrating my capstone project titled 'SkillBridge: Full-Stack Career Portal', a platform where students find jobs and internships and track their applications, and recruiters manage candidates."

## 0:30 Problem statement (~45 sec)
Students and freshers struggle to find internships, jobs and learning resources in one organised place. Existing portals are overloaded, hard to navigate and have no personalised tracking.

## 1:15 Tools and technologies (~45 sec)
React + TypeScript + Tailwind on the front; Node.js + Express REST API; MongoDB with Mongoose; JWT + bcrypt; Docker; GitHub Actions; Vercel + Render + MongoDB Atlas. Designed first in Figma.

## 2:00 Architecture (~1 min)
Show the diagram in docs/TECHNICAL_DOCUMENTATION.md: React → REST API → MongoDB. Explain the token flow and that roles are enforced on the server, not just hidden in the UI.

## 3:00 Live demonstration (~4 min) — use the deployed URL
1. Jobs page: search "react", filter Internship, paginate (30s)
2. Register a student → profile → upload resume (45s)
3. Open a job → apply with cover note → try applying again (shows the duplicate guard) → save another job (45s)
4. Log in as recruiter → post a job → open applicants → change a status to Interview (60s)
5. Back as student → tracker shows Interview, pipeline chart updates (30s)
6. Admin dashboard → totals and user list. Toggle dark mode, shrink the window to show responsive layout (30s)

## 7:00 Challenges and solutions (~1 min)
Pick real ones, e.g.: duplicate applications → unique compound index; role-based security → `restrictTo` middleware + ownership checks; CORS between Vercel and Render → `CLIENT_URL` allow-list; ephemeral disk on free hosting → documented move to Cloudinary/S3.

## 8:00 Final output and learning (~45 sec)
Show GitHub repo, green CI run, live URL. Summarise what you learned and next steps.

**Recording tips:** quiet room, 1080p screen recording, close other tabs, zoom the browser to 110%, export as **MP4**, 5–10 minutes.
