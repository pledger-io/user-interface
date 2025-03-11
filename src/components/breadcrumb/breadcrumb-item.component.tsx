import { Link } from "react-router";

import Translation from "../localization/translation.component";
import {i10n} from "../../config/prime-locale";

const BreadCrumbItem = ({ message, label, href }: { message?: string, label?: string, href?: string }) => {
    let text = label ? i10n(label) : message;
    if (href) {
        text = <Link to={ href } className="flex-1 max-w-fit">{ text }</Link>
    }

    return <li className="flex-1 max-w-fit before:content-['\\']
                          nth-[n+4]:hidden
                          md:nth-[n+3]:block!
                          before:mr-1 nth-2:before:content-['']">{ text }</li>
}

export default BreadCrumbItem