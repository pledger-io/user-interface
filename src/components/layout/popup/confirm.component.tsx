import { mdiCancel, mdiRadioboxBlank } from "@mdi/js";
import React, { ReactElement, RefObject, useRef } from "react";
import { Button } from "../button";

import Popup, { PopupCallbacks, PopupProps } from "./popup.component";

export type ConfirmProps = PopupProps & {
    onConfirm?: () => void,
    openButton: ReactElement
}

/**
 * A confirm dialog that can be used to get feedback from the user.
 */
const ConfirmComponent = (props: ConfirmProps) => {
    const dialogRef: RefObject<PopupCallbacks | null> = useRef(null)
    const { openButton, onConfirm, children } = props

    const onOpenClick = () => dialogRef.current?.open()
    const onConfirmClick = () => {
        if (onConfirm) onConfirm()
        dialogRef.current?.close()
    }
    const onCloseClick = () => dialogRef.current?.close()

    return <>
        <Button { ...(openButton.props as any) } onClick={ onOpenClick }/>
        <Popup ref={ dialogRef }
               { ...props }
               actions={ [
                   <Button label='common.action.confirm'
                           key='confirm'
                           severity='warning'
                           data-testid={ 'confirm-button' }
                           onClick={ onConfirmClick }
                           icon={ mdiRadioboxBlank }/>,
                   <Button label='common.action.cancel'
                           key='cancel'
                           severity='secondary'
                           onClick={ onCloseClick }
                           icon={ mdiCancel }/>] }>{ children }</Popup>
    </>
}

export default ConfirmComponent
