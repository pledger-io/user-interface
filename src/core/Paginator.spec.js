import {render} from "@testing-library/react";
import {Paginator} from "./Paginator";
import {routerWrapped} from "../setupTests";

describe('Paginator', () => {

    it("Paginator should have the correct number of pages", () => {
        const {getByTestId, getAllByRole} = render(routerWrapped(<Paginator page={2} pageSize={10} records={100} />))

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
        const {getByTestId} = render(routerWrapped(<Paginator page={10} pageSize={10} records={100} />))
        const next = getByTestId('next-button')
        expect(next).toHaveClass('pointer-events-none')
    })

    it("Paginator first page disabled", () => {
        const {getByTestId} = render(routerWrapped(<Paginator page={0} pageSize={10} records={100} />))

        const previous = getByTestId('previous-button')
        expect(previous).toHaveClass('pointer-events-none')
    })
})
