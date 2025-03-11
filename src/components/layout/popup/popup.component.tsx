import { mdiClose } from "@mdi/js";
import { PropsWithChildren, useImperativeHandle, useState } from "react";

import Translation from "../../localization/translation.component";
import { Button, ButtonBar } from "../button";

export type PopupProps = PropsWithChildren & {
    actions?: any
    title: string
    className?: string
}

export type PopupCallbacks = {
    close: () => void
    open: () => void
}

const Popup = ({ ref, title, className, actions, children }) => {
    const [closed, setClosed] = useState(true)

    useImperativeHandle(ref, () => ({
        close: () => setClosed(true),
        open: () => setClosed(false)
    }))

    if (closed) {
        return <></>
    }

    return <span className={ `Popup ${ className }` }>
            <div className='Dialog'>
                <header>
                    <Translation label={ title }/>
                    <Button icon={ mdiClose }
                            onClick={ () => setClosed(true) }
                            variant='icon'
                            className='secondary close'/>
                </header>
                <section>{ children }</section>
                { actions && <footer>
                    <ButtonBar>
                        { actions }
                    </ButtonBar>
                </footer> }
            </div>
        </span>
}

export default Popup
