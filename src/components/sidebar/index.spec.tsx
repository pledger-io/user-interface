import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";
import Sidebar from "./index";

const renderSidebar = (isOpen: boolean, onClose = vi.fn()) => {
  return render(
    <MemoryRouter>
      <Sidebar
        isOpen={ isOpen }
        onClose={ onClose }
        logoutCallback={ vi.fn() }
      />
    </MemoryRouter>
  )
}

describe('Sidebar', () => {
  it('renders six top-level section links', () => {
    const { container } = renderSidebar(true)
    const sectionLinks = container.querySelectorAll('nav > ul > li > a')
    expect(sectionLinks).toHaveLength(6)
  })

  it('does not render overlay close button when hidden', () => {
    renderSidebar(false)
    expect(document.querySelector('button[aria-label="a11y.navigation.close"]')).not.toBeInTheDocument()
  })

  it('marks links non-focusable when hidden', () => {
    const { container } = renderSidebar(false)
    const firstLink = container.querySelector('a[href="/dashboard"]')
    expect(firstLink).toBeInTheDocument()
    expect(firstLink).toHaveAttribute('tabindex', '-1')
  })

  it('closes when Escape key is pressed', () => {
    const onClose = vi.fn()
    renderSidebar(true, onClose)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not render always-visible child navigation lists', () => {
    const { container } = renderSidebar(true)
    const childLists = container.querySelectorAll('nav > ul > li > ul')
    expect(childLists).toHaveLength(0)
  })
})
