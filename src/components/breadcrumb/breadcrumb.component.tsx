import { PropsWithChildren } from "react";
import Icon from "@mdi/react";
import { mdiMenu } from "@mdi/js";

const BreadCrumbs = ({ children }: PropsWithChildren) => {
    const onMenuClick = () => window.dispatchEvent(new CustomEvent('hamburger-menu-click'));

    return <>
        <ol className='relative flex flex-wrap gap-1 border-b-separator
                       mx-[-0.5rem] md:mx-[-1.25rem]
                       max-h-[38px]
                       border-b-[1px] py-2 px-2 bg-background'>
            <li className='block md:hidden cursor-pointer'
                onClick={ onMenuClick }>
                <Icon path={ mdiMenu } size={ .8 }/>
            </li>
            { children }
            <li className='DropDown'/>
        </ol>
    </>
}

export default BreadCrumbs