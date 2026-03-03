## Packages
recharts | Beautiful analytics charts for admin and seller dashboards
date-fns | Date formatting for orders and tracking

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["var(--font-display)"],
  sans: ["var(--font-sans)"],
}
Assuming auth endpoints set HTTP-only cookies for session management.
Using z.custom in the shared schema means strict runtime type validation might pass-through; frontend will handle numeric string conversions defensively.
