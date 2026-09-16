import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from "react";

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
/**
 * Dispatched on `window` when this tab's actor ends: a local sign-out, or a
 * sign-out or identity switch made in another tab. Listeners clear
 * actor-bound client state (drafts, transcripts, confirmed context).
 */
export const MOCK_AUTH_SIGNED_OUT_EVENT = "cct.mock-auth.signed-out";

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

/**
 * Provides a PoC-only mock identity. It is persisted in `localStorage`, so it
 * is shared by every tab of the app and survives reloads until sign-out, like
 * a browser-wide login cookie would. A `storage` listener keeps open tabs in
 * sync when another tab signs in, signs out, or switches identity.
 */
export function MockAuthProvider({ children }: PropsWithChildren) {
  const [actor, setActor] = useState<MockActor | null>(() => readStoredActor());
  const actorRef = useRef(actor);
  actorRef.current = actor;

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      // `key === null` means another tab cleared all of this origin's storage.
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      const next = readStoredActor();
      const previous = actorRef.current;
      if (previous && previous.personId !== next?.personId) {
        window.dispatchEvent(new Event(MOCK_AUTH_SIGNED_OUT_EVENT));
      }
      actorRef.current = next;
      setActor(next);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const signIn = useCallback((next: MockActor) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setActor(next);
  }, []);

  const signOut = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(MOCK_AUTH_SIGNED_OUT_EVENT));
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
