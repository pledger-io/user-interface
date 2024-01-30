import { render, fireEvent, waitFor } from '@testing-library/react';
import ProcessRepository from "../../../core/repositories/process.repository";
import { Notifications } from "../../../core";
import { routerWrapped } from "../../../setupTests";
import ReconcilePopup from "./reconcile-start.component";
import { Account } from "../../../core/types";

jest.mock("../../../core/repositories/process.repository");
jest.mock("../../../core");

describe('ReconcilePopup', () => {
    const mockAccount = {id: '123', name: 'Test Account'} as Account;
    const mockAfterCreate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('submits the form successfully', async () => {
        ProcessRepository.start = jest.fn().mockResolvedValue({});
        Notifications.Service.success = jest.fn();

        const {getByTestId} = render(
            routerWrapped(<ReconcilePopup account={ mockAccount } afterCreate={ mockAfterCreate }/>));

        fireEvent.click(getByTestId(`reconcile-open-button-${ mockAccount.id }`));

        await waitFor(() => expect(getByTestId('year-input')).toBeEnabled());

        fireEvent.change(getByTestId('year-input'), {target: {value: '2022'}});
        fireEvent.change(getByTestId('openBalance-input'), {target: {value: '1000'}});
        fireEvent.change(getByTestId('endBalance-input'), {target: {value: '2000'}});
        fireEvent.click(getByTestId(`reconcile-submit-button-${ mockAccount.id }`));

        await waitFor(() => expect(ProcessRepository.start).toHaveBeenCalled());
        expect(Notifications.Service.success).toHaveBeenCalled();
    });

});