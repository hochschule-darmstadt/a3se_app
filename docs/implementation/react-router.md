# React Router

- Status: accepted
- Owner: Implementation
- Last reviewed: 2026-08-05

This guide supplements [Clean Code](clean-code.md), [TypeScript](typescript.md), and [React](react.md). DR-0010 selects React Router v7 Framework Mode for client-rendered applications.

## Implementation rules

- Framework Mode shall be configured as a SPA without a mandatory React server runtime. A change to server rendering requires evidence and a decision revisit.
- Route modules are interaction adapters. They may coordinate authentication, data loading, commands, navigation, and presentation, but shall delegate business work through generated HTTP clients or application services.
- Browser-side route data and mutations shall use the framework's typed route-module facilities, including `clientLoader` and `clientAction` where appropriate.
- Nested routes shall model layouts and navigation ownership. Shareable filters, paging, selections, and search state should use the URL when doing so does not expose sensitive data.
- Each route shall define the applicable pending, not-found, unauthorised, validation, and unexpected-error behaviour. Route error boundaries shall not replace ordinary validation feedback.
- Route identifiers and paths form a user-facing navigation contract and shall not change accidentally.

## Documentation notation

Route modules shall document their user purpose, access rule, URL parameters, query parameters, loaded data, mutation effects, and error behaviour using TSDoc on non-obvious exported handlers and route-level documentation for the navigation structure.

## Verification

Tests shall cover direct navigation, back and forward navigation, deep links, protected routes, loading and error boundaries, and preservation of URL state.

## Primary references

- [React Router modes](https://reactrouter.com/start/modes)
- [Route modules](https://reactrouter.com/start/framework/route-module)
- [Error boundaries](https://reactrouter.com/how-to/error-boundary)
- [Rendering strategies](https://reactrouter.com/start/framework/rendering)
