import { PropsWithChildren } from "react";

export const BreadCrumbMenu = ({ children, className = '' } : PropsWithChildren & { className?: string }) => {
    return <li className={`flex-1 text-right ${ className }`}>{ children }</li>
}

export default BreadCrumbMenu