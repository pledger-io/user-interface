import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { NotificationProvider } from "../../../context/notification-context";
import AccountRepository from "../../../core/repositories/account-repository";
import ReconcilePopup from "./reconcile-start.component";
import { Account } from "../../../types/types";
import { BrowserRouter } from "react-router";
import { vi } from "vitest";

describe('ReconcilePopup', () => {
  const mockAccount = { id: '123', name: 'Test Account' } as Account;
  const mockAfterCreate = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn().mockReturnValue('en'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    });
  });

  it('submits the form successfully', async () => {
    AccountRepository.yearReconcile = vi.fn().mockResolvedValue({});
    const ref = { current: null };

    const { getByTestId } = render(
      <NotificationProvider>
        <ReconcilePopup ref={ ref } account={ mockAccount } afterCreate={ mockAfterCreate }/>
      </NotificationProvider>, { wrapper: BrowserRouter });

    act(() => {
      (ref.current as any)?.open()
    })

    await waitFor(() => expect(getByTestId('year-input')).toBeEnabled());

    fireEvent.change(getByTestId('year-input'), { target: { value: '2022' } });
    fireEvent.change(getByTestId('openBalance-input'), { target: { value: '1000' } });
    fireEvent.blur(getByTestId('openBalance-input'));
    fireEvent.change(getByTestId('endBalance-input'), { target: { value: '2000' } });
    fireEvent.blur(getByTestId('endBalance-input'));
    fireEvent.click(getByTestId(`reconcile-submit-button-${ mockAccount.id }`));

    await waitFor(() => expect(AccountRepository.yearReconcile).toHaveBeenCalledWith(mockAccount.id, {
      balance: {
        start: undefined,
        end: undefined
      },
      period: '2022'
    }));
  });

});
