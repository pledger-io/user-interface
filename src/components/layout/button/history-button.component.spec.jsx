import HistoryButtonComponent from "./history-button.component"
import { fireEvent, render } from "@testing-library/react";
import {BrowserRouter} from "react-router";

describe(HistoryButtonComponent, () => {

    it("click on the back button", () => {
        const { getByRole } = render(
            <HistoryButtonComponent label='common.test' icon={ 'mdi:account' }/>, {wrapper: BrowserRouter})
        const button = getByRole('button')

        expect(button).toBeInTheDocument()
        expect(button).toHaveAttribute('type', 'reset')
        fireEvent.click(button)
        //expect(mockedReactRouter.useNavigate).toHaveBeenCalled()
    })
})
