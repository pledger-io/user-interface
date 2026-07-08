import { describe, expect, it } from "vitest";
import { resolveActiveSection, sectionDestinationsFor } from "./sections";

describe('resolveActiveSection', () => {
  it.each([
    ['/dashboard', 'overview'],
    ['/reports/monthly-budget', 'overview'],
    ['/transactions/transfers', 'transactions'],
    ['/upload/create', 'transactions'],
    ['/categories', 'transactions'],
    ['/budgets', 'budgets'],
    ['/contracts', 'budgets'],
    ['/accounts/expense', 'accounts'],
    ['/automation/schedule/rules', 'automation'],
    ['/settings/currencies', 'settings'],
    ['/user/profile/currency', 'settings']
  ] as const)('maps %s to %s', (pathname, section) => {
    expect(resolveActiveSection(pathname)).toBe(section)
  })
})

describe('sectionDestinationsFor', () => {
  it('contains upload and categories in transactions section', () => {
    const destinations = sectionDestinationsFor('transactions')
    expect(destinations.some(destination => destination.to === '/upload')).toBe(true)
    expect(destinations.some(destination => destination.to === '/upload/create')).toBe(true)
    expect(destinations.some(destination => destination.to === '/categories')).toBe(true)
  })
})
