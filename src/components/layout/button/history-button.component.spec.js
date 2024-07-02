import HistoryButtonComponent from "./history-button.component"
import { fireEvent, render } from "@testing-library/react";
import { routerWrapped } from "../../../setupTests";
import { mdiAccount } from "@mdi/js";

describe(HistoryButtonComponent, () => {

    const mockNavigate = jest.fn()

    beforeEach(() => {
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useNavigate: () => mockNavigate
        }))
    })

    it("click on the back button", () => {
        const { getByRole } = render(
            routerWrapped(<HistoryButtonComponent label='common.test' icon={mdiAccount}/>))
        const button = getByRole('button')

        expect(button).toBeInTheDocument()
        expect(button).toHaveAttribute('type', 'button')
        fireEvent.click(button)
        //expect(mockNavigate).toBeCalled()
    })
})
