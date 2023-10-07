import UploadContract from "./upload-contract";
import user from '@testing-library/user-event';
import {fireEvent, render, waitFor} from "@testing-library/react";
import {routerWrapped} from "../../setupTests";
import axios from "axios";

describe('upload-contract', () => {

    beforeEach(() => {
        axios.post.mockImplementationOnce(_ => {
            return Promise.resolve({fileCode: 'absded'})
        })
    })

    it('open upload contract', async () => {
        const {getByTestId} = render(routerWrapped(<UploadContract id={1}/>))
        const button = getByTestId('upload-button')

        expect(button).toBeInTheDocument()
        expect(button).toHaveAttribute('type', 'button')
        fireEvent.click(button)

        await waitFor(() => {
            expect(getByTestId('submit-button')).toBeInTheDocument()
        })
    })

    it('should upload a contract', async () => {
        const {container, getByTestId} = render(routerWrapped(<UploadContract id={1}/>))

        const openButton = getByTestId('upload-button')
        fireEvent.click(openButton)

        await waitFor(() => {
            expect(getByTestId('submit-button')).toBeInTheDocument()
        })

        const uploadComponent = container.querySelector('.UploadAttachment')
        expect(uploadComponent).toBeInTheDocument()

        user.upload(
            uploadComponent.querySelector('input'),
            new File(['(⌐□_□)'], 'chucknorris.png', {type: 'image/png'}))

        const button = getByTestId('submit-button')
        expect(button).toBeInTheDocument()
        fireEvent.click(button)

        await waitFor(() => {
            expect(button).not.toBeInTheDocument()
        })
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

})