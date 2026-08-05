# Mantine

- Status: accepted
- Owner: Implementation
- Last reviewed: 2026-08-05

This guide supplements [Clean Code](clean-code.md), [TypeScript](typescript.md), and [React](react.md). Mantine is the shared component and theming foundation selected subject to PoC validation.

## Implementation rules

- A central `MantineProvider` configuration shall own semantic colour, spacing, typography, radius, breakpoint, and focus tokens.
- Customer and Staff Interaction may use different branded and density profiles, but shall share semantic tokens and accessible interaction primitives.
- Product-specific wrappers shall represent a stable semantic component or policy, not merely rename every Mantine component.
- Styling shall use supported theme, Styles API, and scoped CSS mechanisms. Fragile selectors against undocumented internal DOM are prohibited.
- Responsive behaviour shall start from the smallest supported viewport. Customer screens shall meet the PC, tablet, and mobile requirement.
- Forms shall associate labels, help, required state, and validation messages programmatically. Focus, keyboard use, contrast, reduced motion, and screen-reader output shall be verified rather than assumed from the library.
- The Staff data-grid need shall be validated in the PoC. An additional grid library may be selected only if Mantine's table capabilities fail the acceptance criteria and the alternative satisfies NFR-003.

## Documentation notation

Shared components shall use TSDoc for their contract and runnable examples for variants, states, accessibility behaviour, customer and staff themes, responsive layout, and failure or empty states.

## Verification

The UI gate shall include automated accessibility checks and keyboard and responsive interaction tests. Visual regression evidence should cover the shared themes and critical booking and staff views.

## Primary references

- [Mantine getting started](https://mantine.dev/getting-started/)
- [Mantine Styles API](https://mantine.dev/styles/styles-api/)
- [Mantine form package](https://mantine.dev/form/package/)
