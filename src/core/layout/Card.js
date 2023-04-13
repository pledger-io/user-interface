import * as Translations from "../Translation";
import PropTypes from "prop-types";
import React from "react";

import '../../assets/css/Card.scss'

/**
 * A basic card that has borders, an optional title bar and options to add buttons to the header and footer.
 *
 * @param title                 the optional title key for this card
 * @param actions               the buttons to be placed in the header of the card
 * @param buttons               the buttons to be placed in the footer of the card
 * @param children              the content of the card
 * @returns {JSX.Element}
 * @constructor
 */
const Card = ({ title, actions, buttons, children }) => {
    const hasHeader = (title || actions) !== undefined

    return (
        <div className='card'>
            { hasHeader && (
                <header>
                    {title && <Translations.Translation label={title} />}
                    {actions && <div className='Buttons'>{actions}</div>}
                </header>
            )}
            <article>{ children }</article>
            { buttons && <footer><div className='Buttons'>{buttons}</div></footer> }
        </div>
    )
}
Card.propTypes = {
    // The translation text key for the title of the card
    title: PropTypes.string,
    // The buttons that will be placed in the header of the card
    actions: PropTypes.arrayOf(PropTypes.element),
    // The buttons that will be placed in the footer of the card
    buttons: PropTypes.arrayOf(PropTypes.element)
}

export default Card
