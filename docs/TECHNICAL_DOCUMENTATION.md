# SkillBridge: Technical Documentation

## 1. Architecture
```
 Browser (React + TS + Tailwind, Vercel)
        │  HTTPS, JSON, Bearer JWT
        ▼
 Express API (Render, Docker)  ── helmet · cors · rate-limit · morgan
   routes → middleware (protect, restrictTo) → Mongoose models
        │
        ▼
 MongoDB Atlas      Disk: /uploads/resumes (PDF)
```
Frontend state: `AuthContext` holds the user and token; `ProtectedRoute` guards pages by role; `api.ts` attaches the token to every request.

## 2. Data model
| Collection | Key fields |
|---|---|
| User | name, email (unique), password (bcrypt, hidden by default), role, headline, bio, education, skills[], company, resumeUrl, savedJobs[→Job] |
| Job | title, company, location, type (Job/Internship), mode (Onsite/Remote/Hybrid), salary, description, skills[], postedBy →User, isActive |
| Application | job →Job, student →User, status, coverNote; unique index (job, student) |

Relationships: User 1—N Job (recruiter posts), User 1—N Application, Job 1—N Application, User N—N Job (saved).

## 3. REST API
| Method & path | Access | Purpose |
|---|---|---|
| POST /api/auth/register | public | Create student or recruiter account |
| POST /api/auth/login | public | Returns JWT + user |
| GET /api/auth/me | any | Current user |
| GET /api/jobs?q=&type=&mode=&page=&limit= | public | Search, filter, paginate |
| GET /api/jobs/:id | public | Job detail |
| POST/PUT/DELETE /api/jobs(/:id) | recruiter (owner) / admin | Manage listings |
| GET /api/jobs/mine/list | recruiter | Own listings with applicant counts |
| POST /api/jobs/:id/save | student | Toggle saved job |
| POST /api/applications/job/:jobId | student | Apply (one per job) |
| GET /api/applications/mine | student | Application tracker |
| DELETE /api/applications/:id | student | Withdraw |
| GET /api/applications/job/:jobId | recruiter (owner) / admin | Applicants |
| PATCH /api/applications/:id/status | recruiter (owner) / admin | Move candidate stage |
| GET/PUT /api/users/me | any | Profile |
| POST /api/users/me/resume | any | Upload PDF (≤2MB) |
| GET /api/users/me/saved | any | Saved jobs |
| GET /api/analytics | any | Role-specific counts |
| GET /api/admin/users, DELETE /api/admin/users/:id | admin | User management |

Errors are JSON `{ "message": "..." }` with proper status codes (400 validation, 401 unauthenticated, 403 forbidden, 404, 409 duplicate).

## 4. Security
- Passwords hashed with bcrypt (cost 10, via `bcryptjs`); never returned by queries.
- JWT signed with `JWT_SECRET`, 7-day expiry, verified on every protected request.
- RBAC on the server (`restrictTo`) plus ownership checks (a recruiter can only touch their own jobs/applicants).
- Role escalation blocked: public registration only creates student/recruiter.
- helmet headers, CORS allow-list, rate limit on `/api/auth`, 1MB JSON limit, PDF-only 2MB upload filter, regex input escaped to prevent ReDoS/regex injection.

## 5. UI design
Palette: ink navy (#0F1B2D), bridge teal (#0B7A83), signal amber (#F2A33A). Type: Bricolage Grotesque (headings) + Source Sans 3 (body). Dark mode via Tailwind `class` strategy, remembered in localStorage and applied before first paint. Keyboard focus rings, labelled inputs, `role="alert"` errors, reduced-motion respected.

## 6. Testing checklist (manual)
Register student/recruiter → login → recruiter posts job → student searches, saves, applies → duplicate apply blocked (409) → recruiter changes status → student sees the new status → student cannot open /recruiter or /admin → admin deletes a user.

## 7. Future work
Cloud file storage (Cloudinary/S3), email notifications, refresh tokens/httpOnly cookies, automated tests (Jest + Supertest, Playwright), PostgreSQL migration using the same route layer.
