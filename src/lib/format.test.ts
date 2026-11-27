import { describe, expect, it } from "vitest";

import { formatShortDate } from "@/lib/format";

describe("formatShortDate", () => {
  it("formats an ISO date as a short month and day", () => {
    expect(formatShortDate("2026-11-27T10:30:00.000Z")).toBe("Nov 27");
  });

  it("uses the UTC day, whatever the local time zone", () => {
    expect(formatShortDate("2026-01-01T00:30:00+02:00")).toBe("Dec 31");
  });

  it("throws on a date it cannot read", () => {
    expect(() => formatShortDate("not a date")).toThrow(RangeError);
  });
});
