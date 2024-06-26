import { Buttons } from "../../../core";
import { mdiCancel, mdiRadioboxBlank } from "@mdi/js";
import React, { LegacyRef, ReactElement, useRef } from "react";

import Popup, { PopupCallbacks, PopupProps } from "./popup.component";

export type ConfirmProps = PopupProps & {
    onConfirm?: () => void,
    openButton: ReactElement
}

/**
 * A confirm dialog that can be used to get feedback from the user.
 */
const ConfirmComponent = (props: ConfirmProps) => {
    const dialogRef: LegacyRef<PopupCallbacks> = useRef(null)
    const { openButton, onConfirm = () => undefined, children } = props

    const onOpenClick = () => dialogRef.current?.open()
    const onConfirmClick = () => dialogRef.current?.close() || onConfirm()
    const onCloseClick = () => dialogRef.current?.close()

    return <>
        <Buttons.Button {...openButton.props} onClick={ onOpenClick }/>
        <Popup ref={dialogRef}
               {...(props as PopupProps)}
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

export default ConfirmComponent
