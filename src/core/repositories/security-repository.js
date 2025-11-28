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
        isAuthenticated: () => {
            return sessionStorage.getItem('token') != null
        },
        authenticate: (username, password) => api.post('security/authenticate', {
            username: username,
            password: password
        })
            .then(serverResponse => {
                const token = new TokenResponse(serverResponse)
                sessionStorage.setItem('refresh-token', token.refreshToken);
                sessionStorage.setItem('token', token.accessToken);
            }),
        twoFactor: (code) => api.post('user-account/verify-2-factor', {verificationCode: code})
            .then(serverResponse => {
                const token = new TokenResponse(serverResponse)
                sessionStorage.setItem('refresh-token', token.refreshToken);
                sessionStorage.setItem('token', token.accessToken);
            }),
        register: (username, password) => api.post(`user-account`, {username, password}),
        logout: () => {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('refresh-token');
        }
    }
})(RestAPI)

export default SecurityRepository