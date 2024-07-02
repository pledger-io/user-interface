import React from "react";
import Translation from "../localization/translation.component";

type MessageProps = {
    label?: string;
    variant?: string;
    message?: string;
}

const Message = ({ label, variant, message }: MessageProps) => {
    const className = 'Message ' + variant;

    if (label) {
        return (
            <div className={className}>
                <Translation label={label}/>
            </div>
        )
    }

    return (
        <div className={className}>{message}</div>
    )
}

export default Message