import RestAPI from "./rest-api";

class TokenResponse {
    constructor(props) {
        this.username = props.username;
        this.accessToken = props['access_token'];
        this.refreshToken = props['refresh_token'];
    }
}

const SecurityRepository = (api => {
    return {
        authenticate: (username, password) => api.post('security/authenticate', { username: username, password: password })
            .then(serverResponse => {
                const token = new TokenResponse(serverResponse)
                sessionStorage.setItem('refresh-token', token.refreshToken);
                sessionStorage.setItem('token', token.accessToken);
            }),
        register: (username, password) => api.put(`security/create-account`, { username, password }),
        logout: () => {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('refresh-token');
        }
    }
})(RestAPI)

window.addEventListener('credentials-expired', _ => {
    console.log('Credentials expired')
    SecurityRepository.logout()
    window.location.reload()
})

export default SecurityRepository