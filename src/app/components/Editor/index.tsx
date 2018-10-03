import { EditorState } from "draft-js";
// @ts-ignore
import createCodeEditorPlugin from "draft-js-code-editor-plugin";
// @ts-ignore
import createFocusPlugin from "draft-js-focus-plugin";
// @ts-ignore
import createImagePlugin from "draft-js-image-plugin";
import "draft-js-linkify-plugin/lib/plugin.css";
// @ts-ignore
import createMarkdownPlugin from "draft-js-markdown-plugin";
// @ts-ignore
import DraftEditor, { composeDecorators } from "draft-js-plugins-editor";
// @ts-ignore
import createPrismPlugin from "draft-js-prism-plugin";
import "draft-js/dist/Draft.css";
import Prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-css";
import "prismjs/components/prism-diff";
import "prismjs/components/prism-git";
import "prismjs/components/prism-go";
import "prismjs/components/prism-java";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-perl";
import "prismjs/components/prism-python";
import "prismjs/components/prism-r";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-scala";
import "prismjs/components/prism-scss";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-swift";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import * as React from "react";
import "./editor.scss";

const customStyleMap = {
    CODE: {
        background: `var(--til-secondary-background-color)`,
        border: `1px solid var(--til-third-background-color)`,
        borderRadius: "4px",
        fontFamily: "monospace",
        padding: "1px 4px"
    }
};

const languages = {
    bash: "Bash",
    c: "C",
    cpp: "C++",
    css: "CSS",
    go: "Go",
    html: "HTML",
    java: "Java",
    js: "JavaScript",
    jsx: "JSX",
    kotlin: "Kotlin",
    perl: "Perl",
    python: "Python",
    r: "R",
    ruby: "Ruby",
    rust: "Rust",
    scala: "Scala",
    scss: "SCSS",
    sql: "SQL",
    svg: "SVG",
    swift: "Swift",
    ts: "Typescript",
    tsx: "Typescript JSX"
};

const renderLanguageSelect = ({
    options,
    onChange,
    selectedValue,
    selectedLabel
}: {
    options: Array<{ label: string; value: string }>;
    onChange: () => void;
    selectedValue: string;
    selectedLabel: string;
}) => (
    <div className="select-container">
        <div className="switch">
            <select
                className="switch__select"
                value={selectedValue}
                onChange={onChange}
            >
                {options.map(({ label, value }) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>
            <div>
                {selectedLabel || "Select language..."}{" "}
                {String.fromCharCode(9662)}
            </div>
        </div>
    </div>
);

const blockStyleFn = () => "markdown-block";

interface IProps {
    placeholder: string;
    body: object;
    onChange: (value: EditorState) => void;
}

export default class Editor extends React.PureComponent<
    IProps,
    { plugins: any[] }
> {
    constructor(props: IProps) {
        super(props);

        const pluginState = this.getPluginState();

        this.state = {
            ...pluginState
        };
    }

    public render() {
        const { placeholder, body, onChange } = this.props;
        return (
            <div className="markdown-body">
                {/* // @ts-ignore */}
                <DraftEditor
                    data-cy="rich-text-editor"
                    editorState={body}
                    onChange={onChange}
                    plugins={this.state.plugins}
                    blockStyleFn={blockStyleFn}
                    placeholder={placeholder}
                    spellCheck={true}
                    autoCapitalize="sentences"
                    autoComplete="on"
                    autoCorrect="on"
                    stripPastedStyles={true}
                    customStyleMap={customStyleMap}
                />
            </div>
        );
    }

    private getPluginState() {
        // @ts-ignore
        const focusPlugin = createFocusPlugin();
        // const dndPlugin = createBlockDndPlugin();
        // @ts-ignore
        // const linkifyPlugin = createLinkifyPlugin({
        //     target: "_blank"
        // });
        // @ts-ignore
        const prismPlugin = createPrismPlugin({
            prism: Prism
        });
        // @ts-ignore
        const codePlugin = createCodeEditorPlugin();

        const decorator = composeDecorators(focusPlugin.decorator);
        // @ts-ignore
        const imagePlugin = createImagePlugin({
            decorator,
            imageComponent: <div>Image</div>
        });

        return {
            plugins: [
                imagePlugin,
                prismPlugin,
                // @ts-ignore
                createMarkdownPlugin({
                    languages,
                    renderLanguageSelect
                }),
                codePlugin
            ]
            // addImage: imagePlugin.addImage,
        };
    }
}
