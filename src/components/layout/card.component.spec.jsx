import Card from "./card.component";
import {render} from "@testing-library/react";
import {Button} from "./button";
import {mdiAccount} from "@mdi/js";
import {BrowserRouter} from "react-router";

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
        const { container } = render(<Card actions={[button]}><div/></Card>, {wrapper: BrowserRouter})

        const header = container.querySelector('header')
        expect(header).toBeInTheDocument()

        const buttons = header.querySelector('button')
        expect(buttons).toHaveTextContent('test.button')
    })

    it("A card with buttons should have a footer", () => {
        const { container } = render(<Card buttons={[button]}><div/></Card>, {wrapper: BrowserRouter})

        const footer = container.querySelector('footer')
        expect(footer).toBeInTheDocument()

        const buttons = footer.querySelector('button')
        expect(buttons).toHaveTextContent('test.button')
    })
})
