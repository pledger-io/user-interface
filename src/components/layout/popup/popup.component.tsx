import { ForwardedRef, forwardRef, PropsWithChildren, useImperativeHandle, useState } from "react";
import { Buttons } from "../../../core";
import { mdiClose } from "@mdi/js";

import Translation from "../../localization/translation.component";

export type PopupProps = PropsWithChildren & {
    actions?: any
    title: string
    className?: string
}

export type PopupCallbacks = {
    close: () => void
    open: () => void
}

const Popup = forwardRef(({ title, className, actions, children }: PopupProps, ref: ForwardedRef<PopupCallbacks>) => {
    const [closed, setClosed] = useState(true)

    useImperativeHandle(ref, () => ({
        close: () => setClosed(true),
        open: () => setClosed(false)
    }))

    if (closed) {
        return <></>
    }

    return <span className={`Popup ${className}`}>
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
})

export default Popup
