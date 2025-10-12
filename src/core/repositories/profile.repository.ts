import RestAPI from "./rest-api";

type ProfilePatch = {
    theme?: string;
    currency?: string;
    password?: string;
}

type Session = {
    description: string
    validFrom: string
    validUntil: string
    token: string
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
        patch: (data: ProfilePatch) => api.patch(`user-account/${api.user().username}`, data),
        get2Factor: () : Promise<string | ArrayBuffer | null> => new Promise((resolved, reject) => {
            api.get<Blob>(`user-account/${api.user().username}/2-factor`, { responseType: 'blob' })
                .then(rawData => {
                    const fileReader = new FileReader();
                    fileReader.onloadend = () => {
                        const { result } = fileReader
                        resolved(result)
                    }
                    fileReader.readAsDataURL(rawData);
                }).catch(reject)
        }),
        enableMfa: (verificationCode: string)               => api.patch(`user-account/${api.user().username}/2-factor`, { verificationCode, action: 'ENABLE' }),
        disableMfa: ()                                      => api.patch(`user-account/${api.user().username}/2-factor`, { action: 'DISABLE' }),
        sessions: ()                                        => api.get<Session[]>(`user-account/${api.user().username}/sessions`),
        exportTransactions: ()                              => new Promise((accept, fail) => {
            api.get<Blob>('transactions/export', { responseType: 'blob' })
                .then(fileReader(accept,f=> toBlob(f.result as string, 'text/plain')))
                .catch(fail)
            }),
        exportProfile: ()                                   => new Promise((accept, fail) => {
            api.get<Blob>('profile/export', { responseType: 'blob' })
                .then(fileReader(accept,f=> toBlob(f.result as string)))
                .catch(fail)
        })
    }
})(RestAPI)

export default ProfileRepository