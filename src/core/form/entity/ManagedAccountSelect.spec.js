import {ManagedAccountSelect} from "./ManagedAccountSelect";

import AccountRepository from "../../repositories/account-repository";

describe('ManagedAccountSelect', () => {

    beforeAll(() => {
        jest.enableAutomock()
        AccountRepository.own = () => Promise.resolve([])
    })

    afterAll(() => {
        jest.disableAutomock()
    });
})