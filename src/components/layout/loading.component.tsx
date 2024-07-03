import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";
import { FC, ReactNode } from "react";

type LoadingProps = {
    condition?: boolean,
    children?: ReactNode | ReactNode[]
}

/**
 * Display a loading icon until the condition becomes true.
 */
const Loading: FC<LoadingProps> = ({ condition, children }) => {
    if (!condition) {
        return (
            <div className='flex justify-center'>
                <Icon path={ mdiLoading } spin={ true } size={ 2 } />
            </div>
        )
    } else {
        return <>{ children }</>
    }
}

export default Loading