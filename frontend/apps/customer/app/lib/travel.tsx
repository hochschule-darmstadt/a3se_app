import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "cct.customer.travel.v1";

export interface TravelTraveller {
  readonly clientTravellerId: string;
  readonly kind: "self" | "new";
  readonly displayName: string;
  readonly givenName?: string;
  readonly familyName?: string;
}

export interface PendingTravelPosition {
  readonly stockItemId: string;
  readonly productId: string;
  readonly displayNameChain: readonly string[];
  readonly serviceDate: string;
  readonly unitPriceAmount: string;
  readonly currencyCode: string;
}

export interface TravelPosition extends PendingTravelPosition {
  readonly clientPositionId: string;
  readonly clientTravellerId: string;
}

interface TravelState {
  readonly travellers: readonly TravelTraveller[];
  readonly positions: readonly TravelPosition[];
  readonly pending: PendingTravelPosition | null;
}

interface TravelContextValue extends TravelState {
  setPending(position: PendingTravelPosition | null): void;
  addTraveller(traveller: TravelTraveller): void;
  addPendingPosition(clientTravellerId: string): void;
  removePosition(clientPositionId: string): void;
  clear(): void;
}

const initialState: TravelState = { travellers: [], positions: [], pending: null };
const TravelContext = createContext<TravelContextValue | null>(null);

function createClientId(prefix: string) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`}`;
}

export function TravelProvider({ children }: { readonly children: ReactNode }) {
  const [state, setState] = useState<TravelState>(() => {
    if (typeof window === "undefined") return initialState;
    try { return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? "null") ?? initialState; }
    catch { return initialState; }
  });

  useEffect(() => { window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state]);

  const value = useMemo<TravelContextValue>(() => ({
    ...state,
    setPending: (pending) => setState((current) => ({ ...current, pending })),
    addTraveller: (traveller) => setState((current) => ({
      ...current,
      travellers: current.travellers.some((item) => item.clientTravellerId === traveller.clientTravellerId)
        ? current.travellers : [...current.travellers, traveller],
    })),
    addPendingPosition: (clientTravellerId) => setState((current) => current.pending ? ({
      ...current,
      positions: [...current.positions, { ...current.pending, clientTravellerId, clientPositionId: createClientId("position") }],
      pending: null,
    }) : current),
    removePosition: (clientPositionId) => setState((current) => ({
      ...current, positions: current.positions.filter((item) => item.clientPositionId !== clientPositionId),
    })),
    clear: () => setState(initialState),
  }), [state]);
  return <TravelContext.Provider value={value}>{children}</TravelContext.Provider>;
}

export function useTravel() {
  const value = useContext(TravelContext);
  if (!value) throw new Error("useTravel must be used inside TravelProvider");
  return value;
}
