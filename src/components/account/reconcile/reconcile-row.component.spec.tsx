import { act, fireEvent, render, waitFor } from '@testing-library/react';
import React from "react";
import { NotificationProvider } from "../../../context/notification-context";
import ReconcileRowComponent from './reconcile-row.component';
import { BrowserRouter } from "react-router";
import { vi } from "vitest";
import AccountRepository from "../../../core/repositories/account-repository";
import { AccountReconcile } from "../../../types/types";


function tableWrapped(children: any) {
    return <BrowserRouter><table>
        <tbody>
        {children}
        </tbody>
    </table></BrowserRouter>
}

describe('ReconcileRowComponent', () => {
    const mockOnRemoved = vi.fn();
    const mockAccountId = '123';
    const mockProcess: AccountReconcile = {
        period: 2024,
        balance: {
            start: 1000,
            end: 1500
        },
        computed: {
            start: 1000
        }
    };

    beforeEach(() => {
      vi.stubGlobal('localStorage', {
        getItem: vi.fn().mockReturnValue('en'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn()
      });
    });

    it('should render the reconcile row with correct data', async () => {
        const { getByTestId } = render(tableWrapped(<ReconcileRowComponent process={ mockProcess }
                                                                            accountId={ mockAccountId }
                                                                            onRemoved={ mockOnRemoved }/>), { wrapper: NotificationProvider });

        await waitFor(() => expect(getByTestId(`retry-button-${mockProcess.period}`)).toBeInTheDocument());
        expect(getByTestId(`remove-row-${mockProcess.period}`)).toBeInTheDocument();
        expect(getByTestId(`previous-year-button-${mockProcess.period}`)).toBeInTheDocument();
    });

    it('should call onRemoved when process is retried', async () => {
        vi.spyOn(AccountRepository, 'yearReconcile').mockResolvedValue();

        const { getByTestId } = render(tableWrapped(<ReconcileRowComponent process={ mockProcess }
                                                                            accountId={ mockAccountId }
                                                                            onRemoved={ mockOnRemoved }/>), { wrapper: NotificationProvider });
        await waitFor(() => expect(getByTestId(`retry-button-${mockProcess.period}`)).toBeInTheDocument());

        const retryButton = getByTestId(`retry-button-${mockProcess.period}`);

        act(() => {
            fireEvent.click(retryButton);
        });

        await waitFor(() => expect(AccountRepository.yearReconcile).toHaveBeenCalledWith(mockAccountId, mockProcess));
        await waitFor(() => expect(mockOnRemoved).toHaveBeenCalled(), { timeout: 100 });
    });

    it('should render delete button', async () => {
        const { getByTestId } = render(tableWrapped(<ReconcileRowComponent process={mockProcess}
                                                                            accountId={ mockAccountId }
                                                                            onRemoved={mockOnRemoved}/>), { wrapper: NotificationProvider });
        await waitFor(() => expect(getByTestId(`remove-row-${mockProcess.period}`)).toBeInTheDocument());

        const deleteButton = getByTestId(`remove-row-${mockProcess.period}`);
        expect(deleteButton).toBeInTheDocument();
    })
});
