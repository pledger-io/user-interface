import RestAPI from "../../core/repositories/rest-api";
import defaultPicture from '../../assets/user60.png';

const ProfilePicture = ({ size, className }: { size: number, className?: string }) => {

    if ((RestAPI.user() as any).profilePicture) {
        const base64Picture = `data:image/png;base64, ${ (RestAPI.user() as any).profilePicture }`;
        return (
            <img className={ `ProfilePicture ${ className }` } src={ base64Picture } alt='profile' width={ size }/>
        )
    }

    return <img className={ `ProfilePicture ${ className }` } src={ defaultPicture as string } alt='profile' width={ size }/>
}

export default ProfilePicture