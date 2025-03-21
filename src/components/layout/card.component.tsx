import React, { Attributes, FC, ReactNode } from "react";

import Translation from "../localization/translation.component";
import ButtonBar from "./button/button-bar.component";

type CardProps = Attributes & {
    title?: string,                             // The translation text key for the title of the card
    message?: string,                           // The message that will be displayed as title of the card
    actions?: ReactNode[],                      // The buttons that will be placed in the header of the card
    buttons?: ReactNode[],                      // The buttons that will be placed in the footer of the card
    children: ReactNode | ReactNode[],
    className?: string
}

/**
 * A basic card that has borders, an optional title bar and options to add buttons to the header and footer.
 *
 * @constructor
 */
const Card: FC<CardProps> = ({ title, actions, buttons, children, className = '', message }) => {
    const hasHeader = (title || actions || message) !== undefined

    return (
        <div className={`card rounded-lg my-4 ${ className }`}>
            {hasHeader && (
                <header className='bg-header py-2 px-4 flex items-center justify-between
                                   font-bold text-lg rounded-t-lg
                                   border-b-solid border-b-[1px] border-bottom-separator'>
                    {title && <Translation label={ title }/>}
                    {message !== undefined && <div>{ message }</div> }
                    {actions && <div className='font-normal text-sm flex gap-0.5'>{ actions }</div>}
                </header>
            )}
            <article className='bg-white py-4 md:px-4 first:rounded-t-lg last:rounded-b-lg'>
                { children }
            </article>
            { buttons &&
                <footer className='bg-header py-2 px-4 text-right rounded-b-lg'>
                    <ButtonBar>{buttons}</ButtonBar>
                </footer>
            }
        </div>
    )
}

export default Card
