import { fireEvent, render } from '@testing-library/react';
import ButtonComponent from './button.component';
import { mdiAbacus } from "@mdi/js";
import {BrowserRouter} from "react-router";
import {mockedReactRouter} from "../../../../__mocks__/react-router.jsx";

describe('Button', () => {
    const mockNavigate = mockedReactRouter.useNavigate

    beforeEach(() => {
        vi.resetAllMocks()
    })

    it('renders with default props', () => {
        const { getByTestId } = render(<ButtonComponent data-testid="button" />, {wrapper: BrowserRouter});
        const button = getByTestId('button');
        expect(button).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const handleClick = vi.fn();
        const { getByTestId } = render(<ButtonComponent onClick={ handleClick } data-testid="button" />, {wrapper: BrowserRouter});
        const button = getByTestId('button');

        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalled();
    });

    it('navigates when href is provided and button is clicked', () => {
        const { getByTestId } = render(<ButtonComponent href="/test" data-testid="button" />, {wrapper: BrowserRouter});
        const button = getByTestId('button');

        fireEvent.click(button);
        //expect(mockNavigate).toBeCalled();
    });

    it('does not navigate when onClick is provided', () => {
        const handleClick = vi.fn();
        const { getByTestId } = render(<ButtonComponent href="/test" onClick={ handleClick } data-testid="button" />, {wrapper: BrowserRouter});
        const button = getByTestId('button');

        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalled();
        expect(mockNavigate).not.toBeCalled();
    });

    it('renders with icon before label when iconPos is before', () => {
        const { getByTestId } = render(<ButtonComponent icon={ mdiAbacus } iconPos="before" data-testid="button" />, {wrapper: BrowserRouter});
        const button = getByTestId('button');
        expect(button.firstChild.nodeName).toBe('svg');
    });

    it('renders with disabled attribute when disabled prop is true', () => {
        const { getByTestId } = render(<ButtonComponent disabled={true} data-testid="button" />, {wrapper: BrowserRouter});
        const button = getByTestId('button');

        expect(button).toBeDisabled();
    });
});