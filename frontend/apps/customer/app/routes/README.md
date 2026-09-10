# Customer Routes

Route modules are grouped by customer-facing feature as the application grows.
Each route defines its loading, empty, validation, unavailable, and error
behavior where applicable. `assistance.tsx` implements the VIEW-C-007 context
surface; the persistent advisor conversation is mounted by the application
root so it remains available across customer routes.
