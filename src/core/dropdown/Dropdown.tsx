import {FC, ReactNode, useEffect, useState} from "react";
import {Button} from "../buttons";

type DropdownProps = {
    actions?: DropdownActions,
    title?: string,
    icon: any,
    className?: string,
    children: ReactNode | ReactNode[],
}

export type DropdownActions = {
    close: () => void
}

const Dropdown: FC<DropdownProps> = ({actions, title, icon, className, children}) => {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (actions) actions.close = () => setOpen(false)
    }, [actions])

    const variant = title ? 'primary' : 'icon'
    return (
        <div className={ `relative ${className}` }>
            <Button variant={ variant }
                    label={ title }
                    className='text-gray-400'
                    icon={ icon }
                    iconPos='after'
                    onClick={ () => setOpen(!open) }/>
            <div className={`flex flex-col absolute right-0
                             [&>button]:rounded-none [&>button]:p-2 [&>button]:justify-start
                            ${open ? '' : 'invisible'} `}
                 onClick={ () => setOpen(false) }>
                { children }
            </div>
        </div>
    )
}

export default Dropdown
