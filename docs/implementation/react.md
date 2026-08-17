# React

- Status: accepted
- Owner: Implementation
- Last reviewed: 2026-08-17

This guide supplements [Clean Code](clean-code.md) and [TypeScript](typescript.md). React is the selected UI library for Customer and Staff Interaction.

Shared UI implementations consume the contracts and profiles in the authoritative [Shared UI Design System](../requirements/ux/design-system/design-system.md). Product-specific compositions such as `AdvisorAction`, `AdvisorConversation`, and `OfferSummary` are justified there; other Mantine primitives should not receive pass-through wrappers.

## Implementation rules

- Components and Hooks shall be functions and shall remain pure during rendering. Side effects belong only in event handling or effects that synchronise with an external system.
- Hooks shall be called only at component or custom-Hook top level. Custom Hooks shall represent reusable behaviour rather than disguise ordinary helper functions.
- Components shall express presentation and interaction; use-case orchestration shall enter through explicit application interfaces. Components shall not query Neo4j or encode backend business rules.
- State shall have a single owner and contain only source state. Values derivable during rendering shall not be duplicated in state.
- Composition is preferred to deep configuration flags and inheritance. List keys shall be stable business or view identifiers.
- Every screen shall define loading, empty, validation-error, recoverable-error, and unavailable states where applicable.
- Native semantic HTML, keyboard operation, focus management, accessible names, and responsive behaviour shall be preserved even when components are visually customised.

## Documentation notation

- Exported components and Hooks shall use TSDoc-compatible comments to state purpose, behavioural props, controlled or uncontrolled state, side effects, accessibility obligations, and examples where non-obvious.
- Shared design-system components shall have a runnable example covering supported states, both density profiles where relevant, and responsive behaviour.
- Obvious local rendering helpers do not require comments.

## Verification

Tests shall exercise user-visible behaviour through accessible roles and names. Implementation-detail assertions, snapshots without a focused purpose, and direct testing of Hook internals should be avoided.

## Primary references

- [React rules](https://react.dev/reference/rules)
- [Keeping components pure](https://react.dev/learn/keeping-components-pure)
