# SkillBridge: Full-Stack Career Portal

Students and freshers find internships and jobs, save opportunities, track applications and manage a profile. Recruiters post listings and move candidates through a pipeline. Admins manage the platform.

**Stack:** React 18 + TypeScript + Tailwind CSS (Vite) · Node.js + Express · MongoDB (Mongoose) · JWT + bcrypt · Docker · GitHub Actions · Vercel + Render

## Features
- JWT authentication (bcrypt-hashed passwords, 7-day tokens, rate-limited auth routes)
- Role-based access control: Student / Recruiter / Admin, enforced on the API and in protected routes
- Job & internship listings with search, type/mode filters and pagination
- Student application tracker (apply with cover note, withdraw, saved jobs)
- Recruiter hub: post/delete listings, view applicants, update status Applied → Shortlisted → Interview → Offered / Rejected
- Resume upload (PDF, 2MB) and profile management
- Analytics per role (pipeline chart) and an Admin dashboard (users, totals, delete user)
- Responsive UI with persistent dark mode

## Run locally
Requires Node 18+ and MongoDB (local or Atlas).
```bash
# 1. API
cd backend && npm install
npm run seed        # demo data
npm run dev         # http://localhost:5000
# 2. Web (new terminal)
cd frontend && npm install
npm run dev         # http://localhost:5173
```
Or with Docker: `docker compose up --build` then open http://localhost:8080 (run the seed once: `docker compose exec api node src/seed.js`).

## Demo accounts (after seeding)
| Role | Email | Password |
|---|---|---|
| Admin | admin@skillbridge.dev | Admin@123 |
| Recruiter | recruiter@skillbridge.dev | Recruiter@123 |
| Student | student@skillbridge.dev | Student@123 |

## Environment variables
`backend/.env`: `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` · `frontend/.env`: `VITE_API_URL`

## Deployment
1. **Database:** create a free MongoDB Atlas cluster, allow network access, copy the connection string.
2. **Backend (Render):** New Web Service → connect repo → root `backend`, Docker (or `render.yaml`). Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your Vercel URL). Open `/api/health` to verify. Run the seed once from the Render shell: `node src/seed.js`.
3. **Frontend (Vercel):** Import repo → root directory `frontend` → set `VITE_API_URL` to the Render URL → deploy. `vercel.json` handles SPA routing.
4. **CI/CD:** `.github/workflows/ci.yml` type-checks, builds and builds Docker images on every push; Vercel and Render redeploy from `main`.

> Note: Render's free disk is ephemeral, so uploaded resumes reset on redeploy. For permanent storage swap `middleware/upload.js` for Cloudinary or S3 (documented in docs/TECHNICAL_DOCUMENTATION.md).

## Documentation
See `docs/`: technical documentation, capstone report, demo video script, Figma guide and submission checklist.
