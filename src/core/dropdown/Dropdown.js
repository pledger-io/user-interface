import {useEffect, useState} from "react";
import {Button} from "../buttons";
import PropTypes from "prop-types";

const Dropdown = ({actions, title, icon, children}) => {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (actions) actions.close = () => setOpen(false)
    }, [actions])

    const variant = title ? 'primary' : 'icon'
    return (
        <div className={`Dropdown ${variant}`}>
            <Button variant={variant} label={title} className='muted' icon={icon} iconPos='after' onClick={() => setOpen(!open)}/>
            <div className={`Expanded ${open}`} onClick={() => setOpen(false)}>{children}</div>
        </div>
    )
}
Dropdown.propTypes = {
    // The actions that can be triggered, has one function called close() on it
    actions: PropTypes.object,
    // The icon to be used
    icon: PropTypes.string,
    title: PropTypes.string
}

export default Dropdown
