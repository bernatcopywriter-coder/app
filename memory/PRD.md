# Kingsford Metals — PRD

> **Legal:** Kingsford Metals is a trading name of **Bernat Solutions Ltd**.
> Domain: `bernatsolutions.com` (owned by the parent company; retained).
> Customer-facing brand throughout the site: **Kingsford Metals**.

---

## Product Overview

A professional, high-converting B2B website for **Kingsford Metals**, a UK
metalwork and manufacturing supplier. The site generates quote enquiries
(including drawing/CAD uploads) for services like laser cutting, folding,
fabrication, welding and finishing. Customers see Kingsford Metals as their
metalwork supplier — one point of contact managing the manufacturing
process from enquiry through to delivery.

## Brand Positioning

Established · Trustworthy · British · Industrial · Professional · Dependable ·
Straightforward · Premium without looking flashy.

Avoid: startup, SaaS, trendy design agency, futuristic manufacturing, cheap
local welding shop feel.

## Core Offering

- **Laser Cutting** — flat sheet, mild steel, stainless, aluminium
- **Tube & Section Cutting** — tube, box section, angle, channel
- **Heavy Plate Profiling** — flame, plasma, waterjet, bevel
- **Fabrication & Welding** — CNC press brake folding, MIG/TIG/MMA welding, assembly
- **Finishing & Secondary Ops** — powder coating, painting, galvanising,
  deburring, tapping, countersinking, machining

## Design System

- **Colour palette:** deep charcoal / near black backgrounds (`#0a0a0a`,
  `#111111`), off-white ink, steel grey lines, **dark British green** accent
  (`#2f5d3a` primary, `#3a7448` hover). Accent used sparingly for buttons,
  links, icons and active states.
- **Typography:** Oswald (display, uppercase) + Manrope (body). Wordmark is
  a stacked "KINGSFORD / METALS" mark with a bordered "KM" monogram.
- **Motion:** Framer Motion + Lenis smooth scroll retained.

## Tech Stack

- **Frontend:** React 19 + Tailwind CSS + Shadcn UI + Framer Motion + Lenis
- **Backend:** FastAPI + Motor (async MongoDB)
- **Auth:** JWT email/password (bcrypt) — admin only
- **Email:** Emergent-managed Resend (from name: "Kingsford Metals")

## Environments

- **Preview (dev):** `https://fabrication-quotes.preview.emergentagent.com`
- **Production:** `https://bernatsolutions.com`

## Key API Endpoints

- `GET /health` — unprefixed k8s readiness probe (do **not** remove)
- `GET /api/health` — application health
- `POST /api/quotes` — quote submission with file uploads → DB + email
- `POST /api/contact` — contact form → DB + email
- `POST /api/auth/login` — JWT session issuance
- `POST /api/auth/change-password` — authenticated password rotation
- `POST /api/auth/logout` / `GET /api/auth/me`
- `GET/PATCH/DELETE /api/admin/quotes[...]` — protected admin routes
- `GET /api/admin/messages`

## What's Been Implemented

### 2025-Q4 — MVP
- Initial site build (Home / Services / Industries / About / Quote / Contact
  / Privacy / Terms / Login / Admin)
- Quote form with drag-and-drop drawing uploads, MongoDB persistence
- Mobile responsive design, robots.txt, sitemap.xml, ErrorBoundary
- Emergent-managed Resend integration for quote + contact email
  notifications
- Custom JWT email/password admin authentication (migrated away from
  Google OAuth)
- Kubernetes readiness probe fix (`/health` unprefixed)

### 2026-08-07 — Change Password
- `POST /api/auth/change-password` (verify current, min 8 chars, invalidate
  other sessions)
- Admin dashboard modal with show/hide toggles and confirm field
- Seed function updated to preserve custom passwords across restarts

### 2026-08-07 — Top Email Banner
- Fixed 36px announcement banner above the nav with mailto CTA
- Sub-line offset adjusted on Hero + PageHero (68px → 104px total)
- Adaptive copy for mobile (compact) and desktop (full sales copy)

### 2026-08-11 — Kingsford Metals Rebrand
- Full customer-facing rename Bernat Solutions → Kingsford Metals
- Colour swap orange (`#ff5a1f`) → dark British green (`#2f5d3a`);
  updated tailwind tokens, CSS variables, shadcn accent HSL, spotlight,
  checkbox accent-colour and backend email HTML accents
- Stacked wordmark logo ("KM" mark + KINGSFORD / METALS) across
  Nav / Footer / Login / Admin — replaces the old favicon-based logo
- Copy rewrite: Home hero ("Metalwork Made Simple."), About page,
  Services, Industries, Quote, CTASection, BackupBlock, BenefitsGrid,
  IndustryChips, ManifestoChapters, MaterialsStrip, CapabilitiesStrip
- "Supplier network" language removed per direction (not positioned as a
  broker); replaced with direct "one supplier" phrasing
- SEO: page title, meta description, meta keywords, Open Graph updated
- Legal disclaimer added to Footer + Terms + Privacy: "Kingsford Metals
  is a trading name of Bernat Solutions Ltd."
- Nav label "Services" → "Capabilities" (route `/services` unchanged)
- Nav main CTA remains "REQUEST A QUOTE"
- Backend rebranded internally: FastAPI title, email HTML templates,
  from-name, admin seed name (existing DB records preserved)
- Full-site smoke tested (Home, Services, Industries, About, Contact,
  Quote, Login, Admin, mobile menu)

## Roadmap (Next Priorities)

### P1 — Admin polish
- Search + status filter on the admin quotes table
- CSV export of quotes
- Password reset via email (forgot password flow)

### P2 — Marketing / SEO
- Case Studies page (past jobs with photos + processes used)
- Testimonials section on Home
- Google Analytics / Plausible tag
- Per-page SEO structured data (Organization / LocalBusiness / Service)

### P3 — Nice-to-haves
- Favicon swap from orange bolt to KM monogram (currently still old
  favicon.png in `/public` — visible in browser tab only)
- Simple RFQ acknowledgement autoresponder to the customer
- FAQ page

## Constraints / Do Not Change

- Never remove `@app.get('/health')` (k8s probe)
- All URLs, secrets, tokens from `.env` files only
- Do not modify Emergent-managed Resend integration pipeline
- Backend seed only sets password on first create (do not force-reset)
- Frontend uses `REACT_APP_BACKEND_URL`; backend uses `MONGO_URL`
- The customer's email `alex@bernatsolutions.com` and the production
  domain `bernatsolutions.com` are correct and intentional (Bernat
  Solutions Ltd is the parent company)
