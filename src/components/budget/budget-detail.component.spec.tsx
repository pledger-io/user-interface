import React from "react";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import BudgetDetailComponent from "./budget-detail.component";

const {
  budgetMonthMock,
  computeMock
} = vi.hoisted(() => ({
  budgetMonthMock: vi.fn(),
  computeMock: vi.fn()
}));

vi.mock("../../core/repositories/budget.repository", () => ({
  default: {
    budgetMonth: budgetMonthMock,
    compute: computeMock
  }
}));

vi.mock("../../config/prime-locale", () => ({
  i10n: (key: string) => key
}));

vi.mock("primereact/dataview", () => ({
  DataView: ({ value, itemTemplate }: { value: any[], itemTemplate: (item: any) => React.ReactNode }) => <div>
    { value.map(item => <div key={ item.id } data-testid={ `expense-card-${ item.id }` }>{ itemTemplate(item) }</div>) }
  </div>
}));

vi.mock("primereact/divider", () => ({
  Divider: () => <hr/>
}));

vi.mock("primereact/progressbar", () => ({
  ProgressBar: () => <div>progress</div>
}));

vi.mock("../format/date.component", () => ({
  default: ({ date }: { date: string }) => <span>{ date }</span>
}));

vi.mock("../format/money.component", () => ({
  default: ({ money }: { money: number }) => <span>{ money }</span>
}));

vi.mock("../layout/loading.component", () => ({
  default: () => <div>loading</div>
}));

vi.mock("./add-expense-dialog", () => ({
  AddExpenseDialog: () => <div>add-expense</div>
}));

vi.mock("./budget-summary", () => ({
  BudgetSummary: () => <div>summary</div>
}));

vi.mock("./budget-expense-actions.component", () => ({
  default: ({ expense }: { expense: { id: string } }) => <button>{ `edit-${ expense.id }` }</button>
}));

describe("BudgetDetailComponent recommendations", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-31T12:00:00.000Z"));
    budgetMonthMock.mockReset();
    computeMock.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders high-risk CTA order and deep-link URL encoding", async () => {
    budgetMonthMock.mockResolvedValue({
      period: { startDate: "2026-07-01" },
      expenses: [{
        id: "risk/high id",
        name: "High Risk Expense",
        expected: 100
      }]
    });
    computeMock.mockResolvedValue([{
      spent: -150,
      left: -50,
      dailySpent: 0,
      dailyLeft: 0
    }]);

    render(
      <MemoryRouter>
        <BudgetDetailComponent range={ { year: () => 2026, month: () => 7 } as any }/>
      </MemoryRouter>
    );

    const card = await screen.findByTestId("expense-card-risk/high id");
    const actionButton = within(card).getByRole("button", { name: "edit-risk/high id" });
    const transactionLink = within(card).getByRole("link", { name: "page.budget.group.action.listTransactions" });
    expect(actionButton.compareDocumentPosition(transactionLink) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(transactionLink).toHaveAttribute(
      "href",
      "/transactions/income-expense/2026/7?budget=risk%2Fhigh%20id"
    );
  });

  it("renders medium-risk CTA order with transactions before edit", async () => {
    budgetMonthMock.mockResolvedValue({
      period: { startDate: "2026-07-01" },
      expenses: [{
        id: "medium",
        name: "Medium Risk Expense",
        expected: 100
      }]
    });
    computeMock.mockResolvedValue([{
      spent: -92,
      left: 8,
      dailySpent: 0,
      dailyLeft: 0
    }]);

    render(
      <MemoryRouter>
        <BudgetDetailComponent range={ { year: () => 2026, month: () => 7 } as any }/>
      </MemoryRouter>
    );

    const card = await screen.findByTestId("expense-card-medium");
    const transactionLink = within(card).getByRole("link", { name: "page.budget.group.action.listTransactions" });
    const actionButton = within(card).getByRole("button", { name: "edit-medium" });
    expect(transactionLink.compareDocumentPosition(actionButton) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

  });
});
