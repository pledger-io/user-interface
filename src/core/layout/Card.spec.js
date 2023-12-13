import Card from "./Card";
import { render } from "@testing-library/react";
import { Button } from "../buttons";
import { routerWrapped } from "../../setupTests";
import { mdiAccount } from "@mdi/js";

describe('Card', () => {
    let button = <Button label='test.button' icon={mdiAccount} key='button'/>

    it("A card with a title should have a header", () => {
        const { container } = render(<Card title='common.test'><div/></Card>)

        const header = container.querySelector('header')
        expect(header).toBeInTheDocument()

        const translation = header.querySelector('.Translation')
        expect(translation).toHaveTextContent('common.test')
    })

    it("A card with actions should have a header", () => {
        const { container } = render(routerWrapped(<Card actions={[button]}><div/></Card>))

        const header = container.querySelector('header')
        expect(header).toBeInTheDocument()

        const buttons = header.querySelector('button')
        expect(buttons).toHaveTextContent('test.button')
    })

    it("A card with buttons should have a footer", () => {
        const { container } = render(routerWrapped(<Card buttons={[button]}><div/></Card>))

        const footer = container.querySelector('footer')
        expect(footer).toBeInTheDocument()

        const buttons = footer.querySelector('button')
        expect(buttons).toHaveTextContent('test.button')
    })
})
