import {FC, ReactNode} from "react";

type ButtonBarProps = {
    children: ReactNode[],
    className?: string
}
const ButtonBar: FC<ButtonBarProps> = ({ children, className }) => {
    return <>
        <div className={`flex justify-end gap-1 ${className}`}>
            { children }
        </div>
    </>
}

export default ButtonBar