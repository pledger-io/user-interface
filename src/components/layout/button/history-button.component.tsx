import { useNavigate } from "react-router";
import React, { Attributes, FC } from "react";
import ButtonComponent from "./button.component";

type HistoryButtonProps = Attributes & {
    // The icon to be displayed in the button
    icon?: any,
    // The translation key to be used
    label: string
}

const HistoryButtonComponent: FC<HistoryButtonProps> = ({ icon, label }) => {
    const navigate = useNavigate()

    return <ButtonComponent icon={ icon }
                            label={ label }
                            type='reset'
                            text
                            severity='secondary'
                            onClick={ () => navigate(-1) }/>
}

export default HistoryButtonComponent
