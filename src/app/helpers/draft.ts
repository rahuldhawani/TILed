import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
// @ts-ignore
import { draftToMarkdown, markdownToDraft } from "markdown-draft-js";
import { ISelectedText } from "../../defs";

const emptyContentState = convertFromRaw({
    entityMap: {},
    blocks: [
        {
            text: "",
            key: "foo",
            type: "unstyled",
            entityRanges: [],
            depth: 0,
            inlineStyleRanges: []
        }
    ]
});

const aliases = new Map([
    ["js", "javascript"],
    ["javascriptreact", "jsx"],
    ["typescriptreact", "tsx"],
    ["typescript", "ts"],
    ["shell", "bash"],
    ["sh", "bash"],
    ["shellscript", "bash"],
    ["zsh", "bash"],
    ["py", "python"]
]);

function pickLanguage(lang: string) {
    return aliases.get(lang) || lang;
}

export const getInitialTextFromSelection = (
    initialSelectedText: ISelectedText = { text: "", language: "" }
): EditorState => {
    const { text, language } = initialSelectedText;

    if (!text) {
        return EditorState.createWithContent(emptyContentState);
    }

    return EditorState.createWithContent(
        convertFromRaw({
            blocks: [
                {
                    entityRanges: [],
                    key: "epvjd",
                    text: "Explain your learning...",
                    type: "unstyled",
                    depth: 0,
                    inlineStyleRanges: []
                },
                {
                    text,
                    data: {
                        language: pickLanguage(language)
                    },
                    depth: 0,
                    entityRanges: [],
                    inlineStyleRanges: [],
                    key: "39j2p",
                    type: "code-block"
                }
            ],
            entityMap: {}
        })
    );
};

export const toMarkdown = (editorState: EditorState) => {
    return draftToMarkdown(convertToRaw(editorState.getCurrentContent()), {});
};

export const fromMarkdown = (md: string) => {
    return EditorState.createWithContent(convertFromRaw(markdownToDraft(md)));
};
