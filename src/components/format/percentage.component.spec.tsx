import { render } from "@testing-library/react";
import PercentageComponent from "./percentage.component";

describe("Percentage formatter", () => {
    test("Percentage should have 2 decimals", () => {
        localStorage.setItem("language", "en")
        const { container } = render(<PercentageComponent decimals={2} percentage={0.34333}/>)

        const element = container.querySelector('.Percentage')
        expect(element).toHaveTextContent('34.33%')
    })
    test("Percentage should have , as separator", () => {
        localStorage.setItem("language", '"nl"')
        const { container } = render(<PercentageComponent decimals={2} percentage={0.34333}/>)

        const element = container.querySelector('.Percentage')
        expect(element).toHaveTextContent('34,33%')
    })
})
