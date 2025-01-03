import { AccountTypeInput } from "./AccountTypeInput";
import { render, waitFor } from "@testing-library/react";
import axios from "axios";
import {Form} from "../Form";

const formWrapped = (component) => {
    return <Form entity='TestForm' onSubmit={_ => undefined}>
        {component}
    </Form>
}

describe('AccountTypeInput', () => {

    beforeEach(() => {
        axios.get.mockImplementationOnce(_ => {
            return Promise.resolve({ data: ['Car'] })
        })
    })

    it("The account type dropdown should be filled", async () => {
        const { container } = render(formWrapped(<AccountTypeInput id='test' value={''}/>))

        await waitFor(() => {
            expect(container.querySelector('option[value="Car"]')).toBeInTheDocument()
        })
    })

    afterEach(() => {
        jest.resetAllMocks()
    })
})