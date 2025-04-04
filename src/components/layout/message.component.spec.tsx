import React from 'react';
import { act, render } from '@testing-library/react';
import Message from './message.component';
import { mockedAxios } from "../../../__mocks__/axios";
import LocalizationService from "../../service/localization.service";

describe('Message', () => {
    it('renders label within Translation component when label prop is provided', async () => {
        mockedAxios.get.mockImplementationOnce(() => {
            return Promise.resolve({ data: { testLabel: 'Translated text' } })
        })
        LocalizationService.load('en')

        const { getByText } = await act(() => render(<Message label="testLabel" variant="testVariant"/>))
        expect(getByText('Translated text')).toBeInTheDocument();
    });

    it('renders message directly when label prop is not provided', () => {
        const { getByText } = render(<Message message="testMessage" variant="testVariant"/>);
        expect(getByText('testMessage')).toBeInTheDocument();
    });

    it('applies the correct className based on variant prop', () => {
        const { container } = render(<Message variant="testVariant"/>);
        expect(container.firstChild).toHaveClass('Message testVariant');
    });
});