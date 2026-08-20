import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("orders", "routes/orders.tsx"),
  route("orders/:orderId", "routes/order-detail.tsx"),
  route("persons", "routes/persons.tsx"),
  route("persons/new", "routes/persons.new.tsx"),
  route("persons/:personId", "routes/persons.$id.tsx"),
  route("organisations", "routes/organisations.tsx"),
  route("organisations/new", "routes/organisations.new.tsx"),
  route("organisations/:organisationId", "routes/organisations.$id.tsx"),
  route("products", "routes/products.tsx"),
  route("products/:productId", "routes/products.$id.tsx"),
  route("stock-items", "routes/stock-items.tsx"),
  route("stock-items/:stockItemId", "routes/stock-items.$id.tsx"),
] satisfies RouteConfig;
