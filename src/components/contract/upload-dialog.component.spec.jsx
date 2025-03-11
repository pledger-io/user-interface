import user from '@testing-library/user-event';
import { fireEvent, render, waitFor } from "@testing-library/react";

import UploadContract from "./upload-dialog.component";
import {BrowserRouter} from "react-router";
import {mockedAxios} from "../../../__mocks__/axios.js";

describe('upload-contract', () => {

    beforeEach(() => {
        mockedAxios.post.mockImplementationOnce(_ => {
            return Promise.resolve({ fileCode: 'absded' })
        })
    })

    it('open upload contract', async () => {
        const { getByTestId } = render(<UploadContract id={1}/>, {wrapper: BrowserRouter})
        const button = getByTestId('upload-button')

        expect(button)
            .toBeInTheDocument()
            .toHaveAttribute('type', 'button')

        fireEvent.click(button)

        await waitFor(() => {
            expect(getByTestId('submit-button')).toBeInTheDocument()
        })
    })

    // it('should upload a contract', async () => {
    //     const { container, getByTestId } = render(<UploadContract id={1}/>, {wrapper: BrowserRouter})
    //
    //     const openButton = getByTestId('upload-button')
    //     fireEvent.click(openButton)
    //
    //     await waitFor(() => {
    //         expect(getByTestId('submit-button')).toBeInTheDocument()
    //     })
    //
    //     const uploadComponent = container.querySelector('.UploadAttachment')
    //     expect(uploadComponent).toBeInTheDocument()
    //
    //     user.upload(
    //         uploadComponent.querySelector('input'),
    //         new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' }))
    //
    //     const button = getByTestId('submit-button')
    //     expect(button).toBeInTheDocument()
    //     fireEvent.click(button)
    //
    //     await waitFor(() => {
    //         expect(button).not.toBeInTheDocument()
    //     })
    // })

})
