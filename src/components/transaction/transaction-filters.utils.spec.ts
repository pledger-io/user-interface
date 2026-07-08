import { describe, expect, it } from "vitest";
import { applyQuickPreset, clearMutableFilters, mergeMutableFilters, normalizeFilterState, pickMutableFilters } from "./transaction-filters.utils";

describe("transaction filter utilities", () => {
  it("preserves contextual defaults while clearing mutable filters", () => {
    const cleared = clearMutableFilters({
      startDate: "2026-01-01",
      endDate: "2026-01-31",
      type: "EXPENSE",
      account: "a1",
      description: "groceries",
      offset: 20
    })

    expect(cleared).toEqual({
      startDate: "2026-01-01",
      endDate: "2026-01-31",
      offset: 20
    })
  })

  it("applies quick presets for income and transfers", () => {
    const incomePreset = applyQuickPreset({
      startDate: "2026-01-01",
      endDate: "2026-01-31",
      currency: "EUR"
    }, "income", false)

    expect(incomePreset).toMatchObject({
      startDate: "2026-01-01",
      endDate: "2026-01-31",
      type: "INCOME",
      onlyIncome: true,
      offset: 0
    })
    expect(incomePreset.currency).toBeUndefined()

    const transferPreset = applyQuickPreset({
      type: "TRANSFER",
      description: "internal"
    }, "all", true)
    expect(transferPreset).toEqual({
      type: "TRANSFER",
      offset: 0
    })
  })

  it("collects and merges mutable filters only", () => {
    const picked = pickMutableFilters({
      startDate: "2026-01-01",
      account: { id: "abc" },
      onlyExpenses: false,
      uncategorized: true
    })

    expect(picked).toEqual({
      account: { id: "abc" },
      uncategorized: true
    })

    const merged = mergeMutableFilters(
      { startDate: "2026-01-01", description: "coffee", offset: 40 },
      { description: "", currency: "EUR", offset: 0 }
    )
    expect(merged).toEqual({
      startDate: "2026-01-01",
      currency: "EUR",
      offset: 0
    })
  })

  it("normalizes transfer and dual-toggle filter states", () => {
    const transferNormalized = normalizeFilterState({
      onlyIncome: true,
      onlyExpenses: true,
      type: "INCOME"
    }, true)

    expect(transferNormalized).toEqual({
      type: "TRANSFER"
    })

    const dualToggleNormalized = normalizeFilterState({
      onlyIncome: true,
      onlyExpenses: true,
      type: "EXPENSE",
      description: "test"
    }, false)

    expect(dualToggleNormalized).toEqual({
      description: "test"
    })
  })
})

