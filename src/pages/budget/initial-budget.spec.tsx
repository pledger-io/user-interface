import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";
import CreateBudgetView from "./initial-budget";

const {
  navigateMock,
  successMock,
  warningMock,
  createBudgetMock
} = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  successMock: vi.fn(),
  warningMock: vi.fn(),
  createBudgetMock: vi.fn()
}))

vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>("react-router")
  return {
    ...actual,
    useNavigate: () => navigateMock
  }
})

vi.mock("../../config/prime-locale", () => ({
  i10n: (key: string) => key
}))

vi.mock("../../context/notification-context", () => ({
  useNotification: () => ({
    success: successMock,
    warning: warningMock
  })
}))

vi.mock("../../core/repositories/budget.repository", () => ({
  default: {
    create: createBudgetMock
  }
}))

vi.mock("../../components/breadcrumb/breadcrumb.component", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{ children }</div>
}))

vi.mock("../../components/breadcrumb/breadcrumb-item.component", () => ({
  default: ({ label }: { label: string }) => <span>{ label }</span>
}))

vi.mock("../../components/layout/button", () => ({
  Button: ({
    label,
    onClick,
    type = "button",
    disabled,
    loading
  }: {
    label: string
    onClick?: () => void
    type?: "button" | "submit"
    disabled?: boolean
    loading?: boolean
  }) => <button type={ type } onClick={ onClick } disabled={ disabled }>{ label }{ loading ? "-loading" : "" }</button>
}))

vi.mock("primereact/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{ children }</div>
}))

vi.mock("primereact/message", () => ({
  Message: ({ text }: { text: string }) => <div>{ text }</div>
}))

vi.mock("primereact/calendar", () => ({
  Calendar: ({
    id,
    value,
    onChange,
    onFocus
  }: {
    id: string
    value: Date | null
    onChange: (event: { value: Date | null }) => void
    onFocus?: () => void
  }) => <input
      id={ id }
      aria-label={ id }
      type='month'
      value={ value ? `${ value.getFullYear() }-${ String(value.getMonth() + 1).padStart(2, "0") }` : "" }
      onFocus={ onFocus }
      onChange={ event => {
        const next = event.target.value
        onChange({ value: next ? new Date(`${ next }-01T00:00:00`) : null })
      }}/>
}))

vi.mock("primereact/inputnumber", () => ({
  InputNumber: ({
    id,
    value,
    onChange
  }: {
    id: string
    value: number | null
    onChange: (event: { value: number | null }) => void
  }) => <input
      id={ id }
      aria-label={ id }
      type='number'
      value={ value ?? "" }
      onChange={ event => onChange({ value: event.target.value === "" ? null : Number(event.target.value) })}/>
}))

const renderPage = () => render(
  <MemoryRouter>
    <CreateBudgetView/>
  </MemoryRouter>
)

describe("CreateBudgetView wizard", () => {
  beforeEach(() => {
    navigateMock.mockReset()
    successMock.mockReset()
    warningMock.mockReset()
    createBudgetMock.mockReset()
    localStorage.setItem("language", "en")
  })

  it("requires review step before creating budget when submitting via Enter", async () => {
    createBudgetMock.mockResolvedValue({})
    renderPage()

    fireEvent.change(screen.getByLabelText("startPeriod"), { target: { value: "2026-06" } })
    fireEvent.submit(screen.getByLabelText("startPeriod").closest("form")!)
    expect(createBudgetMock).not.toHaveBeenCalled()
    expect(screen.getByText("Budget.expectedIncome *")).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText("expectedIncome"), { target: { value: "1200" } })
    fireEvent.submit(screen.getByLabelText("expectedIncome").closest("form")!)
    expect(createBudgetMock).not.toHaveBeenCalled()
    expect(screen.getByText("page.budget.initial.wizard.review.title")).toBeInTheDocument()

    fireEvent.submit(screen.getByText("page.budget.initial.wizard.action.submit").closest("form")!)
    await waitFor(() => expect(createBudgetMock).toHaveBeenCalledWith({
      year: 2026,
      month: 6,
      income: 1200
    }))
  })

  it("blocks future months on step one", () => {
    renderPage()
    const now = new Date()
    const future = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    const futureValue = `${ future.getFullYear() }-${ String(future.getMonth() + 1).padStart(2, "0") }`

    fireEvent.change(screen.getByLabelText("startPeriod"), { target: { value: futureValue } })
    fireEvent.click(screen.getByText("common.action.next"))

    expect(screen.getByText("page.budget.initial.wizard.validation.start.future")).toBeInTheDocument()
    expect(createBudgetMock).not.toHaveBeenCalled()
  })

  it("shows submit error and keeps review step on create failure", async () => {
    createBudgetMock.mockRejectedValue(new Error("failed"))
    renderPage()

    fireEvent.change(screen.getByLabelText("startPeriod"), { target: { value: "2026-06" } })
    fireEvent.click(screen.getByText("common.action.next"))
    fireEvent.change(screen.getByLabelText("expectedIncome"), { target: { value: "800" } })
    fireEvent.click(screen.getByText("common.action.next"))
    fireEvent.click(screen.getByText("page.budget.initial.wizard.action.submit"))

    await waitFor(() => expect(createBudgetMock).toHaveBeenCalledTimes(1))
    expect(screen.getByText("page.budget.initial.wizard.submit.error")).toBeInTheDocument()
    expect(screen.getByText("page.budget.initial.wizard.review.title")).toBeInTheDocument()
  })
})

