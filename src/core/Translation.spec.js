import {render, waitFor} from "@testing-library/react";
import {LocalizationService, Translation} from "./Translation";
import axios from "axios";

describe('Translation', () => {

    beforeEach(() => {
        axios.get.mockImplementationOnce(_ => {
            return Promise.resolve({data: {test: 'Localization test'}})
        })

        LocalizationService.load('en')
    })

    it('Verify not loaded text', async () => {
        const {container} = render(<Translation label='test' />)

        expect(container.querySelector('.Translation'))
            .toHaveTextContent('!Not translated!')
    })

    it('Render a localized text', async () => {
        const {container} = render(<Translation label='test' />)

        await waitFor(() => expect(container.querySelector('.Translation'))
            .toHaveTextContent('Localization test'))
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })
})