import {render} from "@testing-library/react"
import {Date, Money, Percent} from "./Formatters"

describe(Money, () => {
    test("Should be correctly rendered", () => {
        const {container} = render(<Money money={20.32233} currency={'EUR'} />)

        expect(container).toBeValid()
        expect(container).toBeInTheDocument()
    })

    test("Positive amount should be formatted", () => {
        const {getByTestId} = render(<Money money={20.32233} currency={'EUR'} />)
        const element = getByTestId('money')
        expect(element).toHaveClass('Green')
        expect(element).toHaveTextContent('20.32')
    })

    test("Negative amount should be formatted", () => {
        const {getByTestId} = render(<Money money={-20.32233} currency={'EUR'} />)
        const element = getByTestId('money')
        expect(element).toHaveClass('Red')
        expect(element).toHaveTextContent(/-.20\.32/)
    })
})

describe("Date formatter", () => {
    test("Dutch date correct format", () => {
        localStorage.setItem("language", "nl")
        const {container} = render(<Date date={'2020-01-02'} />)

        const element = container.querySelector('.FormattedDate')
        expect(element).toHaveTextContent('2-1-2020')
    })

    test("English date correct formate", () => {
        localStorage.setItem("language", "en")
        const {container} = render(<Date date={'2020-01-02'} />)

        const element = container.querySelector('.FormattedDate')
        expect(element).toHaveTextContent('1/2/2020')
    })

    test("No date provided", () => {
        const {container} = render(<Date date={undefined} />)

        const element = container.querySelector('.FormattedDate')
        expect(element).toBeNull()
    })
})

describe("Percentage formatter", () => {
    test("Percentage should have 2 decimals", () => {
        localStorage.setItem("language", "en")
        const {container} = render(<Percent decimals={2} percentage={0.34333}/>)

        const element = container.querySelector('.Percentage')
        expect(element).toHaveTextContent('34.33%')
    })
    test("Percentage should have , as separator", () => {
        localStorage.setItem("language", "nl")
        const {container} = render(<Percent decimals={2} percentage={0.34333}/>)

        const element = container.querySelector('.Percentage')
        expect(element).toHaveTextContent('34,33%')
    })
})
