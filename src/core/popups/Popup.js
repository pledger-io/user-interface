import {forwardRef, useImperativeHandle, useState} from "react";
import {Translation} from "../localization";
import {Buttons} from "../index";
import {mdiClose} from "@mdi/js";
import PropTypes from "prop-types";

const Popup = forwardRef(({title, className, actions, children}, ref) => {
    const [closed, setClosed] = useState(true)

    useImperativeHandle(ref, () => ({
        close: () => setClosed(true),
        open: () => setClosed(false)
    }))

    if (closed) {
        return <></>
    }

    return (
        <span className={`Popup ${className}`}>
            <div className='Dialog'>
                <header>
                    <Translation label={title}/>
                    <Buttons.Button icon={mdiClose}
                                    onClick={() => setClosed(true)}
                                    variant='icon'
                                    className='secondary close'/>
                </header>
                <section>{children}</section>
                {actions && <footer>
                    <Buttons.ButtonBar>
                        {actions}
                    </Buttons.ButtonBar>
                </footer>}
            </div>
        </span>
    )
})
Popup.propTypes = {
    // The components that will be added to the footer of the popup
    actions: PropTypes.any,
    // The translation key that is used in the header of the popup
    title: PropTypes.string.isRequired,
    className: PropTypes.string,
}

export default Popup
