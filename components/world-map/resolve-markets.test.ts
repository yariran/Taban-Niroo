import { describe, expect, it } from "vitest";

import { COUNTRY_DATA } from "./country-data";
import { resolveMarkets } from "./resolve-markets";

describe("resolveMarkets", () => {
  it("falls back to the built-in table when the CMS block is empty", () => {
    const { data, totals } = resolveMarkets(undefined);

    expect(data.Iran).toEqual(COUNTRY_DATA.Iran);
    expect(totals.markets).toBe(11);
    expect(totals.projects).toBe(488);
    expect(totals.since).toBe(1998);
  });

  it("reads a project count and a start year out of one value field", () => {
    const { data } = resolveMarkets({
      items: [{ label: "Iraq", value: "22 · 2009" }],
    });

    expect(data.Iraq.projects).toBe(22);
    expect(data.Iraq.firstCooperation).toBe(2009);
  });

  it("accepts Persian digits, which the Persian admin will produce", () => {
    const { data } = resolveMarkets({
      items: [{ label: "Ghana", value: "۲۵ · ۲۰۱۲" }],
    });

    expect(data.Ghana.projects).toBe(25);
    expect(data.Ghana.firstCooperation).toBe(2012);
  });

  it("treats a lone number as a project count, not a year", () => {
    const { data } = resolveMarkets({
      items: [{ label: "Peru", value: "30" }],
    });

    expect(data.Peru.projects).toBe(30);
    expect(data.Peru.firstCooperation).toBe(COUNTRY_DATA.Peru.firstCooperation);
  });

  it("splits products on Latin and Arabic commas", () => {
    const { data } = resolveMarkets({
      items: [{ label: "Turkey", body: "Long rods، Station posts, Fittings" }],
    });

    expect(data.Turkey.products).toEqual([
      "Long rods",
      "Station posts",
      "Fittings",
    ]);
  });

  it("leaves untouched fields on their defaults", () => {
    const { data } = resolveMarkets({
      items: [{ label: "Greece", value: "9" }],
    });

    expect(data.Greece.projects).toBe(9);
    expect(data.Greece.products).toEqual(COUNTRY_DATA.Greece.products);
  });

  it("matches market names case-insensitively and through editor aliases", () => {
    const { data } = resolveMarkets({
      items: [
        { label: "  iran  ", value: "60" },
        { label: "Türkiye", value: "18" },
      ],
    });

    expect(data.Iran.projects).toBe(60);
    expect(data.Turkey.projects).toBe(18);
  });

  it("ignores an item that names nothing recognisable", () => {
    const { data, totals } = resolveMarkets({
      items: [{ label: "Atlantis", value: "999" }],
    });

    expect(Object.keys(data)).toHaveLength(11);
    expect(totals.projects).toBe(488);
  });

  it("recomputes the totals from the overridden figures", () => {
    const { totals } = resolveMarkets({
      items: [
        { label: "Iran", value: "50 · 1995" },
        { label: "Somalia", value: "5" },
      ],
    });

    // 488 - 400 + 50 - 3 + 5
    expect(totals.projects).toBe(140);
    expect(totals.since).toBe(1995);
  });
});
