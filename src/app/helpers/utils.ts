import GithubApi from "./api";

export const verifyUser = async creds => {
    const _api = new GithubApi(creds);
    try {
        const user = await _api.getUser();
        return user.login === creds.username;
    } catch (err) {
        return false;
    }
};

export const createPost = async (data, creds) => {
    const title = `${data.title.split(" ").join("_")}.md`;
    const content = `# ${data.title} \n ${
        data.content
    } \n --- \n Created with [📕Tiled](www.google.com)`;

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
