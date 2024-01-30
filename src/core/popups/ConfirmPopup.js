import { Buttons } from "../index";
import { mdiCancel, mdiRadioboxBlank } from "@mdi/js";
import React, { useRef } from "react";
import Popup from "./Popup";

/**
 * A confirm dialog that can be used to get feedback from the user.
 */
const ConfirmPopup = (props) => {
    const dialogRef = useRef()
    const { openButton, onConfirm = () => undefined, children } = props

    const onConfirmClick = () => dialogRef.current.close() || onConfirm()
    const onCloseClick = () => dialogRef.current.close()

    return <>
        <Buttons.Button {...openButton.props} onClick={() => dialogRef.current.open()}/>
        <Popup ref={dialogRef}
               {...props}
               actions={[
                   <Buttons.Button label='common.action.confirm'
                                   key='confirm'
                                   variant='warning'
                                   dataTestId={'confirm-button'}
                                   onClick={onConfirmClick}
                                   icon={mdiRadioboxBlank}/>,
                   <Buttons.Button label='common.action.cancel'
                                   key='cancel'
                                   variant='secondary'
                                   onClick={onCloseClick}
                                   icon={mdiCancel}/>]}>{children}</Popup>
    </>
}
// ConfirmPopup.propTypes = {
//     // The translation key that is used in the header of the popup
//     title: PropTypes.string.isRequired,
//     // The callback handler that is used when the user accepts the popup
//     onConfirm: PropTypes.func.isRequired,
//     // The button to open the confirm popup
//     openButton: PropTypes.any
// }

export default ConfirmPopup
