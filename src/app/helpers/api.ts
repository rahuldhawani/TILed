const API_HOST: string = "https://api.github.com";

const appendHost = (type: string): string => API_HOST + type;

const _URLS = {
    USER: "/user",
    GISTS: "/gists"
};

const URLS = new Proxy(_URLS, {
    get: function(obj, prop) {
        return prop in obj ? appendHost(obj[prop]) : "";
    }
});

export default class API {
    headers: {
        Authorization: string;
    };

    constructor({ username, token }) {
        this.headers = {
            Authorization: `Basic ${btoa(`${username}:${token}`)}`
        };
    }

    getUser() {
        return this.performRequest(URLS.USER, "GET");
    }

    postGist(data) {
        return this.performRequest(URLS.GISTS, "POST", data);
    }

    async performRequest(url: string, method: string, body?: object) {
        let response = await fetch(url, {
            method,
            body: JSON.stringify(body),
            headers: this.headers
        });

        const _response = await response.json();

        if (response.ok) {
            return _response;
        } else {
            return Promise.reject(_response);
        }
    }
}
