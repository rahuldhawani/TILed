import { IGithubCredentials } from "../../defs";

const API_HOST: string = "https://api.github.com";

const appendHost = (type: string): string => API_HOST + type;
interface IURLS {
    [index: string]: string;
}

const _URLS: IURLS = {
    USER: "/user",
    GISTS: "/gists"
};

const URLS: IURLS = new Proxy(_URLS, {
    get(obj: IURLS, prop: string) {
        return prop in obj ? appendHost(obj[prop]) : "";
    }
});

export default class API {
    private headers: {
        Authorization: string;
    };

    constructor({ username, token }: IGithubCredentials) {
        this.headers = {
            Authorization: `Basic ${btoa(`${username}:${token}`)}`
        };
    }

    public getUser() {
        return this.performRequest(URLS.USER, "GET");
    }

    public postGist(data: object) {
        return this.performRequest(URLS.GISTS, "POST", data);
    }

    private async performRequest(url: string, method: string, body?: object) {
        const response = await fetch(url, {
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
