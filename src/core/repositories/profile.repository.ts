import RestAPI from "./rest-api";

type ProfilePatch = {
    theme?: string;
    currency?: string;
    password?: string;
}

const ProfileRepository = (api => {
    return {
        patch: (data: ProfilePatch) => api.patch('profile', data),
        get2Factor: () : Promise<string | ArrayBuffer | null> => new Promise((resolved, reject) => {
            api.get('profile/multi-factor/qr-code', {responseType: 'blob'})
                .then(rawData => {
                    const fileReader = new FileReader();
                    fileReader.onloadend = () => {
                        const {result} = fileReader
                        resolved(result)
                    }
                    fileReader.readAsDataURL(rawData);
                }).catch(reject)
        }),
        enableMfa: (verificationCode: string)               => api.post('profile/multi-factor/enable', {verificationCode}),
        disableMfa: ()                                      => api.post('profile/multi-factor/disable', {}),
    }
})(RestAPI)

export default ProfileRepository