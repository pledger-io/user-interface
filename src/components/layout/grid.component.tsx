import { CSSProperties, FC, ReactNode } from "react";

type GridProps = {
    type?: 'column' | 'row',        // the grid orientation
    minWidth?: string,              // the minimum width of the grid
    className?: string,             // the class name of the grid
    children: ReactNode[]
}

const Grid: FC<GridProps> = ({ type, children, minWidth, className = '' }) => {
    const style: CSSProperties = {}

    switch (type) {
        case 'column':
            style.gridTemplateColumns = `repeat(auto-fit, minmax(${ minWidth }, 1fr))`
            break
        default: console.log(`Unknown type provided ${ type }`)
    }

    return <>
        <div className={`grid w-full gap-3 ${ className }`} style={ style }>
            { children }
        </div>
    </>
}

export default Grid
