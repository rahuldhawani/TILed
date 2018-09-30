// type selectedTextType = {
//     text: string;
//     language: string;
// };

type githubCrederntialType = {
    username: string;
    token: string;
};

type showToastType = (
    message: string,
    description: string | JSX.Element,
    type?: string
) => void;

type selectedTextType =
    | {
          text: string;
          language: string;
      }
    | undefined;
