import {render, screen} from "@testing-library/react"
import {Date, Money, Percent} from "./Formatters"

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

describe("Date formatter", () => {
    test("Dutch date correct format", () => {
        localStorage.setItem("language", "nl")
        render(<Date date={'2020-01-02'} />)

        const element = screen.getByRole('date')
        expect(element).toHaveTextContent('2-1-2020')
    })

    test("English date correct formate", () => {
        localStorage.setItem("language", "en")
        render(<Date date={'2020-01-02'} />)

        const element = screen.getByRole('date')
        expect(element).toHaveTextContent('1/2/2020')
    })
})

describe("Percentage formatter", () => {
    test("Percentage should have 2 decimals", () => {
        localStorage.setItem("language", "en")
        render(<Percent decimals={2} percentage={0.34333}/>)

        const element = screen.getByRole('percentage')
        expect(element).toHaveTextContent('34.33%')
    })
    test("Percentage should have , as separator", () => {
        localStorage.setItem("language", "nl")
        render(<Percent decimals={2} percentage={0.34333}/>)

        const element = screen.getByRole('percentage')
        expect(element).toHaveTextContent('34,33%')
    })
})
