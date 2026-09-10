# Customer Application Source

`root.tsx` owns the application shell, design-system provider, and the
customer-wide advisor launcher. `routes.ts` is the navigation manifest.
Feature route modules live under `routes/` and remain adapters over shared HTTP
contracts. VIEW-C-007 is exposed at `/assistance`; its advisor replies are
deterministic placeholders until the later Q&A and agent increments.
