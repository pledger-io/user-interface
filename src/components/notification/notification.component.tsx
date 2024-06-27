import React, { Attributes } from "react";

import { NotificationEvent } from "../../service/notification.service";
import Translation from "../localization/translation.component";

const Notification = ({ type, message, label } : Attributes & NotificationEvent) => {
    return (
        <div className={`Notification ${type}`}>
            { label && <Translation label={ label } /> }
            { message && <span>{ message }</span> }
            <div className='CountDown' />
        </div>
    );
}

export default Notification