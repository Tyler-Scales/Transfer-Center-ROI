# ROI Calculator - Project Backup Summary
Generated: July 10, 2025

## Project Status
- **Name**: Hospital Transfer Center ROI Calculator
- **Company**: Conduit Health Partners
- **Status**: Fully functional with latest updates
- **Last Major Update**: July 7, 2025

## Key Features Implemented
✅ Two-step revenue calculation (Leakage → Capture)
✅ ROI displayed as ratios (e.g., 1.96:1)
✅ Conduit Health Partners branding (orange/teal)
✅ Email integration for sharing results
✅ Responsive healthcare-focused design
✅ Professional calculation assumptions display

## Current Formula
1. **Revenue Leakage**: Beds × 12 × $10,000 × 20%
2. **Revenue Capture**: Revenue Leakage × 20%
3. **Total Benefits**: Revenue Capture + New Growth + Operational Savings
4. **Net Benefit**: Total Benefits - Investment Cost
5. **ROI Ratio**: (Net Benefit ÷ Investment Cost) + 1

## Critical Constants
- Variable Cost per Transfer: $225
- Net Revenue per Admission: $10,000
- Annual Operational Cost Savings: $2,000 per bed
- New Inbound Volume Growth Rate: 1%
- Revenue Capture Rate: 20% of leakage

## Dependencies
- React 18 with TypeScript
- Tailwind CSS + shadcn/ui
- Express.js backend
- SendGrid for email
- Drizzle ORM for database

## File Structure
```
client/src/pages/roi-calculator.tsx    # Main calculator
server/index.ts                        # Backend server
server/routes.ts                       # API endpoints
server/sendgrid.ts                     # Email service
shared/schema.ts                       # Data types
```

## Replit Configuration
- Workflow: "Start application" runs `npm run dev`
- Port: 5000
- Environment: Development with hot reload

## Recent Changes (July 7, 2025)
- Changed ROI display from percentage to ratio format
- Updated revenue calculation to two-step process
- Removed revenue leakage input field
- Simplified UI to only require staffed beds input

## Backup Instructions
1. Fork this Replit project
2. Name it "ROI Calculator - Backup [Date]"
3. Keep this summary for reference