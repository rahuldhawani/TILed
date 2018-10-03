import { IGithubCredentials } from "../../defs";
import GithubApi from "./api";

export const verifyUser = async (creds: IGithubCredentials) => {
    const _api = new GithubApi(creds);
    try {
        const user = await _api.getUser();
        return user.login === creds.username;
    } catch (err) {
        return false;
    }
};

export const createPost = async (
    data: { title: string; content: string },
    creds: IGithubCredentials
) => {
    const title = `${data.title.split(" ").join("_")}.md`;
    const content = `# ${data.title} \n ${
        data.content
    } \n --- \n Created with [📕TILed](https://github.com/rahuldhawani/TILed)`;

    const _api = new GithubApi(creds);

    return _api.postGist({
        public: true,
        files: {
            [title]: {
                content
            }
        }
    });
};
