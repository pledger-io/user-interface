import axios from 'axios';
import jwt_decode from 'jwt-decode';

const config = {
    root: 'http://dev.ota.pledger.io/api'
    //root: 'http://localhost:8080/api'
}

class TokenResponse {
    constructor(props) {
        this.username = props.username;
        this.accessToken = props['access_token'];
        this.refreshToken = props['refresh_token'];
    }
}

function storeTokenInformation(token) {
    sessionStorage.setItem('refresh-token', token.refreshToken);
    sessionStorage.setItem('token', token.accessToken);
    restAPI.credentials = jwt_decode(token.accessToken);
}

function generateRequestSettings(settings) {
    const header = {};
    if (sessionStorage.getItem('token')) {
        header['Authorization'] = 'Bearer ' + sessionStorage.getItem('token');
    }
    if (localStorage.getItem('language')) {
        header['Accept-Language'] = localStorage.getItem('language');
    }

    return {
        headers: header,
        ...settings
    }
}

function handleResponse(axionResponse) {
    return new Promise((resolved, errorResolve) => {
        axionResponse.then(response => {
            if (response.status === 401) {
                errorResolve('not authenticated');
                return
            }

            resolved(response.data);
        }).catch(error => {
            const {response} = error;
            if (response.status === 401) {
                restAPI.logout();
            } else {
                errorResolve(response.data.message || response.statusText);
            }
        });
    })
}

function loadProfile() {
    if (restAPI.credentials) {
        restAPI.get('profile')
            .then(profile => restAPI.activeUser = profile)
            .catch(exception => console.log(exception));
    }
}

class RestAPI {
    constructor() {
        this.activeUser = {}
        this.credentials = null
        if (sessionStorage.getItem('token')) {
            this.credentials = jwt_decode(sessionStorage.getItem('token'));
        }
    }

    authenticate(username, password) {
        return new Promise((resolve, error) => {
            this.post('security/authenticate', {username: username, password: password})
                .then(serverResponse => {
                    storeTokenInformation(new TokenResponse(serverResponse));
                    loadProfile();
                    resolve();
                })
                .catch(e => error(e));
        })
    }

    logout() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refresh-token');
        this.credentials = null;
        this.activeUser = {};
        document.location.href = '/login';
    }

    get(uri, settings = {}) {
        return handleResponse(axios.get(`${config.root}/${uri}`, generateRequestSettings(settings)));
    }

    patch(uri, body, settings = {}) {
        return handleResponse(axios.patch(
            `${config.root}/${uri}`,
            body,
            generateRequestSettings(settings)))
    }

    post(uri, body, settings = {}) {
        return handleResponse(axios.post(
            `${config.root}/${uri}`,
            body,
            generateRequestSettings(settings)))
    }

    put(uri, body, settings = {}) {
        return handleResponse(axios.put(
            `${config.root}/${uri}`,
            body,
            generateRequestSettings(settings)))
    }

    delete(uri) {
        return handleResponse(axios.delete(
            `${config.root}/${uri}`,
            generateRequestSettings()))
    }

    get user() {
        return this.activeUser;
    }
}

const restAPI = new RestAPI();
loadProfile()

export default restAPI;
