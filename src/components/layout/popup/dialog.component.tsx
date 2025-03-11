import { mdiCancel } from "@mdi/js";
import { ReactElement, Ref, useEffect, useRef } from "react";
import { Button } from "../button";

import Popup, { PopupCallbacks, PopupProps } from "./popup.component";

type DialogProps = PopupProps & {
    openButton?: ReactElement,
    control?: {
        close: () => void,
        open: () => void
    }
}

export const Dialog = ({ control, openButton, title, actions, className = '', children }: DialogProps) => {
    const dialogRef: Ref<PopupCallbacks> = useRef(null)

    useEffect(() => {
        if (control) {
            control.close = () => dialogRef.current?.close()
            control.open = () => dialogRef.current?.open()
        }
    }, [control, dialogRef])

    const open = () => dialogRef.current?.open()
    const close = () => dialogRef.current?.close()

    const actionsWithClose = [...actions, <Button key='cancel'
                                                  label='common.action.cancel'
                                                  variant='secondary'
                                                  onClick={ close }
                                                  icon={ mdiCancel }/>]

    return <>
        { openButton && <Button { ...(openButton.props as any) } onClick={ open }/> }
        <Popup title={ title }
               className={ className }
               ref={ dialogRef }
               actions={ actionsWithClose }>
            { children }
        </Popup>
    </>
}

export default Dialog
