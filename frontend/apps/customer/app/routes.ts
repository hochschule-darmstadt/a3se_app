import { type RouteConfig, index, route } from "@react-router/dev/routes";

/**
 * Customer Interaction thin slice (issue #22): `VIEW-C-001 -> C-009 -> C-010
 * -> C-002 -> C-011/012 -> C-003 -> C-004`. State between steps (selected
 * product, requested/confirmed date, party size) is carried in URL search
 * params rather than a client-side store, so every step is a plain,
 * independently linkable/testable route (React Router v7 framework mode,
 * `ssr:false`).
 */
export default [
  index("routes/home.tsx"),
  route("search", "routes/search-results.tsx"),
  route("products/:productId", "routes/product-detail.tsx"),
  route("compose", "routes/compose.tsx"),
  route("sign-in", "routes/sign-in.tsx"),
  route("offer", "routes/offer.tsx"),
  route("order", "routes/order.tsx"),
] satisfies RouteConfig;
