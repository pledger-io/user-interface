import LocalizationService from "./localization.service";
import {mockedAxios} from "../../__mocks__/axios.js";

const timesOut = async (promise, ms) => {
    const awaiting = Promise.race([promise, new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timed out')), 10)}
    )])

    try {
        return await awaiting
    } catch (e) {
        return 'Timed out'
    }
}

describe('LocalizationService', () => {

    beforeEach(() => {
        mockedAxios.get.mockImplementationOnce(_ => {
            return Promise.resolve({
                data: {
                    test: 'Localization test'
                }
            })
        })

        LocalizationService.load('en')
    })

    it('Verify text that is present', async () => {
        const translation = await LocalizationService.get('test')
        expect(translation).toBe('Localization test')
    })

    it('Verify text that is not present', async () => {
        const localization = await timesOut(LocalizationService.get('auto'), 10)
        expect(localization).toBe('Timed out')
    })
})