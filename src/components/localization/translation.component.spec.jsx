import { act, screen } from "@testing-library/react";
import LocalizationService from "../../service/localization.service";

import Translation from "./translation.component";
import {createRoot} from "react-dom/client";
import {mockedAxios} from "../../../__mocks__/axios.js";

describe('Translation', () => {

    let root = null

    beforeEach(() => {
        mockedAxios.get.mockImplementationOnce(_ => {
            return Promise.resolve({ data: { test: 'Localization test' } })
        })

        LocalizationService.load('en')

        let container = document.createElement('div')
        document.body.appendChild(container)
        root = createRoot(container)
    })

    it('Verify not loaded text', async () => {
        act(() => {
            root.render(<Translation label='auto' />)
        })

        const translation = await screen.findByText('!Not translated! [auto]')
        expect(translation).toBeInTheDocument()
    })

    it('Render a localized text', async () => {
        act(() => {
            root.render(<Translation label='test' />)
        })

        const translation = await screen.findByText('Localization test')
        expect(translation).toBeInTheDocument()
    })

    afterEach(async () => {
        vi.restoreAllMocks()
        act(() => {
            root.unmount()
        })
    })
})