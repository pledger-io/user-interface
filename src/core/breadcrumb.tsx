import { PropsWithChildren } from "react";
import Icon from "@mdi/react";
import { mdiMenu } from "@mdi/js";
import * as Translations from "./localization";
import { Link } from "react-router-dom";

export const BreadCrumbs = ({ children }: PropsWithChildren) => {
    const onMenuClick = () => window.dispatchEvent(new CustomEvent('hamburger-menu-click'));

    return <>
        <ol className='relative flex flex-wrap gap-1 border-b-separator
                       mx-[-2rem] max-h-[38px]
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

export const BreadCrumbItem = ({ message, label, href }: { message?: string, label?: string, href?: string }) => {
    let text = label ? <Translations.Translation label={label}/> : message;
    if (href) {
        text = <Link to={ href } className="flex-1 max-w-fit">{ text }</Link>
    }

    return <li className="flex-1 max-w-fit before:content-['\\']
                          [&:nth-child(n+4)]:hidden
                          md:[&:nth-child(n+3)]:!block
                          before:mr-1 [&:nth-child(2)]:before:content-['']">{ text }</li>
}

export const BreadCrumbMenu = ({ children, className = '' } : PropsWithChildren & { className?: string }) => {
    return <li className={`flex-1 text-right ${ className }`}>{ children }</li>
}