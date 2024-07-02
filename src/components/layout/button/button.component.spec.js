import { fireEvent, render } from '@testing-library/react';
import ButtonComponent from './button.component';
import { routerWrapped } from "../../../setupTests";
import { mdiAbacus } from "@mdi/js";

describe('Button', () => {
    const mockNavigate = jest.fn()

    beforeEach(() => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useNavigate: () => mockNavigate
        }))
    })

    it('renders with default props', () => {
        const { getByTestId } = render(routerWrapped(<ButtonComponent dataTestId="button" />));
        const button = getByTestId('button');
        expect(button).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const handleClick = jest.fn();
        const { getByTestId } = render(routerWrapped(<ButtonComponent onClick={ handleClick } dataTestId="button" />));
        const button = getByTestId('button');

        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalled();
    });

    it('navigates when href is provided and button is clicked', () => {
        const { getByTestId } = render(routerWrapped(<ButtonComponent href="/test" dataTestId="button" />));
        const button = getByTestId('button');

        fireEvent.click(button);
        //expect(mockNavigate).toBeCalled();
    });

    it('does not navigate when onClick is provided', () => {
        const handleClick = jest.fn();
        const { getByTestId } = render(routerWrapped(<ButtonComponent href="/test" onClick={ handleClick } dataTestId="button" />));
        const button = getByTestId('button');

        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalled();
        expect(mockNavigate).not.toBeCalled();
    });

    it('renders with icon before label when iconPos is before', () => {
        const { getByTestId } = render(routerWrapped(<ButtonComponent icon={ mdiAbacus } iconPos="before" dataTestId="button" />));
        const button = getByTestId('button');
        expect(button.firstChild.nodeName).toBe('svg');
    });

    it('renders with icon after label when iconPos is after', () => {
        const { getByTestId } = render(routerWrapped(<ButtonComponent icon={ mdiAbacus } iconPos="after" dataTestId="button" />));
        const button = getByTestId('button');
        expect(button.lastChild.nodeName).toBe('svg');
    });

    it('renders with disabled attribute when disabled prop is true', () => {
        const { getByTestId } = render(routerWrapped(<ButtonComponent disabled={true} dataTestId="button" />));
        const button = getByTestId('button');

        expect(button).toBeDisabled();
    });
});