> [!IMPORTANT]
> **🤖 AI AGENT — READ THIS FIRST**
> Before doing anything in this project, you **must** read [`foundation.md`](./foundation.md).
> It defines the required workflow, priority rules, testing process, and human escalation protocol.
> Do not pick up an issue or write any code until you have read and understood `foundation.md`.

---

# Product Requirements Document (PRD): Portfolio V3 Upgrade

## 1. Executive Summary
Transform the static React portfolio into a dynamic, professional-grade application with an Admin Dashboard for content management and modern Docker-based infrastructure.

---

## 2. Progress Status

### ✅ COMPLETED
| Item | Description |
|------|-------------|
| Docker Infrastructure | `docker-compose.yml` with Frontend, Backend API, and PostgreSQL |
| Custom Backend | Node.js Express API with JWT authentication |
| Database Schema | PostgreSQL with `projects` and `users` tables |
| Admin Portal | Login, Dashboard with Add/Delete, Premium dark styling |
| Contact Form | `mailto:` with pre-filled subject + recipient |
| Portfolio API | Dynamic content from `localhost:4000/api/projects` |
| Routing | `react-router-dom` for `/admin` routes |
| **UI Redesign - Complete** | Premium dark theme for ALL sections |
| Header | Glassmorphism sticky nav |
| Hero | Gradient backgrounds, CTA buttons |
| About | Two-column layout with highlight cards |
| Portfolio | Modern card grid with hover effects |
| Skills | Tag-based display with hover animations |
| Contact | Premium form styling |
| Footer | Social icons + Admin link |
| **Light/Dark Theme Toggle** | Full theme switching with CSS variables |
| **Confirm Localhost Setup** (#46) | Docker, postgres, API, admin login all verified working. Commit `56574c8`. |
| **Remove Hardcoded Admin Credentials** (#23) | Auto-seed removed from `server/index.js`. Credentials now env-var only. Commit `56574c8`. |
| **Fix JWT Secret Fallback** (#24) | Startup guard added; `\|\| 'secret'` fallbacks removed from `server/index.js`. Commit `56574c8`. |
| **Restrict CORS Origins** (#25) | `ALLOWED_ORIGINS` env var replaces open `cors()`. Verified with curl tests. Commit `ec4ec11`. |
| **Replace Hardcoded API URLs** (#26) | All `http://localhost:4000` fetch calls replaced with `API_URL` constant from `REACT_APP_API_URL` env var across `portfolio.js`, `AdminLogin.js`, `AdminDashboard.js`. Verified via Playwright network requests. |

### 🔄 IN PROGRESS
| Item | Description |
|------|-------------|
| **Fill Out All Sections** | Go through and fill in all the sections for the website |
| **Resume Link** | Have resume pop up in another web link; also available for download |
| **Finish Other Projects** | Finish other projects and add them to the website |

### ⏳ TODO
| Item | Description |
|------|-------------|
| **Migrate to Next.js** | Convert the React app to Next.js for SSR, file-based routing, image optimization, and better SEO |
| **Confirm Localhost Setup** | Verify Docker, backend API, and frontend all start correctly and communicate as expected locally |
| **Full Site Content Audit** | Review every section of the site and make sure all content, links, projects, skills, and info are current and accurate |
| **Update Full Stack Engineer Resume** | Replace resume on the site with the most recent version; ensure it opens in a new tab and is available for download |
| **Full Security Suite Check (Post-Launch)** | Run a comprehensive security audit across frontend, backend, infrastructure, and dependencies after all other work is complete |
| ~~Admin - Edit Project~~ | ✅ Allow editing existing projects |
| ~~Admin - Image Upload~~ | ✅ Upload thumbnails with preview |
| **Cloudflare Tunnel** | Configure for public access ← NEXT |
| ~~Mobile Responsiveness~~ | ✅ Full responsive audit complete |
| **About Me - Resume Update** | Go through About Me section and add most recent updated resume |
| **Portfolio - Live Code Button** | Add a button on each portfolio card to show the live code |
| **Test Files** | Build out test files for each section |
| **Domain Update** | Update the domain aaronadams.dev with updated pw2 code |
| **Fix Existing Sites** | Quickly update e-commerce site, camper rental site, and Austin's realtor website |
| **Project Videos** | Add videos describing each project — breaking down components and functionality |

---

## 3. Security Findings (Audit)

> Findings from static analysis — prioritized highest severity first.

### 🔴 Critical
| # | Item | Location | Description |
|---|------|----------|-------------|
| ~~1~~ | ~~**Predictable Admin Credentials**~~ | ~~`server/index.js:77,78,89,90`~~ | ✅ **Fixed #23** — Hardcoded seed removed. Credentials now from `ADMIN_USERNAME`/`ADMIN_PASSWORD` env vars. |
| ~~2~~ | ~~**Hardcoded JWT Secret Fallback**~~ | ~~`server/index.js:129,143`~~ | ✅ **Fixed #24** — Startup guard added. Both `\|\| 'secret'` fallbacks removed. |

### 🟠 High
| # | Item | Location | Description |
|---|------|----------|-------------|
| ~~3~~ | ~~**CORS Fully Open**~~ | ~~`server/index.js:11`~~ | ✅ **Fixed in #25** — CORS now restricted to allowlisted origins via `ALLOWED_ORIGINS` env var. Committed `ec4ec11`, pushed to `master`, GitHub issue closed. |
| ~~4~~ | ~~**Hardcoded localhost:4000 URLs**~~ | ~~`portfolio.js:23`, `AdminLogin.js:14`, `AdminDashboard.js:29,36,52,72,82`~~ | ✅ **Fixed #26** — All fetch calls now use `API_URL` constant driven by `REACT_APP_API_URL` env var. Verified via Playwright network inspection. |

### 🟡 Medium
| # | Item | Location | Description |
|---|------|----------|-------------|
| ~~5~~ | ~~**Suspicious Dependency `"-": "^0.0.1"`**~~ | ~~`package.json:6`~~ | ✅ **Fixed #27** — Removed from `package.json`, `npm install` run to clean `package-lock.json`. Site confirmed working via Playwright. |
| ~~6~~ | ~~**Admin Token in localStorage**~~ | ~~`AdminLogin.js:25`, `AdminDashboard.js:18,116`~~ | ✅ **Fixed #28** — Migrated from `localStorage` to `sessionStorage` in `AdminLogin.js` and `AdminDashboard.js`. Playwright confirmed token in sessionStorage, absent from localStorage. |
| ~~7~~ | ~~**No `response.ok` Check in Admin CRUD**~~ | ~~`AdminDashboard.js:36,72,82`~~ | ✅ **Fixed #29** — Added `response.ok` guards to `fetchProjects`, `handleDelete`, `handleSubmit` (PUT and POST). Failures now surface status codes to the user. Playwright confirmed add project works end-to-end. |

### 🔵 Low
| # | Item | Location | Description |
|---|------|----------|-------------|
| ~~8~~ | ~~**Stale Test Suite**~~ | ~~`src/App.test.js:4,6`~~ | ✅ **Fixed #30** — Updated test to assert hero heading `"Building Digital Experiences That Drive Results"`. Playwright confirmed heading exists in live UI. |
| ~~9~~ | ~~**Mojibake / Encoding Artifacts**~~ | ~~`about.js:24,25,26,43,64`, `hero.js:8`~~ | ✅ **Fixed #31** — Playwright confirmed all text renders cleanly; encoding artifacts were resolved during the UI redesign. No source changes needed. |
| ~~10~~ | ~~**Unused Import Lint Warning**~~ | ~~`footer.js:4`~~ | ✅ **Fixed #32** — Removed unused `FontAwesomeIcon` import from `footer.js`. Footer renders correctly (CSS class-based icons unaffected). |

---

## 4. Website Improvements (Positioning & Conversion)

| # | Item | Description |
|---|------|-------------|
| 1 | **Clarify Positioning Above the Fold** | Use one sharp value prop: "I build full-stack products that increase conversion and revenue." |
| 2 | **Replace Cards with Case Studies** | Each project shows: Problem, Stack/architecture decisions, Marketing strategy (funnel, channel, messaging), Measured results (conversion lift, CAC drop, CTR, speed improvements) |
| 3 | **Add Business Metrics to Every Project** | Show numbers, not adjectives. Example: "+38% lead conversion in 6 weeks." |
| 4 | **Show Technical Depth — Engineering Notes** | Per project: system design diagram, API/data model, tradeoffs made, performance/security improvements |
| 5 | **Show Marketing Depth — Growth Notes** | Per project: ICP/persona, offer and CTA strategy, landing page experiments, attribution/analytics setup |
| 6 | **Improve Trust Signals** | Add client logos, testimonials with real names/titles, links to live projects, GitHub repos |
| 7 | **Upgrade CTA Flow** | Primary CTA sitewide: "Book a strategy + build consult." Secondary CTA: "View case studies." |
| 8 | **Create Separate Navigation Paths** | One path for technical buyers ("Need a builder"), one for business owners ("Need growth results") |
| 9 | **Add Authority-Compounding Content** | Publish short teardown posts: "How I increased conversion on X," "How I built Y architecture." |
| 10 | **Improve Conversion Tracking** | Track scroll depth, CTA clicks, contact submissions, and case-study engagement to optimize the funnel |
| ~~11~~ | ~~**Tighten Performance & Accessibility**~~ | ✅ **Fixed #43** — Added `aria-label` + `aria-hidden` to footer social icon links; added `loading="lazy"` to portfolio card images. Contact form labels already properly associated. Header hamburger and theme toggle already had `aria-label`. |
| 12 | **Polish Brand Consistency** | Consistent typography, voice, color system, and visual hierarchy so the site feels premium and intentional |

---

## 5. Codebase Reorganization

> Restructure the project to reflect professional full-stack engineer standards — clean separation of concerns, proper asset management, and a scalable folder layout.

### Current Issues
| Problem | Detail |
|---------|--------|
| Empty `backend/` folder | Exists alongside `server/` — one should be removed |
| Entire backend in one file | `server/index.js` contains routes, middleware, auth, DB — needs splitting |
| Assets buried in `src/photos/` | Images and resume PDF mixed together with no organization |
| `src/components/MyComponent` | Generic leftover component still in codebase |
| No `services/` layer | API calls hardcoded inside components instead of a central service file |
| No `hooks/`, `context/`, or `utils/` | Missing standard React architecture layers |
| `bash.exe.stackdump` at root | Crash dump file committed to the project root |

### Target Structure
```
pwv2/
├── client/  (or src/ for Next.js app router)
│   ├── components/
│   │   ├── layout/         # Header, Footer, Nav
│   │   ├── sections/       # Hero, About, Skills, Portfolio, Contact
│   │   └── admin/          # Admin login, dashboard
│   ├── hooks/              # Custom React hooks (useProjects, useTheme, etc.)
│   ├── context/            # ThemeContext, AuthContext
│   ├── services/           # api.js — all fetch calls in one place
│   ├── utils/              # Helper functions
│   └── assets/
│       ├── images/         # Profile, hero, project screenshots
│       └── documents/      # resume.pdf
├── server/
│   ├── routes/             # projects.js, auth.js
│   ├── controllers/        # projectController.js, authController.js
│   ├── middleware/         # authMiddleware.js, logger.js
│   ├── config/             # db.js, env.js
│   └── index.js            # Entry point only (wires everything together)
├── docker-compose.yml
├── .env.example
└── improvements.md
```

---

## 6. Production Readiness Gaps


| # | Item | Description |
|---|------|-------------|
| ~~1~~ | ~~**CI/CD Pipeline**~~ | ✅ **Fixed #50** — `.github/workflows/ci.yml` created. Runs `npm ci`, `npm test`, and `npm run build` on every push/PR to master/main. |
| 2 | **Analytics** | Add GA4 or privacy-first alternative (Plausible/Fathom) to track visitors, clicks, and conversions |
| ~~3~~ | ~~**SEO Essentials**~~ | ✅ **Fixed #52** — `sitemap.xml` created, `robots.txt` updated with Sitemap reference and `/admin` disallow. JSON-LD Person + WebSite schema added to `public/index.html`. Meta/OG/Twitter already present. |
| 4 | **Error Monitoring** | Sentry (or similar) on both frontend and backend to catch and alert on runtime errors |
| 5 | **Uptime Monitoring** | UptimeRobot or Better Uptime to alert immediately when the site goes down |
| 6 | **Contact Form Real Backend** | Replace `mailto:` with a real email delivery service (Resend, SendGrid, or Nodemailer) |
| 7 | **Database Backups** | Automated PostgreSQL backup schedule with offsite storage and a tested restore process |
| ~~8~~ | ~~**Environment Docs (.env.example)**~~ | ✅ **Fixed #57** — `.env.example` was already complete with all required vars documented. |
| ~~9~~ | ~~**Custom Error Pages**~~ | ✅ **Fixed #58** — Created `NotFound.js` (404) and `ErrorBoundary.js` (500) in `src/components/errors/`. Added `*` catch-all route in `App.js`. Playwright confirmed `/this-does-not-exist` renders the 404 page. |
| ~~10~~ | ~~**Server-Side Logging**~~ | ✅ **Fixed #59** — Added `morgan` (HTTP request logging) and `winston` (structured app logging) to `server/`. Morgan streams into Winston. Logs written to `server/logs/combined.log` and `server/logs/error.log`. `server/logs/` gitignored. |

---

## 7. Development Commands

```powershell
# Start Local Dev
docker-compose up -d postgres
cd server && node index.js
npm start
```

### Default Admin: set via `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env` (no hardcoded credentials)

---

## 8. API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/projects` | No | Fetch all projects |
| POST | `/api/projects` | JWT | Create project |
| DELETE | `/api/projects/:id` | JWT | Delete project |
| POST | `/api/login` | No | Login |