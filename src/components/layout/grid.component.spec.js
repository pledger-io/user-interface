import Grid from "../../components/layout/Grid";
import { render } from "@testing-library/react";

describe(Grid, () => {

    it("A column grid should have template columns", () => {
        const { container } = render(<Grid type='column' minWidth={'200px'}><div/></Grid>)

        const grid = container.querySelector('.grid')
        expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' })
    })
})
