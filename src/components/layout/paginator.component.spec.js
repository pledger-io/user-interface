import { render } from "@testing-library/react";
import { Paginator } from "./paginator.component";
import { routerWrapped } from "../../setupTests";
import {BrowserRouter} from "react-router";

describe('Paginator', () => {

    it("Paginator should have the correct number of pages", () => {
        const { getByTestId, getAllByRole } = render(<Paginator page={2} pageSize={10} records={100} />, {wrapper: BrowserRouter})

        const previous = getByTestId('previous-button')
        const next = getByTestId('next-button')
        const current = getByTestId('page-current')
        const pageButtons = getAllByRole('page-button')

        expect(previous).not.toHaveClass('pointer-events-none')
        expect(current).toHaveTextContent('2')
        expect(pageButtons.length).toEqual(9)
        expect(next).not.toHaveClass('pointer-events-none')
    })

    it("Paginator last page disabled", () => {
        const { getByTestId } = render(<Paginator page={10} pageSize={10} records={100} />, {wrapper: BrowserRouter})
        const next = getByTestId('next-button')
        expect(next).toHaveClass('pointer-events-none')
    })

    it("Paginator first page disabled", () => {
        const { getByTestId } = render(<Paginator page={0} pageSize={10} records={100} />, {wrapper: BrowserRouter})

        const previous = getByTestId('previous-button')
        expect(previous).toHaveClass('pointer-events-none')
    })
})
