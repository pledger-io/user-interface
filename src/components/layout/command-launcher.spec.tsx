import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";
import CommandLauncher, { CommandAction } from "./command-launcher";

const navigateMock = vi.fn()

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router')
  return {
    ...actual,
    useNavigate: () => navigateMock
  }
})

const commands: CommandAction[] = [
  {
    id: 'overview.dashboard',
    section: 'overview',
    label: 'Dashboard',
    description: 'Overview',
    to: '/dashboard',
    icon: 'mdi:view-dashboard-outline',
    keywords: ['overview'],
    aliases: ['home'],
    matchPrefixes: ['/dashboard']
  },
  {
    id: 'transactions.income-expense',
    section: 'transactions',
    label: 'Transactions',
    description: 'Income and expenses',
    to: '/transactions/income-expense',
    icon: 'mdi:swap-horizontal-bold',
    keywords: ['expenses'],
    aliases: ['income and expenses'],
    matchPrefixes: ['/transactions/income-expense']
  }
]

const renderLauncher = (onHide = vi.fn()) =>
  render(
    <MemoryRouter>
      <CommandLauncher visible={ true } commands={ commands } onHide={ onHide }/>
    </MemoryRouter>
  )

describe('CommandLauncher', () => {
  beforeAll(() => {
    Storage.prototype.getItem = vi.fn().mockReturnValue(null)
    Storage.prototype.setItem = vi.fn()
  })

  beforeEach(() => {
    navigateMock.mockClear()
  })

  it('selects first command with Enter', () => {
    const onHide = vi.fn()
    renderLauncher(onHide)
    const input = screen.getByRole('textbox')
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onHide).toHaveBeenCalledTimes(1)
    expect(navigateMock).toHaveBeenCalledWith('/dashboard')
  })

  it('selects highlighted command with keyboard navigation', () => {
    const onHide = vi.fn()
    renderLauncher(onHide)
    const input = screen.getByRole('textbox')
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onHide).toHaveBeenCalledTimes(1)
    expect(navigateMock).toHaveBeenCalledWith('/transactions/income-expense')
  })

  it('shows empty-state message for no matches', () => {
    renderLauncher()
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'not-found-route' } })
    expect(screen.getByText('layout.command.empty')).toBeInTheDocument()
  })

  it('shows grouped sections in the launcher', () => {
    renderLauncher()
    expect(screen.getByText('layout.command.group.recent')).toBeInTheDocument()
    expect(screen.getByText('layout.command.group.section')).toBeInTheDocument()
    expect(screen.getByText('layout.command.group.all')).toBeInTheDocument()
  })
})
