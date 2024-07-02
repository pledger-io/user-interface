import { render } from "@testing-library/react";
import DateComponent from "./date.component";

describe(DateComponent, () => {
    test("Dutch date correct format", () => {
        localStorage.setItem("language", "nl")
        const { container } = render(<DateComponent date={'2020-01-02'} />)

        const element = container.querySelector('.FormattedDate')
        expect(element).toHaveTextContent('2-1-2020')
    })

    test("English date correct formate", () => {
        localStorage.setItem("language", "en")
        const { container } = render(<DateComponent date={'2020-01-02'} />)

        const element = container.querySelector('.FormattedDate')
        expect(element).toHaveTextContent('1/2/2020')
    })

    test("No date provided", () => {
        const { container } = render(<DateComponent date={undefined} />)

        const element = container.querySelector('.FormattedDate')
        expect(element).toBeNull()
    })
})