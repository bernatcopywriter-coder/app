# Bernat Solutions — PRD

## Problem statement (verbatim, condensed)
Build a professional, high-converting B2B website for **Bernat Solutions** — a UK steel + laser cutting + fabrication business that helps companies **source and manage** work through a **trusted UK supplier network**. Primary CTA "Request a Quote", secondary "Send Your Drawings". Modern, industrial, premium, trustworthy. Dark charcoal + white text with an orange accent. Full multi-page site + gated admin dashboard for submitted enquiries.

User creative directive: **Awwwards Site-of-the-Day level**. Bold cohesive art direction — kinetic hero, masked line reveal, editorial marquee, numbered manifesto chapters, industrial photography, framer-motion + lenis smooth scrolling, subtle parallax hero.

## User personas
- **Purchasing manager** at an engineering / manufacturing / construction firm looking for a quick, reliable quote or a backup supplier.
- **Contractor / maintenance lead** needing one-off urgent fabrication work.
- **Fabricator / stockholder** looking for subcontract laser + folding capacity.
- **Alex (owner)** — needs a clean admin dashboard to see enquiries and reply.

## Core requirements (static)
- Multi-page marketing site (Home, Services, 5 service detail pages, Industries, About, Quote, Contact, Privacy, Terms).
- Detailed quote form with drawing file upload (PDF/DXF/DWG/STEP/STL/images/ZIP).
- Admin dashboard, Google-auth gated, shows quote submissions + contact messages, status lifecycle, file downloads.
- Local SEO (Nottinghamshire, Derbyshire, South Yorkshire, UK-wide).
- Award-worthy design & motion — lenis smooth scroll, framer-motion reveals, marquee, spotlight cards, parallax hero.
- **Positioning consistency**: Never claim to own machines. Always use "through our UK supplier network / helps source and manage / one point of contact".

## Tech + integrations
- FastAPI + Motor (MongoDB) + Emergent-managed Google OAuth (admin only).
- React 19 + react-router-dom + framer-motion + lenis + react-fast-marquee + shadcn/ui + tailwind + sonner.
- File storage: base64 inside quote document in MongoDB (MVP-appropriate).
- Email notifications: NOT wired (user chose to skip). Enquiries live in DB and admin dashboard.

## What has been implemented
### 2026-07-09 · MVP
- Backend REST API: /api/quotes, /api/contact, /api/auth/session, /api/auth/me, /api/auth/logout, /api/admin/quotes (list/detail/patch/delete), /api/admin/quotes/{id}/files/{file_id} download, /api/admin/messages. Honeypot spam guard on quote + contact. File size/type validation.
- Frontend: kinetic hero with parallax + masked line reveal, editorial marquee, benefits grid, services showcase, manifesto chapters, industries strip, trust blocks, CTA section. Quote form (drag & drop, chip multi-select, sticky sidebar), contact form, service detail pages, About, Industries with per-sector narratives, Privacy + Terms.
- Auth: Emergent Google OAuth flow. Admin allowlist enforced server-side.
- Admin dashboard: stats row, tabbed table (quotes + messages), status dropdown, slide-in drawer with file downloads, delete action.
- Iteration 1 tests: backend 15/15 + frontend 34/34.

### 2026-07-09 · Content overhaul + branding
- **Positioning rewrite**: All copy now says "source and manage / UK supplier network / one point of contact". No "our machines / our factory" language anywhere.
- **Restructured 5 service categories** with new slugs: `/services/laser-cutting`, `/services/tube-section-cutting`, `/services/heavy-plate-profiling`, `/services/folding-fabrication`, `/services/finishing-secondary`.
- **New home sections**: CapabilitiesStrip (18 supplier-network processes in 4 groups) and MaterialsStrip (16 materials + specialist tag).
- **Expanded quote form**: 20 process chip options (laser, tube laser, waterjet, flame, plasma, bevel/weld prep, folding, welding, fabrication, deburring, shot blast, laser etching, countersink, tapping, powder coat, paint, polish, plating, material supply, other). 15 material dropdown options (mild steel, S275, S355, stainless, aluminium, copper, brass, bronze, titanium, galvanised, Zintec, durbar, wear plate, boiler plate, other).
- **Materials list** across the site: mild steel, carbon steel, S275, S355, stainless, aluminium, copper, brass, bronze, titanium, galvanised, Zintec, durbar, wear plate, boiler plate, high-yield structural.
- **Marquee** expanded to 19 process items; font size tuned.
- **Imagery**: replaced desk/office/solar-panel photos with real industrial imagery (fibre laser cutting head, steel section, welder with sparks). Every service card carries "Representative supplier-network image" disclosure + descriptive alt-text.
- **Branding**: added user-supplied bolt favicon (`/favicon.png`) + logo (`/logo.png`) to Nav, Footer, Login and Admin.
- **SEO**: expanded meta keywords + description across pages.
- **A11y**: fixed hero H1 whitespace so aria-label reads correctly.
- Iteration 2 tests: backend 16/16 + frontend 100/100 assertions (with new-process test file).

## What's next (backlog)
- **P1** Wire email notification via Resend/SendGrid on new quote submission (currently DB-only).
- **P1** Case studies / project gallery for social proof (per-industry).
- **P2** Rate-limit `/api/quotes` and `/api/contact` (only honeypot today).
- **P2** Move file storage to GridFS/S3 when documents grow.
- **P2** Sitemap.xml + robots.txt for local SEO.
- **P2** Admin: filters, search, CSV export of enquiries.
- **P3** Add per-service microcopy for local pages (e.g. `/laser-cutting/nottingham`) to strengthen local SEO.

## Test credentials
- Admin: `alex@bernatsolutions.com` via Google Auth (allowlist enforced server-side).
- Local test session: `session_token=test_session_admin_bernat` (see `/app/memory/test_credentials.md`).
