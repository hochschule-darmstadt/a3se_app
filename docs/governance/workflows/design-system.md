# Design System Workflow

- Status: accepted
- Owner: Requirements/Implementation
- Last reviewed: 2026-08-14

Use this workflow to define and evolve the shared UI design system for Customer Interaction and Staff Interaction. Maintain one system with common semantic foundations and components plus customer and staff profiles; do not fork two independent systems unless later evidence shows an irreconcilable need.

## Required inputs

- accepted UX requirements, navigation maps, wireframes, accessibility and localisation needs;
- the selected UI foundation and implementation guidance;
- bounded comparative evidence, clearly separated from project requirements;
- representative customer and staff states, including loading, empty, validation, error, pending, success, and AI-agent actions.

## Minimum structure

Keep the system small and need-driven:

1. **Foundations:** semantic colour, typography, spacing, sizing, borders, elevation, focus, breakpoints, and motion/reduced-motion tokens.
2. **Profiles:** a comfortable, expressive customer profile and a compact, data-dense staff profile mapped to the same semantic tokens and accessible primitives.
3. **Components and patterns:** only reusable elements evidenced by the navigation maps and wireframes; document purpose, anatomy, variants, states, responsive behaviour, content rules, and accessibility.
4. **Governance:** owner, proposal/review path, status, change notes, deprecation, and evidence needed before adding a token, variant, component, or pattern.

## Working rules

- Prefer semantic tokens over raw values in component specifications.
- Prefer adapting the selected component foundation over wrapping or recreating every primitive.
- Distinguish shared components from application-specific compositions; domain-specific screens do not automatically become design-system components.
- Test both profiles where relevant, but do not require every component to have visual differences between profiles.
- Record observed inspiration without copying branding, assets, claims, taxonomy, or inaccessible behaviour.
- Add complexity only for an evidenced use case. Dark mode, multiple brands, elaborate motion, icon taxonomies, and independent package/version infrastructure remain out of scope until needed.

## Completion evidence

- One authoritative design-system topic names its owner and consumers.
- Tokens, profiles, reusable components/patterns, supported states, accessibility, responsiveness, localisation, and contribution rules are reviewable.
- Customer and staff examples demonstrate shared semantics with appropriate density and presentation.
- Each included component or pattern traces to at least one wireframe or accepted interaction need.
- A browser-reviewable style guide or component catalogue demonstrates meaningful states without becoming production application code.
- Relevant harness, link, accessibility, responsive, and implementation checks pass; visual review is recorded.
