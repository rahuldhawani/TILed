export interface ISelectedText {
    text: string;
    language: string;
}

export interface IGithubCredentials {
    username: string;
    token: string;
}

export type IShowToast = (
    message: string,
    description: string | JSX.Element,
    type?: string
) => void;
