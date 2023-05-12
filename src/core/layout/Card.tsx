import * as Translations from "../Translation";
import React, {FC, ReactNode} from "react";

import {Buttons} from "../index";

type CardProps = {
    title?: string,                             // The translation text key for the title of the card
    actions?: ReactNode[],                      // The buttons that will be placed in the header of the card
    buttons?: ReactNode[],                      // The buttons that will be placed in the footer of the card
    children: ReactNode | ReactNode[],
    className?: string
}

/**
 * A basic card that has borders, an optional title bar and options to add buttons to the header and footer.
 *
 * @param title                 the optional title key for this card
 * @param actions               the buttons to be placed in the header of the card
 * @param buttons               the buttons to be placed in the footer of the card
 * @param className             the additional CSS classes
 * @param children              the content of the card
 * @returns {JSX.Element}
 * @constructor
 */
const Card: FC<CardProps> = ({title, actions, buttons, children, className = ''}) => {
    const hasHeader = (title || actions) !== undefined

    return (
        <div className={`card rounded-lg my-4 ${className}`}>
            {hasHeader && (
                <header className='bg-header py-2 px-4 flex items-center justify-between
                                   font-bold text-lg rounded-t-lg
                                   border-b-solid border-b-[1px] border-bottom-separator'>
                    {title && <Translations.Translation label={title}/>}
                    {actions && <div className='font-normal text-sm'>{ actions }</div>}
                </header>
            )}
            <article className='bg-white p-5 first:rounded-t-lg last:rounded-b-lg'>
                {children}
            </article>
            {buttons &&
                <footer className='bg-header py-2 px-4 text-right rounded-b-lg'>
                    <Buttons.ButtonBar>{buttons}</Buttons.ButtonBar>
                </footer>}
        </div>
    )
}

export default Card
