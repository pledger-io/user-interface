import { FC, JSX } from "react";
import { Link } from "react-router";
import { i10n } from "../../config/prime-locale";

export type BreadCrumbItemProps = {
  message?: string,
  label?: string,
  href?: string
}

const BreadCrumbItem: FC<BreadCrumbItemProps> = ({ message, label, href }) => {
  let text: string | JSX.Element | undefined = label ? i10n(label) : message;
  if (href) {
    text = <Link to={ href } className="flex-1 max-w-fit">{ text }</Link>
  }

  return <li className="flex-1 max-w-fit before:content-['\\']
                          nth-[n+4]:hidden
                          md:nth-[n+3]:block!
                          before:mr-1 nth-2:before:content-['']">{ text }</li>
}

export default BreadCrumbItem
