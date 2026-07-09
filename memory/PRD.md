# Bernat Solutions — PRD

## Problem statement (verbatim, condensed)
Build a professional, high-converting B2B website for **Bernat Solutions** — a UK steel + laser cutting + fabrication company. Primary goal: generate enquiries from UK companies that need laser cutting, folding, welding, fabrication, finishing, steel supply and subcontract manufacturing. Main CTA "Request a Quote", secondary "Send Your Drawings". Modern, industrial, premium, trustworthy. Dark charcoal + white text with an orange/blue accent. Full multi-page site + gated admin dashboard for submitted enquiries.

User creative directive: **Awwwards Site-of-the-Day level**. Bold cohesive art direction — kinetic hero, masked line reveal, editorial marquee, numbered manifesto chapters, industrial photography, framer-motion + lenis smooth scrolling, one subtle parallax moment.

## User personas
- **Purchasing manager** at an engineering / manufacturing / construction firm looking for a quick, reliable quote or a backup supplier.
- **Contractor / maintenance lead** needing one-off urgent fabrication work.
- **Fabricator / stockholder** looking for subcontract laser + folding capacity.
- **Alex (owner)** — needs a clean admin dashboard to see enquiries and reply.

## Core requirements (static)
- Multi-page marketing site (Home, Services, 5 service detail pages, Industries, About, Quote, Contact, Privacy, Terms).
- Detailed quote form with drawing file upload (PDF/DXF/DWG/STEP/STL/images).
- Admin dashboard, Google-auth gated, shows quote submissions + contact messages, status lifecycle, file downloads.
- Local SEO (Nottinghamshire, Derbyshire, South Yorkshire, UK-wide).
- Award-worthy design & motion — lenis smooth scroll, framer-motion reveals, marquee, spotlight cards, parallax hero.

## Tech + integrations
- FastAPI + Motor (MongoDB) + Emergent-managed Google OAuth (admin only).
- React 19 + react-router-dom + framer-motion + lenis + react-fast-marquee + shadcn/ui + tailwind + sonner.
- File storage: base64 inside quote document in MongoDB (MVP-appropriate; consider GridFS at scale).
- Email notifications: NOT wired (user chose to skip). Enquiries live in DB and admin dashboard.

## What has been implemented (2026-07-09)
- Backend REST API: /api/quotes, /api/contact, /api/auth/session, /api/auth/me, /api/auth/logout, /api/admin/quotes (list/detail/patch/delete), /api/admin/quotes/{id}/files/{file_id} download, /api/admin/messages. Honeypot spam guard on quote + contact. File size/type validation.
- Frontend: kinetic hero with parallax + masked line reveal, editorial marquee, benefits grid, services showcase, manifesto chapters, industries strip, trust blocks, CTA section. Full quote form (drag & drop, chip multi-select, sticky sidebar), full contact form. Service detail pages for all 5 capabilities. About with values. Industries page with per-sector narratives. Privacy + Terms.
- Auth: Emergent Google OAuth flow (Login → auth.emergentagent.com → hash fragment → /auth/session exchange → cookie + admin dashboard). Admin allowlist enforced server-side.
- Admin dashboard: stats row, tabbed table (quotes + messages), status dropdown, slide-in drawer with file downloads, delete action.
- Testing: full backend suite (15/15) + Playwright frontend suite (34/34) — see `/app/test_reports/iteration_1.json`.

## What's next (backlog)
- **P1** Add email notification via Resend/SendGrid on new quote submission (user chose to skip — easy add later).
- **P1** Case studies / project gallery to build more trust (per-industry proof).
- **P2** Move file storage to GridFS or object storage when documents get large.
- **P2** Rate-limit `/api/quotes` and `/api/contact` (currently only honeypot protected).
- **P2** Add sitemap.xml + robots.txt generation for local SEO.
- **P2** Admin: filtering + search + CSV export of enquiries.
- **P3** Newsletter capture for buyer's guide / lead magnet.

## Test credentials
- Admin: `alex@bernatsolutions.com` via Google Auth (allowlist enforced server-side).
- Local test session: `session_token=test_session_admin_bernat` (see `/app/memory/test_credentials.md`).
