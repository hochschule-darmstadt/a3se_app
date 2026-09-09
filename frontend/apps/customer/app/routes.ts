import { type RouteConfig, index, route } from "@react-router/dev/routes";

/**
 * Customer journey after issue #36: catalogue discovery feeds the
 * session-scoped Travel and traveller-selection step; persisted orders are
 * then available in My orders. Search criteria remain URL-backed.
 */
export default [
  index("routes/home.tsx"),
  route("search", "routes/search-results.tsx"),
  route("products/:productId", "routes/product-detail.tsx"),
  route("sign-in", "routes/sign-in.tsx"),
  route("travel/add", "routes/traveller-selection.tsx"),
  route("travel", "routes/my-travel.tsx"),
  route("my-orders", "routes/my-orders.tsx"),
] satisfies RouteConfig;
