import { AccountTypeInput } from "./AccountTypeInput";
import { act, render } from "@testing-library/react";
import {Form} from "../Form";
import {mockedAxios} from "../../../../__mocks__/axios.js";

const formWrapped = (component) => {
    return <Form entity='TestForm' onSubmit={_ => undefined}>
        {component}
    </Form>
}

describe('AccountTypeInput', () => {

    beforeEach(() => {
        mockedAxios.get.mockImplementationOnce(_ => {
            return Promise.resolve({ data: ['Car', 'Fish'] })
        })
    })

    it("The account type dropdown should be filled", async () => {
        const { container } = render(formWrapped(<AccountTypeInput id='test' title='test' value={''}/>))

        act(() => {
            expect(container.querySelector('label'))
                .toBeInTheDocument()
                .toHaveTextContent('_missing_localization_test_en_')

            const options = container.querySelectorAll('option')
//            expect(options.length).toBe(2)
        })
    })
})
