import { CSSProperties, FC, ReactNode } from "react";

type GridProps = {
    type?: 'column' | 'row',        // the grid orientation
    minWidth?: string,              // the minimum width of the grid
    children: ReactNode[]
}

const Grid: FC<GridProps> = ({ type, children, minWidth }) => {
    const style: CSSProperties = {}

    switch (type) {
        case 'column':
            style.gridTemplateColumns = `repeat(auto-fit, minmax(${ minWidth }, 1fr))`
            break
        default: console.log(`Unknown type provided ${ type }`)
    }

    return <>
        <div className="grid w-full gap-3" style={ style }>
            { children }
        </div>
    </>
}

export default Grid
