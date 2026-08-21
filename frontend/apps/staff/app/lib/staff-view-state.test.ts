import { describe, expect, it } from "vitest";

import { STAFF_VIEW_PARAM, patchStaffViewState, readStaffViewOption, readStaffViewPage, staffViewHref } from "./staff-view-state";

describe("staff view URL state", () => {
  it("round-trips shared filter, page, and detail fields", () => {
    const state = patchStaffViewState(new URLSearchParams(), {
      [STAFF_VIEW_PARAM.search]: "Lima hotel",
      [STAFF_VIEW_PARAM.type]: "product/accommodation",
      [STAFF_VIEW_PARAM.status]: "product/active",
      [STAFF_VIEW_PARAM.page]: 2,
      [STAFF_VIEW_PARAM.detail]: "PRD-42",
    });

    expect(state.get("q")).toBe("Lima hotel");
    expect(readStaffViewOption(state, STAFF_VIEW_PARAM.type, ["product/accommodation"])).toBe("product/accommodation");
    expect(readStaffViewPage(state)).toBe(2);
    expect(staffViewHref("/products", state, { [STAFF_VIEW_PARAM.detail]: "PRD-43" })).toContain("detail=PRD-43");
  });

  it("omits defaults and rejects invalid page and option values", () => {
    const state = patchStaffViewState(new URLSearchParams("q=test&page=4&type=invalid"), {
      [STAFF_VIEW_PARAM.search]: "",
      [STAFF_VIEW_PARAM.page]: 0,
    });

    expect(state.has("q")).toBe(false);
    expect(state.has("page")).toBe(false);
    expect(readStaffViewPage(new URLSearchParams("page=-1"))).toBe(0);
    expect(readStaffViewOption(state, STAFF_VIEW_PARAM.type, ["valid"])).toBe("all");
  });
});
