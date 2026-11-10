# Hospital Transfer Center ROI Calculator

A web tool that estimates the financial return of running a centralized patient transfer center. Hospital executives enter their staffed bed count, and optionally their own revenue-leakage figure, and get an ROI breakdown they can email to their team.

## The problem

Hospitals lose revenue when patients who could be admitted are sent elsewhere, or when inbound transfer requests are slow to process. A transfer center can capture that volume, but leaders need a defensible number before they invest. This calculator turns a few inputs into a clear, assumption-backed business case.

## The model

| Step | Calculation |
|---|---|
| Annual transfers | Staffed beds × 12 |
| Investment cost | Annual transfers × $225 variable cost per transfer |
| Revenue leakage | Entered by the user, or estimated as beds × 12 × $10,000 × 20% |
| Recaptured revenue | 20% of revenue leakage |
| New growth revenue | 1% inbound volume growth × $10,000 net revenue per admission |
| Operational savings | $2,000 per bed per year |
| **ROI** | Total benefit ÷ investment cost, shown as a ratio (e.g. 1.96 : 1) |

Every assumption is shown on screen next to the results, so users can see how the number was built.

## Features

- Instant recalculation with validated inputs
- Results broken out by benefit type: recapture, growth and operational savings
- Formatted HTML results email sent through SendGrid
- Responsive layout for desktop and tablet

## Tech stack

**React 18** · **TypeScript** · **Vite** · **Tailwind CSS** · **shadcn/ui (Radix)** · **TanStack Query** · **React Hook Form + Zod** · **Express** · **Drizzle ORM / PostgreSQL** · **SendGrid**

```
client/   # React front end (calculator page in src/pages/roi-calculator.tsx)
server/   # Express API: email endpoint and Vite dev middleware
shared/   # Drizzle schema and Zod types shared by client and server
```

## Run it

```bash
npm install
export SENDGRID_API_KEY=...   # required: the server checks for it at startup
npm run dev
```
