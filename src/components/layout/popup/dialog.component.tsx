import { LegacyRef, ReactElement, useEffect, useRef } from "react";
import { Buttons } from "../../../core";
import { mdiCancel } from "@mdi/js";

import Popup, { PopupCallbacks, PopupProps } from "./popup.component";

type DialogProps = PopupProps & {
    openButton?: ReactElement,
    control?: {
        close: () => void,
        open: () => void
    }
}

export const Dialog = ({ control, openButton, title, actions = [], className = '', children }: DialogProps) => {
    const dialogRef: LegacyRef<PopupCallbacks> = useRef(null)

    useEffect(() => {
        if (control) {
            control.close = () => dialogRef.current?.close()
            control.open = () => dialogRef.current?.open()
        }
    }, [control, dialogRef])

    const open = () => dialogRef.current?.open()
    const close = () => dialogRef.current?.close()

    const actionsWithClose = [...actions, <Buttons.Button key='cancel'
                                                          label='common.action.cancel'
                                                          variant='secondary'
                                                          onClick={ close }
                                                          icon={ mdiCancel }/>]

    return <>
        { openButton && <Buttons.Button { ...openButton.props } onClick={ open }/> }
        <Popup title={ title }
               className={ className }
               ref={ dialogRef }
               actions={ actionsWithClose }>
            { children }
        </Popup>
    </>
}

export default Dialog
