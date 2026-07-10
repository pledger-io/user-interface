import { describe, expect, it } from "vitest";
import {
  getBudgetMonthPhase,
  getBudgetRecommendationActions,
  getBudgetRecommendationTextKey,
  getBudgetRiskLevel,
  getProjectedSpent,
  getProjectedUsagePercentage
} from "./budget-overview.utils";

describe("budget overview projection utilities", () => {
  it("classifies month phase against current date", () => {
    const now = new Date("2026-07-15T12:00:00.000Z")
    expect(getBudgetMonthPhase(2026, 6, now)).toBe("past")
    expect(getBudgetMonthPhase(2026, 7, now)).toBe("current")
    expect(getBudgetMonthPhase(2026, 8, now)).toBe("future")
  })

  it("projects spending for past, current and future months", () => {
    const now = new Date("2026-07-15T12:00:00.000Z")

    expect(getProjectedSpent({
      year: 2026,
      month: 6,
      expected: 450,
      spent: -300,
      dailySpent: -12
    }, now)).toBe(300)

    expect(getProjectedSpent({
      year: 2026,
      month: 8,
      expected: 500,
      spent: -20,
      dailySpent: -1
    }, now)).toBe(500)

    expect(getProjectedSpent({
      year: 2026,
      month: 7,
      expected: 620,
      spent: -310,
      dailySpent: -20
    }, now)).toBe(630)
  })

  it("falls back to elapsed-day run rate when daily spent is missing", () => {
    const now = new Date("2026-07-15T12:00:00.000Z")
    const projected = getProjectedSpent({
      year: 2026,
      month: 7,
      expected: 800,
      spent: -300,
      dailySpent: 0
    }, now)

    expect(projected).toBe(620)
  })

  it("assigns risk level using projected usage thresholds", () => {
    const now = new Date("2026-07-15T12:00:00.000Z")

    expect(getBudgetRiskLevel({
      year: 2026,
      month: 7,
      spent: -500,
      projectedSpent: 1100,
      expected: 1000
    }, now)).toBe("high")

    expect(getBudgetRiskLevel({
      year: 2026,
      month: 7,
      spent: -500,
      projectedSpent: 1000,
      expected: 1000
    }, now)).toBe("medium")

    expect(getBudgetRiskLevel({
      year: 2026,
      month: 7,
      spent: -300,
      projectedSpent: 650,
      expected: 1000
    }, now)).toBe("low")
  })

  it("marks future months as low risk by default", () => {
    const now = new Date("2026-07-15T12:00:00.000Z")
    expect(getBudgetRiskLevel({
      year: 2026,
      month: 8,
      spent: 0,
      projectedSpent: 1000,
      expected: 1000
    }, now)).toBe("low")
  })

  it("treats already exhausted current month budgets as high risk", () => {
    const now = new Date("2026-07-10T12:00:00.000Z")
    expect(getBudgetRiskLevel({
      year: 2026,
      month: 7,
      spent: -1000,
      projectedSpent: 1000,
      expected: 1000
    }, now)).toBe("high")
  })

  it("handles zero expected budgets in usage percentage", () => {
    expect(getProjectedUsagePercentage(200, 0)).toBe(Number.POSITIVE_INFINITY)
    expect(getProjectedUsagePercentage(0, 0)).toBe(0)
  })

  it("returns recommendation text key by risk", () => {
    expect(getBudgetRecommendationTextKey("low")).toBe("page.budget.overview.recommendation.low")
    expect(getBudgetRecommendationTextKey("medium")).toBe("page.budget.overview.recommendation.medium")
    expect(getBudgetRecommendationTextKey("high")).toBe("page.budget.overview.recommendation.high")
  })

  it("prioritizes recommendation actions by risk level", () => {
    expect(getBudgetRecommendationActions("low", true)).toEqual(["transactions"])
    expect(getBudgetRecommendationActions("medium", true)).toEqual(["transactions", "edit"])
    expect(getBudgetRecommendationActions("high", true)).toEqual(["edit", "transactions"])
  })

  it("omits edit recommendation when editing is unavailable", () => {
    expect(getBudgetRecommendationActions("medium", false)).toEqual(["transactions"])
    expect(getBudgetRecommendationActions("high", false)).toEqual(["transactions"])
  })
})
