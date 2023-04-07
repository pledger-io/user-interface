import {render, screen} from "@testing-library/react"
import {Money} from "./Formatters"

describe("Money formatting", () => {
    test("Should be correctly rendered", () => {
        render(<Money money={20.32233} currency={'EUR'} />)
        const element = screen.getByRole('money')
        expect(element).toBeValid()
        expect(element).toBeInTheDocument()
    })

    test("Positive amount should be formatted", () => {
        render(<Money money={20.32233} currency={'EUR'} />)
        const element = screen.getByRole('money')
        expect(element).toHaveClass('Green')
        expect(element).toHaveTextContent('20.32')
    })

    test("Negative amount should be formatted", () => {
        render(<Money money={-20.32233} currency={'EUR'} />)
        const element = screen.getByRole('money')
        expect(element).toHaveClass('Red')
        expect(element).toHaveTextContent(/-.20\.32/)
    })
})
