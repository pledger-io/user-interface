import {render} from "@testing-library/react";
import {AccountTypeInput} from "./AccountTypeInput";
import {formWrapped} from "../../../setupTests";


describe('AccountTypeInput', () => {

    it("The account type dropdown should be filled", () => {
        render(formWrapped(<AccountTypeInput id='test' value={''}/>))
    })
})