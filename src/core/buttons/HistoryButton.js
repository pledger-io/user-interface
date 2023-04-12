import {useNavigate} from "react-router-dom";
import Icon from "@mdi/react";
import {Translation} from "../Translation";
import PropTypes from "prop-types";
import React from "react";

const HistoryButton = ({style = '', icon, label}) => {
    const navigate = useNavigate()

    return (
        <button
            type='button'
            className={`Button ${style}`}
            onClick={() => navigate(-1)}>
            <Icon path={icon} size={.8}/>
            <Translation label={label}/>
        </button>)
}
HistoryButton.propTypes = {
    // The variant to be applied to the button
    style: PropTypes.oneOf(['primary', 'warning', 'icon', 'text']),
    // The icon to be displayed in the button
    icon: PropTypes.any,
    // The translation key to be used
    label: PropTypes.string.isRequired
}

export default HistoryButton
