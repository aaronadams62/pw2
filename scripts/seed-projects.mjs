import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('C:/Users/aaron/Downloads/pwv2-e495e-firebase-adminsdk-fbsvc-1b329b8969.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const PLACEHOLDER = '/placeholder-project.svg';

const projects = [
  {
    title: 'Kind Human 4 Human Kind — Nonprofit Platform',
    description: 'Built a full-stack nonprofit website with React and Firebase, supporting landing page, contact forms, intake workflows, and an admin dashboard. Achieved 500–2,000 monthly users with 99.8% uptime while reducing hosting costs from $300/year to $20/year using Cloudflare tunnels.',
    tech: ['React', 'Firebase', 'Firestore', 'Cloudflare Tunnel', 'Netlify'],
    image_url: PLACEHOLDER,
    live_url: 'https://kindhuman4humankind.org',
    category: 'web',
  },
  {
    title: 'NPIM — Enterprise Inventory Lifecycle Management System',
    description: 'Real-time inventory system with AI-assisted bulk import, RBAC security, and analytics reporting. Reduced manual tracking workload by 20 hours/week with an AI import wizard that maps spreadsheet headers to NoSQL fields, cutting ingestion time for 1,000+ items from hours to minutes.',
    tech: ['React 18', 'MUI', 'Firebase', 'Firestore', 'Cloud Functions', 'Google Sheets API', 'Chart.js', 'Recharts', 'Jest'],
    image_url: PLACEHOLDER,
    live_url: '',
    category: 'web',
  },
  {
    title: 'Luther Services — Enterprise Field Service & Client Management Platform',
    description: 'Full-stack field service management platform that automates scheduling, billing, payments, and analytics for a regional service business. Features RBAC, multi-gateway payments (Stripe/PayPal/Lemon Squeezy), real-time analytics dashboard, and XSS hardening with DOMPurify and Firestore security rules.',
    tech: ['React 18', 'MUI', 'Firebase', 'Firestore', 'Stripe', 'PayPal', 'Lemon Squeezy', 'DOMPurify', 'Recharts', 'EmailJS'],
    image_url: PLACEHOLDER,
    live_url: '',
    category: 'web',
  },
  {
    title: 'Portfolio Website + Custom CMS',
    description: 'Rebuilt a portfolio site from static pages into a dynamic, secure, containerized platform with a custom CMS and automated deployments. Features JWT-based auth, CRUD project management, containerized app and database with durable persistence, and a repeatable dev/prod CI/CD pipeline.',
    tech: ['React 18', 'Node.js', 'PostgreSQL', 'Docker', 'Docker Compose', 'JWT Auth', 'GitHub Actions'],
    image_url: PLACEHOLDER,
    live_url: '',
    category: 'web',
  },
  {
    title: 'HelloCareer Flow — AI Resume Optimization SaaS',
    description: 'AI SaaS that tailors resumes to job descriptions and improves ATS alignment using secure prompt workflows and monetized credits. Features GPT-4o-mini tailoring engine, credit reservation pattern (Reserve → Process → Finalize/Refund), rate limiting, HMAC webhook validation, and a Super Admin portal with revenue and conversion telemetry. Achieved 9/9 pass rate across diverse resume samples.',
    tech: ['Next.js 16', 'React 19', 'TypeScript', 'Firebase', 'OpenAI', 'GCP Secret Manager', 'Lemon Squeezy', 'Vitest'],
    image_url: PLACEHOLDER,
    live_url: '',
    category: 'web',
  },
  {
    title: 'Propel — AI-Driven Job Application & Workflow Engine',
    description: 'Automated job applications end-to-end with browser automation, learned form-filling, resume routing, and a tracking dashboard. Features self-annealing fuzzy-matching Q&A, dry-run mode with error recovery, cover letter generation, and Google Sheets observability.',
    tech: ['Python', 'TypeScript', 'Playwright', 'Selenium', 'Google Sheets API', 'OpenAI GPT-4'],
    image_url: PLACEHOLDER,
    live_url: '',
    category: 'web',
  },
  {
    title: 'Leadams Marketplace Listing & Inventory Automation Engine',
    description: 'Automation system for Amazon + eBay listing creation and inventory synchronization with resilient state recovery. Features cross-platform listing sync, spreadsheet automation with openpyxl, session checkpointing via JSON state files, human-in-the-loop review gates, and a 3-layer orchestration architecture.',
    tech: ['Python', 'Playwright', 'openpyxl', 'OneDrive Excel', 'Outlook Automation', 'JSON'],
    image_url: PLACEHOLDER,
    live_url: '',
    category: 'web',
  },
  {
    title: 'Open ChatGPT Atlas — Model-Agnostic AI Browser Agent',
    description: 'Model-agnostic Chrome extension browser agent with precision visual automation, scheduled jobs, and multi-provider LLM routing. Features Set-of-Marks visual grounding, normalized coordinate scaling, safety shield with emergency stop, command palette (Alt+K), and a metrics dashboard with token heuristics across providers.',
    tech: ['TypeScript', 'React', 'Vite', 'Chrome Extension MV3', 'Gemini 2.5', 'OpenAI', 'Ollama', 'Composio', 'Zod'],
    image_url: PLACEHOLDER,
    live_url: '',
    category: 'web',
  },
  {
    title: 'FocusGuard — Desktop Productivity & Anti-Distraction Suite',
    description: 'Electron desktop app that enforces focus sessions via DNS-level blocking and real-time process termination. Features hosts-file system-wide blocking, process monitor that kills prohibited apps every 2 seconds, crash-safe restoration with lock files and backups, and privilege minimization with minimal admin elevation.',
    tech: ['Electron', 'React 18', 'TypeScript', 'Tailwind', 'Framer Motion', 'Node.js', 'PowerShell', 'Vite'],
    image_url: PLACEHOLDER,
    live_url: '',
    category: 'web',
  },
  {
    title: 'AI Finance Platform — Autonomous Trading & Risk Management System',
    description: 'Semi-autonomous trading platform combining multi-model AI signals with deterministic risk gates and a real-time portfolio dashboard. Features trust-based autonomy with dynamic authority based on performance, RSI/MACD/EMA technical indicators, position sizing and daily loss limits, and cost-optimized local LLM preprocessing.',
    tech: ['Next.js 14', 'TypeScript', 'FastAPI', 'Postgres', 'Redis', 'Docker', 'LangChain', 'Claude', 'Gemini', 'Alpaca API'],
    image_url: PLACEHOLDER,
    live_url: '',
    category: 'web',
  },
  {
    title: 'SUNAFS — Self-Hosted AI Agent Platform',
    description: 'Privacy-first agent platform enabling local execution of LLM workflows with sandboxed tool runs and workflow orchestration. Features branching/parallel workflows with retries, Docker sandbox tool execution, WebSockets streaming with live telemetry, and Prometheus/Grafana observability.',
    tech: ['Next.js 15', 'TypeScript', 'FastAPI', 'Postgres', 'Redis', 'Docker', 'Playwright', 'Ollama', 'Prometheus', 'Grafana'],
    image_url: PLACEHOLDER,
    live_url: '',
    category: 'web',
  },
  {
    title: 'Trupiano Family Catering — Full-Stack Website & Admin Portal',
    description: 'Modernized a local catering business into an SEO-optimized storefront with a secure admin portal and self-hosted infrastructure. Features JWT sessions, drag-and-drop menu management, image upload and optimization, Schema.org LocalBusiness SEO, and Cloudflare Tunnel secure ingress.',
    tech: ['Next.js 15', 'React 19', 'Tailwind', 'Node.js', 'Express', 'Prisma', 'Postgres', 'Docker', 'Nginx', 'Cloudflare Tunnel'],
    image_url: PLACEHOLDER,
    live_url: '',
    category: 'web',
  },
  {
    title: 'CRWN Clothing — Full-Stack E-Commerce Web App',
    description: 'Production-deployed e-commerce platform with Stripe payments, Firebase auth, and offline-capable PWA architecture. Features Redux-Saga state orchestration, Google OAuth, Stripe Payment Intents via Netlify serverless functions, Workbox offline support, and route-level code splitting.',
    tech: ['React 17', 'TypeScript', 'Redux', 'Redux-Saga', 'Firebase', 'Stripe', 'Netlify Functions', 'Workbox', 'Styled Components'],
    image_url: PLACEHOLDER,
    live_url: '',
    category: 'web',
  },
  {
    title: 'ROTLOR — Reach Out To Loved Ones Reminder',
    description: 'Relationship CRM that automates reminders via EmailJS + scheduled Twilio SMS to help users maintain personal connections. Features real-time Firestore sync, reoccurrence logic based on days since last contact vs interval, email and SMS reminders, and Jest/RTL test coverage.',
    tech: ['React 18', 'Firebase', 'Firestore', 'EmailJS', 'Twilio', 'node-cron', 'Jest', 'React Testing Library'],
    image_url: PLACEHOLDER,
    live_url: '',
    category: 'web',
  },
  {
    title: 'United Camper — Regional Rental & Repair Services Hub',
    description: 'Responsive marketing site showcasing service tiers with a JSON-driven content model for fast updates. Features mobile-first responsive layout, data separated from UI for easy content changes, custom Express server for optimized asset delivery, and Heroku deployment with Git-based CI/CD.',
    tech: ['React 16.8', 'Node.js', 'Express', 'Heroku'],
    image_url: PLACEHOLDER,
    live_url: '',
    category: 'marketing',
  },
];

const ref = db.collection('projects');
let count = 0;
for (const p of projects) {
  await ref.add({ ...p, created_at: FieldValue.serverTimestamp(), updated_at: FieldValue.serverTimestamp() });
  count++;
  console.log(`  [${count}/${projects.length}] Added: ${p.title}`);
}

console.log(`\nDone. ${count} projects seeded.`);
process.exit(0);
