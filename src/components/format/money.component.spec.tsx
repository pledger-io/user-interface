import { render } from "@testing-library/react";
import MoneyComponent from "./money.component";

describe("MoneyComponent", () => {
    test("Should be correctly rendered", () => {
        const { container } = render(<MoneyComponent money={20.32233} currency={'EUR'} />)

        expect(container).toBeValid()
        expect(container).toBeInTheDocument()
    })

    test("Positive amount should be formatted", () => {
        const { getByTestId } = render(<MoneyComponent money={20.32233} currency={'EUR'} />)
        const element = getByTestId('money')
        expect(element).toHaveClass('Green')
        expect(element).toHaveTextContent('20.32')
    })

    test("Negative amount should be formatted", () => {
        const { getByTestId } = render(<MoneyComponent money={-20.32233} currency={'EUR'} />)
        const element = getByTestId('money')
        expect(element).toHaveClass('Red')
        expect(element).toHaveTextContent(/-.20\.32/)
    })
})
