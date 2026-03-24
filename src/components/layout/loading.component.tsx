import { Icon } from "@iconify-icon/react";
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
                <Icon icon='svg-spinners:tadpole' width='2em' />
            </div>
        )
    } else {
        return <>{ children }</>
    }
}

export default Loading