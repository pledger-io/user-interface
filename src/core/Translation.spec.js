import {act, render, screen} from "@testing-library/react";
import {LocalizationService, Translation} from "./Translation";
import axios from "axios";
import {unmountComponentAtNode} from "react-dom";

describe('Translation', () => {

    let container = null

    beforeEach(() => {
        axios.get.mockImplementationOnce(_ => {
            return Promise.resolve({data: {test: 'Localization test'}})
        })

        LocalizationService.load('en')

        container = document.createElement('div')
        document.body.appendChild(container)
    })

    it('Verify not loaded text', async () => {
        act(() => {
            render(<Translation label='auto' />, container)
        })

        const translation = await screen.findByText('!Not translated! [auto]')
        expect(translation).toBeInTheDocument()
    })

    it('Render a localized text', async () => {
        act(() => {
            render(<Translation label='test' />, container)
        })

        const translation = await screen.findByText('Localization test')
        expect(translation).toBeInTheDocument()
    })

    afterEach(() => {
        jest.restoreAllMocks()

        unmountComponentAtNode(container)
        container.remove()
    })
})