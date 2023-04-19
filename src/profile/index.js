import React from "react";
import RestAPI from "../core/repositories/rest-api"
import defaultPicture from '../assets/user60.png';

export class ProfilePicture extends React.Component {
    render() {
        const {size} = this.props;

        if (RestAPI.user().hasOwnProperty('profilePicture')) {
            const base64Picture = `data:image/png;base64, ${RestAPI.activeUser.profilePicture}`;
            return (
                <img className='ProfilePicture' src={base64Picture} alt='profile' width={size}/>
            )
        }

        return <img className='ProfilePicture' src={defaultPicture} alt='profile' width={size}/>
    }
}
