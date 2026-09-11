# Customer Application Source

`root.tsx` owns the application shell, design-system provider, and the
customer-wide advisor launcher. `routes.ts` is the navigation manifest.
Feature route modules live under `routes/` and remain adapters over shared HTTP
contracts. VIEW-C-007 is exposed at `/assistance`; its advisor uses the
grounded streaming Q&A service, with the transcript retained in the browser
session and sent as bounded follow-up context.
