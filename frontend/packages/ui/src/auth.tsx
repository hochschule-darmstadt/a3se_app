import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from "react";

/**
 * PoC placeholder identity, mirroring the backend's placeholder `Actor`
 * (`backend/src/cct/api/dependencies.py`): no credential is verified, no
 * token is issued, and the backend does not enforce this identity in any
 * way. It exists only so the customer sign-in/registration screens and the
 * order-submission flow have *something* to attach a name to; it must never
 * be mistaken for authentication or authorization.
 */
export interface MockActor {
  readonly displayName: string;
  readonly personId: string;
}

interface MockAuthContextValue {
  readonly actor: MockActor | null;
  signIn(actor: MockActor): void;
  signOut(): void;
}

const MockAuthContext = createContext<MockAuthContextValue | null>(null);

const STORAGE_KEY = "cct.mockActor";

function readStoredActor(): MockActor | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MockActor;
  } catch {
    return null;
  }
}

/** Provides a PoC-only mock identity, persisted in `localStorage` for the session. */
export function MockAuthProvider({ children }: PropsWithChildren) {
  const [actor, setActor] = useState<MockActor | null>(() => readStoredActor());

  const signIn = useCallback((next: MockActor) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setActor(next);
  }, []);

  const signOut = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setActor(null);
  }, []);

  const value = useMemo(() => ({ actor, signIn, signOut }), [actor, signIn, signOut]);

  return <MockAuthContext.Provider value={value}>{children}</MockAuthContext.Provider>;
}

export function useMockActor(): MockAuthContextValue {
  const context = useContext(MockAuthContext);
  if (!context) {
    throw new Error("useMockActor must be used within a MockAuthProvider");
  }
  return context;
}
