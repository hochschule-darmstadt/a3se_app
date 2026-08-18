// Pulls in `@testing-library/jest-dom`'s Vitest matcher type augmentation
// (`toBeInTheDocument`, `toHaveAttribute`, ...) for `tsc --noEmit`. The
// shared `frontend/vitest.setup.ts` already imports this module at runtime,
// but it sits outside this app's `tsconfig.json` `include` globs, so `tsc`
// never sees its type-level side effect without this local re-import.
import "@testing-library/jest-dom/vitest";
