import { Link } from "react-router";

import Translation from "../localization/translation.component";

const BreadCrumbItem = ({ message, label, href }: { message?: string, label?: string, href?: string }) => {
    let text = label ? <Translation label={label}/> : message;
    if (href) {
        text = <Link to={ href } className="flex-1 max-w-fit">{ text }</Link>
    }

    return <li className="flex-1 max-w-fit before:content-['\\']
                          [&:nth-child(n+4)]:hidden
                          md:[&:nth-child(n+3)]:!block
                          before:mr-1 [&:nth-child(2)]:before:content-['']">{ text }</li>
}

export default BreadCrumbItem