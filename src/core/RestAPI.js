import axios from 'axios';
import jwt_decode from 'jwt-decode';
import {useNavigate} from "react-router-dom";

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

const RestAPI = (() => {
    let userProfile = {}

    const handle = response => new Promise((resolved, error) =>
        response
            .then(httpResponse => resolved(httpResponse.data))
            .catch(({response}) => {
                console.log(response)
                if (response.status === 401) RestAPI.logout()
                else error(response.data.message || response.statusText)
            }))

    const api = {
        authenticate: (username, password) =>
            api.post('security/authenticate', {username: username, password: password})
                .then(serverResponse => {
                    const token = new TokenResponse(serverResponse)
                    sessionStorage.setItem('refresh-token', token.refreshToken);
                    sessionStorage.setItem('token', token.accessToken);
                }),
        profile: () => api.get('profile'),
        logout: () => {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('refresh-token');
            document.location.href = '/login'
        },
        user: () => userProfile,

        get:   (uri, settings = {})       => handle(axios.get(`${config.root}/${uri}`, generateRequestSettings(settings))),
        patch: (uri, body, settings = {}) => handle(axios.patch(`${config.root}/${uri}`, body, generateRequestSettings(settings))),
        post:  (uri, body, settings = {}) => handle(axios.post(`${config.root}/${uri}`, body, generateRequestSettings(settings))),
        put:   (uri, body, settings = {}) => handle(axios.put(`${config.root}/${uri}`, body, generateRequestSettings(settings))),
        delete: (uri, settings = {})      => handle(axios.delete(`${config.root}/${uri}`, generateRequestSettings(settings)))
    }

    if (sessionStorage.getItem('token')) api.profile().then(profile => userProfile = profile)

    return api
})()

export default RestAPI;
