import RestAPI from "./rest-api";

type ProfilePatch = {
    theme?: string;
    currency?: string;
    password?: string;
}

function toBlob(data: string, type: string = 'application/json') {
    const ab = atob(data.split(',')[1])
    const buffer = new ArrayBuffer(ab.length)
    const ia = new Uint8Array(buffer);
    for (let i = 0; i < ab.length; i++) {
        ia[i] = ab.charCodeAt(i);
    }
    return new Blob([buffer], { type: type })
}

type FileReadFunction = (_: FileReader) => Blob
type ResolvedFunction = (_: Blob) => void

function fileReader(resolved: ResolvedFunction, callback: FileReadFunction) {
    return (rawData: Blob) => {
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            resolved(callback(fileReader))
        }
        fileReader.readAsDataURL(rawData);
        return fileReader
    }
}

const ProfileRepository = (api => {
    return {
        patch: (data: ProfilePatch) => api.patch('profile', data),
        get2Factor: () : Promise<string | ArrayBuffer | null> => new Promise((resolved, reject) => {
            api.get('profile/multi-factor/qr-code', { responseType: 'blob' })
                .then(rawData => {
                    const fileReader = new FileReader();
                    fileReader.onloadend = () => {
                        const { result } = fileReader
                        resolved(result)
                    }
                    fileReader.readAsDataURL(rawData);
                }).catch(reject)
        }),
        enableMfa: (verificationCode: string)               => api.post('profile/multi-factor/enable', { verificationCode }),
        disableMfa: ()                                      => api.post('profile/multi-factor/disable', {}),
        sessions: ()                                        => api.get('profile/sessions'),
        exportTransactions: ()                              => new Promise((accept, fail) => {
            api.get('transactions/export', { responseType: 'blob' })
                .then(fileReader(accept,f=> toBlob(f.result as string, 'text/plain')))
                .catch(fail)
            }),
        exportProfile: ()                                   => new Promise((accept, fail) => {
            api.get('profile/export', { responseType: 'blob' })
                .then(fileReader(accept,f=> toBlob(f.result as string)))
                .catch(fail)
        })
    }
})(RestAPI)

export default ProfileRepository