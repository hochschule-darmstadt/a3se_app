import { MOCK_AUTH_SIGNED_OUT_EVENT } from "@cct/ui";
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

export interface ClientTravelAction {
  readonly type: "add-traveller" | "add-position" | "remove-position" | "replace-position" | "reorder-positions";
  readonly stockItemId?: string;
  readonly productId?: string;
  readonly serviceDate?: string;
  readonly displayNameChain?: readonly string[];
  readonly unitPriceAmount?: string;
  readonly currencyCode?: string;
  readonly clientPositionId?: string;
  readonly clientTravellerIds?: readonly string[];
  readonly clientPositionIds?: readonly string[];
  readonly clientTravellerId?: string;
  readonly displayName?: string;
  readonly travellerKind?: "self" | "new";
  readonly givenName?: string;
  readonly familyName?: string;
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
  applyAdvisorActions(actions: readonly ClientTravelAction[]): void;
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

  useEffect(() => {
    // The draft belongs to the actor who built it, including when that actor
    // signs out or is replaced in another tab.
    const clearDraft = () => {
      window.sessionStorage.removeItem(STORAGE_KEY);
      setState(initialState);
    };
    window.addEventListener(MOCK_AUTH_SIGNED_OUT_EVENT, clearDraft);
    return () => window.removeEventListener(MOCK_AUTH_SIGNED_OUT_EVENT, clearDraft);
  }, []);

  useEffect(() => {
    if (state.travellers.length === 0 && state.positions.length === 0 && state.pending === null) {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } else {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

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
    applyAdvisorActions: (actions) => setState((current) => actions.reduce((next, action) => {
      if (action.type === "add-traveller" && action.clientTravellerId && action.displayName) {
        return {
          ...next,
          travellers: next.travellers.some((item) => item.clientTravellerId === action.clientTravellerId)
            ? next.travellers.map((item) => item.clientTravellerId === action.clientTravellerId
              ? { ...item, displayName: action.displayName!, givenName: action.givenName ?? item.givenName, familyName: action.familyName ?? item.familyName }
              : item)
            : [...next.travellers, {
              clientTravellerId: action.clientTravellerId,
              kind: action.travellerKind ?? "new",
              displayName: action.displayName,
              givenName: action.givenName,
              familyName: action.familyName,
            }],
        };
      }
      if (action.type === "remove-position" && action.clientPositionId) {
        return { ...next, positions: next.positions.filter((item) => item.clientPositionId !== action.clientPositionId) };
      }
      if (action.type === "reorder-positions" && action.clientPositionIds?.length) {
        const byId = new Map(next.positions.map((item) => [item.clientPositionId, item]));
        const ordered = action.clientPositionIds.flatMap((id) => {
          const item = byId.get(id);
          if (item) byId.delete(id);
          return item ? [item] : [];
        });
        return { ...next, positions: [...ordered, ...byId.values()] };
      }
      if ((action.type === "add-position" || action.type === "replace-position") && action.stockItemId && action.productId && action.serviceDate && action.unitPriceAmount && action.currencyCode) {
        const positions = action.type === "replace-position" && action.clientPositionId
          ? next.positions.filter((item) => item.clientPositionId !== action.clientPositionId)
          : next.positions;
        const travellerIds = action.clientTravellerIds?.length ? action.clientTravellerIds : next.travellers.map((item) => item.clientTravellerId);
        return {
          ...next,
          positions: [...positions, ...travellerIds.map((clientTravellerId) => ({
            stockItemId: action.stockItemId!, productId: action.productId!,
            displayNameChain: action.displayNameChain ?? [], serviceDate: action.serviceDate!,
            unitPriceAmount: action.unitPriceAmount!, currencyCode: action.currencyCode!,
            clientTravellerId, clientPositionId: createClientId("position"),
          }))],
        };
      }
      return next;
    }, current)),
    removePosition: (clientPositionId) => setState((current) => ({
      ...current, positions: current.positions.filter((item) => item.clientPositionId !== clientPositionId),
    })),
    clear: () => {
      window.sessionStorage.removeItem(STORAGE_KEY);
      setState(initialState);
    },
  }), [state]);
  return <TravelContext.Provider value={value}>{children}</TravelContext.Provider>;
}

export function useTravel() {
  const value = useContext(TravelContext);
  if (!value) throw new Error("useTravel must be used inside TravelProvider");
  return value;
}
