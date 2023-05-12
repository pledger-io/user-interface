import {useNavigate} from "react-router-dom";
import React, {FC} from "react";
import Button from "./Button";

type HistoryButtonProps = {
    // The icon to be displayed in the button
    icon?: any,
    // The translation key to be used
    label: string
}

const HistoryButton: FC<HistoryButtonProps> = ({icon, label}) => {
    const navigate = useNavigate()

    return <Button icon={icon}
                label={label}
                variant='secondary'
                onClick={() => navigate(-1)}/>
}

export default HistoryButton
