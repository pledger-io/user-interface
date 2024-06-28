import { render } from '@testing-library/react';
import { AccountInput } from './AccountInput';
import { formWrapped } from "../../../setupTests";

jest.mock('../../repositories/rest-api');

describe('AccountInput', () => {
    const mockOnChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render without crashing', async () => {
        render(formWrapped(<AccountInput id='account' type='DEBTOR' onChange={ mockOnChange }/>));
    });

});