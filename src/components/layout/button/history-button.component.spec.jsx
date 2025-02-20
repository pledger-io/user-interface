import HistoryButtonComponent from "./history-button.component"
import { fireEvent, render } from "@testing-library/react";
import { mdiAccount } from "@mdi/js";
import {BrowserRouter} from "react-router";

describe(HistoryButtonComponent, () => {

    it("click on the back button", () => {
        const { getByRole } = render(
            <HistoryButtonComponent label='common.test' icon={mdiAccount}/>, {wrapper: BrowserRouter})
        const button = getByRole('button')

        expect(button).toBeInTheDocument()
        expect(button).toHaveAttribute('type', 'button')
        fireEvent.click(button)
        //expect(mockedReactRouter.useNavigate).toHaveBeenCalled()
    })
})
