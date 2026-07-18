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

const renderComponent = (year = 2026, month = 7) => render(
  <MemoryRouter>
    <BudgetDetailComponent range={ { year: () => year, month: () => month } as any }/>
  </MemoryRouter>
);

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

  it("shows not-found state when budget month returns 404", async () => {
    budgetMonthMock.mockRejectedValue({ status: 404 });

    renderComponent();

    expect(await screen.findByText("page.budget.overview.notfound.title")).toBeInTheDocument();
    expect(screen.getByText("page.budget.overview.notfound.body")).toBeInTheDocument();
    expect(screen.queryByText("page.budget.overview.error.title")).not.toBeInTheDocument();
  });

  it("shows generic error state when budget month fails non-404", async () => {
    budgetMonthMock.mockRejectedValue({ status: 500 });

    renderComponent();

    expect(await screen.findByText("page.budget.overview.error.title")).toBeInTheDocument();
    expect(screen.getByText("page.budget.overview.error.body")).toBeInTheDocument();
    expect(screen.queryByText("page.budget.overview.notfound.title")).not.toBeInTheDocument();
  });

  it("renders with fallback values when one compute call fails", async () => {
    budgetMonthMock.mockResolvedValue({
      period: { startDate: "2026-07-01" },
      expenses: [
        { id: "ok", name: "Okay", expected: 100 },
        { id: "failed", name: "Failed", expected: 200 }
      ]
    });
    computeMock
      .mockResolvedValueOnce([{ spent: -30, left: 70, dailySpent: 1, dailyLeft: 2 }])
      .mockRejectedValueOnce(new Error("compute failed"));

    renderComponent();

    expect(await screen.findByTestId("expense-card-ok")).toBeInTheDocument();
    expect(screen.getByTestId("expense-card-failed")).toBeInTheDocument();
    expect(screen.queryByText("page.budget.overview.error.title")).not.toBeInTheDocument();
    expect(screen.getByText("summary")).toBeInTheDocument();
  });

  it("shows edit controls for current open month only", async () => {
    budgetMonthMock.mockResolvedValue({
      period: { startDate: "2026-07-01" },
      expenses: [{ id: "open-current", name: "Open Current", expected: 100 }]
    });
    computeMock.mockResolvedValue([{ spent: -20, left: 80, dailySpent: 0, dailyLeft: 0 }]);

    renderComponent(2026, 7);

    expect(await screen.findByText("add-expense")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "edit-open-current" })).toBeInTheDocument();
  });

  it("hides edit controls for current closed month", async () => {
    budgetMonthMock.mockResolvedValue({
      period: { startDate: "2026-07-01", endDate: "2026-07-31" },
      expenses: [{ id: "closed-current", name: "Closed Current", expected: 100 }]
    });
    computeMock.mockResolvedValue([{ spent: -20, left: 80, dailySpent: 0, dailyLeft: 0 }]);

    renderComponent(2026, 7);

    expect(await screen.findByTestId("expense-card-closed-current")).toBeInTheDocument();
    expect(screen.queryByText("add-expense")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "edit-closed-current" })).not.toBeInTheDocument();
  });

  it("hides edit controls for non-current month", async () => {
    budgetMonthMock.mockResolvedValue({
      period: { startDate: "2026-06-01" },
      expenses: [{ id: "past-open", name: "Past Open", expected: 100 }]
    });
    computeMock.mockResolvedValue([{ spent: -20, left: 80, dailySpent: 0, dailyLeft: 0 }]);

    renderComponent(2026, 6);

    expect(await screen.findByTestId("expense-card-past-open")).toBeInTheDocument();
    expect(screen.queryByText("add-expense")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "edit-past-open" })).not.toBeInTheDocument();
  });
});
