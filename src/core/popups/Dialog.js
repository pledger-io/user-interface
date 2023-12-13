import { useEffect, useRef } from "react";
import { Buttons } from "../index";
import { mdiCancel } from "@mdi/js";
import PropTypes from "prop-types";
import Popup from "./Popup";

export const Dialog = ({ control, openButton, title, actions = [], className = '', children }) => {
    const dialogRef = useRef()

    useEffect(() => {
        if (control) {
            control.close = () => dialogRef.current.close()
            control.open = () => dialogRef.current.open()
        }
    }, [control, dialogRef])

    const actionsWithClose = [...actions, <Buttons.Button key='cancel'
                                                          label='common.action.cancel'
                                                          variant='secondary'
                                                          onClick={() => dialogRef.current.close()}
                                                          icon={mdiCancel}/>]

    return <>
        { openButton && <Buttons.Button {...openButton.props} onClick={() => dialogRef.current.open()}/> }
        <Popup title={title}
               className={className}
               ref={dialogRef}
               actions={actionsWithClose}>
            {children}
        </Popup>
    </>
}
Dialog.propTypes = {
    // The translation key that is used in the header of the popup
    title: PropTypes.string.isRequired,
    openButton: PropTypes.element,
    className: PropTypes.string,
    actions: PropTypes.arrayOf(PropTypes.element),
    control: PropTypes.shape({
        close: PropTypes.func,
        open: PropTypes.func
    })
}

export default Dialog
