import { fireEvent, render, waitFor } from '@testing-library/react';
import ProcessRepository from "../../../core/repositories/process.repository";
import NotificationService from "../../../service/notification.service";
import ReconcilePopup from "./reconcile-start.component";
import { Account } from "../../../types/types";
import {BrowserRouter} from "react-router";

jest.mock("../../../core/repositories/process.repository");
jest.mock("../../../core");

describe('ReconcilePopup', () => {
    const mockAccount = { id: '123', name: 'Test Account' } as Account;
    const mockAfterCreate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('submits the form successfully', async () => {
        ProcessRepository.start = jest.fn().mockResolvedValue({});
        NotificationService.success = jest.fn();

        const { getByTestId } = render(<ReconcilePopup account={ mockAccount } afterCreate={ mockAfterCreate }/>, {wrapper: BrowserRouter});

        fireEvent.click(getByTestId(`reconcile-open-button-${ mockAccount.id }`));

        await waitFor(() => expect(getByTestId('year-input')).toBeEnabled());

        fireEvent.change(getByTestId('year-input'), { target: { value: '2022' } });
        fireEvent.change(getByTestId('openBalance-input'), { target: { value: '1000' } });
        fireEvent.change(getByTestId('endBalance-input'), { target: { value: '2000' } });
        fireEvent.click(getByTestId(`reconcile-submit-button-${ mockAccount.id }`));

        await waitFor(() => expect(ProcessRepository.start).toHaveBeenCalled());
        expect(NotificationService.success).toHaveBeenCalled();
    });

});