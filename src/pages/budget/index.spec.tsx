import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi, beforeEach } from "vitest";
import BudgetOverview from "./index";

const {
  firstBudgetMock,
  navigateMock
} = vi.hoisted(() => ({
  firstBudgetMock: vi.fn(),
  navigateMock: vi.fn()
}));

vi.mock("../../core/repositories/budget.repository", () => ({
  default: {
    firstBudget: firstBudgetMock
  }
}));

vi.mock("../../hooks/date-range.hook", () => ({
  default: () => [{
    month: () => 7,
    year: () => 2026
  }]
}));

vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>("react-router");
  return {
    ...actual,
    useNavigate: () => navigateMock
  };
});

vi.mock("../../config/prime-locale", () => ({
  i10n: (key: string) => key
}));

vi.mock("../../components/breadcrumb/breadcrumb.component", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{ children }</div>
}));

vi.mock("../../components/breadcrumb/breadcrumb-item.component", () => ({
  default: ({ label }: { label: string }) => <span>{ label }</span>
}));

vi.mock("../../components/breadcrumb/breadcrumb-menu.component", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{ children }</div>
}));

vi.mock("../../components/layout/dropdown", () => ({
  YearMonth: () => <div data-testid='year-month'>year-month</div>
}));

vi.mock("../../components/budget/budget-detail.component", () => ({
  default: () => <div data-testid='budget-detail'>
    budget-detail
    <span>page.budget.overview.error.title</span>
    <span>page.budget.overview.notfound.title</span>
  </div>
}));

vi.mock("primereact/card", () => ({
  Card: ({ children, header }: { children: React.ReactNode, header?: () => React.ReactNode }) => <div>
    { header?.() }
    { children }
  </div>
}));

vi.mock("primereact/message", () => ({
  Message: ({ text }: { text: string }) => <div>{ text }</div>
}));

const renderPage = () => render(
  <MemoryRouter>
    <BudgetOverview/>
  </MemoryRouter>
);

const deferredPromise = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe("BudgetOverview first-budget handling", () => {
  beforeEach(() => {
    firstBudgetMock.mockReset();
    navigateMock.mockReset();
  });

  it("shows blocking first-budget error and hides detail for non-404/400 failure", async () => {
    firstBudgetMock.mockRejectedValue({ status: 500 });
    renderPage();

    expect(await screen.findByText("page.budget.overview.firstBudget.error.title")).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
    expect(screen.getByText("page.budget.overview.firstBudget.error.body")).toBeInTheDocument();
    expect(screen.queryByTestId("budget-detail")).not.toBeInTheDocument();
    expect(screen.queryByTestId("year-month")).not.toBeInTheDocument();
    expect(screen.queryByText("page.budget.overview.error.title")).not.toBeInTheDocument();
    expect(screen.queryByText("page.budget.overview.notfound.title")).not.toBeInTheDocument();
  });

  it("keeps detail hidden while retrying and shows detail when retry succeeds", async () => {
    const retryDeferred = deferredPromise<{ period: { startDate: string } }>();
    firstBudgetMock
      .mockRejectedValueOnce({ status: 500 })
      .mockReturnValueOnce(retryDeferred.promise);

    renderPage();

    expect(await screen.findByText("page.budget.overview.firstBudget.error.title")).toBeInTheDocument();
    expect(screen.queryByTestId("budget-detail")).not.toBeInTheDocument();
    expect(screen.queryByTestId("year-month")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "page.budget.overview.action.retry" }));

    await waitFor(() => {
      expect(screen.queryByText("page.budget.overview.firstBudget.error.title")).not.toBeInTheDocument();
    });
    expect(screen.queryByTestId("budget-detail")).not.toBeInTheDocument();
    expect(screen.queryByTestId("year-month")).not.toBeInTheDocument();

    retryDeferred.resolve({ period: { startDate: "2026-01-01" } });

    expect(await screen.findByTestId("year-month")).toBeInTheDocument();
    expect(screen.getByTestId("budget-detail")).toBeInTheDocument();
  });

  it("redirects to first setup when first-budget returns 400", async () => {
    firstBudgetMock.mockRejectedValue({ status: 400 });
    renderPage();

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/budgets/first-setup");
    });
    expect(screen.queryByText("page.budget.overview.firstBudget.error.title")).not.toBeInTheDocument();
  });

  it("redirects to first setup when first-budget returns 404", async () => {
    firstBudgetMock.mockRejectedValue({ status: 404 });
    renderPage();

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/budgets/first-setup");
    });
    expect(screen.queryByText("page.budget.overview.firstBudget.error.title")).not.toBeInTheDocument();
  });

  it("keeps month selector hidden while loading and shows it when ready", async () => {
    const deferred = deferredPromise<{ period: { startDate: string } }>();
    firstBudgetMock.mockReturnValue(deferred.promise);
    renderPage();

    expect(screen.queryByTestId("year-month")).not.toBeInTheDocument();
    expect(screen.queryByTestId("budget-detail")).not.toBeInTheDocument();

    deferred.resolve({ period: { startDate: "2026-01-01" } });
    expect(await screen.findByTestId("year-month")).toBeInTheDocument();
    expect(screen.getByTestId("budget-detail")).toBeInTheDocument();
  });
});
