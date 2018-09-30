import "antd/dist/antd.css";
import { State } from "markup-it";
import "prismjs";
import markdown from "markup-it/lib/markdown";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-diff";
import "prismjs/components/prism-git";
import "prismjs/components/prism-java";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-r";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-scss";
import "prismjs/components/prism-swift";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import * as React from "react";
import Textarea from "react-textarea-autosize";
import { Value } from "slate";
import Editor from "slate-md-editor";
import Plain from "slate-plain-serializer";
import { createPost, verifyUser } from "../../helpers/utils";
import HelpPage from "../HelpPage";
import IntroductionPage from "../IntroductionPage";
import "./styles.scss";
import "./editor.scss";
import { Value as ValueType } from "slate";

const MdEditor = Editor();

const mdParser = State.create(markdown);

const aliases = new Map([
    ["js", "javascript"],
    ["javascriptreact", "jsx"],
    ["typescriptreact", "tsx"],
    ["shell", "bash"],
    ["sh", "bash"],
    ["shellscript", "bash"],
    ["zsh", "bash"],
    ["py", "python"]
]);

function pickLanguage(lang) {
    return aliases.get(lang) || lang;
}

function _getInitialText(initialSelectedText) {
    const { text, language } = initialSelectedText;

    if (!text) return Plain.deserialize("");

    return Value.create({
        document: mdParser.deserializeToDocument(
            `Start typing...
            \`\`\`${pickLanguage(language)}
${text}\`\`\`



            `
        )
    });
}

const titles = [
    "So, what did you learn today?",
    "Give me a name",
    "Type your title",
    "What's up?"
];

interface ComposerProps {
    initialState: {
        initialSelectedText: selectedTextType;
        githubCredentials: githubCrederntialType;
    };
    setToken: (string) => void;
    showToast: showToastType;
}

interface ComposerState {
    title: string;
    editorState: ValueType;
    showSettings: boolean;
    showHelp: boolean;
    saving: boolean;
}

export default class Composer extends React.PureComponent<
    ComposerProps,
    ComposerState
> {
    editorPlaceholder: string =
        titles[Math.floor(Math.random() * titles.length)];

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            showSettings: false,
            showHelp: false,
            saving: false,
            editorState: _getInitialText(props.initialState.initialSelectedText)
        };

        this.handleGithubCredentialsSave = this.handleGithubCredentialsSave.bind(
            this
        );
        this.handleSave = this.handleSave.bind(this);
    }

    handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            title: e.currentTarget.value
        });
    };

    async handleSave() {
        if (!this.state.title) {
            return this.props.showToast(
                "Please add title!",
                "Titles are required to create filename.",
                "error"
            );
        }

        this.setState({
            saving: true
        });

        const content = mdParser.serializeDocument(
            this.state.editorState.document
        );
        const { username, token } = this.props.initialState.githubCredentials;
        if (username && token) {
            try {
                const post = await createPost(
                    { content, title: this.state.title },
                    { username, token }
                );

                let desc = (
                    <div>
                        A step closer towards the sharing. Here is the{" "}
                        <a target="_blank" href={post.html_url}>
                            link
                        </a>{" "}
                        for the gist.
                    </div>
                );

                this.props.showToast(
                    "🎉 Successfully created gist!",
                    desc,
                    "info"
                );
            } catch (err) {
                this.props.showToast(
                    "Opps! Something went wrong",
                    "Something is not right. Please check your Github Credentials. If it still doesn't work, please report a bug. 🙏",
                    "error"
                );
            }
        } else {
            this.props.showToast(
                "Please add your Github Credentials in Settings Page.",
                "Please check your Github Credentials. If still doesn't work, please report a bug. 🙏",
                "error"
            );
        }

        this.setState({
            saving: false
        });
    }

    handleSettingsClick = () => {
        this.setState({
            showSettings: true
        });
    };

    handleHelpClick = () => {
        this.setState({
            showHelp: true
        });
    };

    async handleGithubCredentialsSave(githubCredentials, verify = true) {
        if (!verify) {
            this.props.setToken(githubCredentials);
        } else {
            const verfied = await verifyUser(githubCredentials);
            if (verfied) {
                this.handleClose();
                this.props.initialState.githubCredentials = githubCredentials;
                this.props.setToken(githubCredentials);
            } else {
                this.props.showToast(
                    "Opps!",
                    "The username and token did not verify. Please make sure you have input correctly.",
                    "error"
                );
            }
        }
    }

    handleClose = () => {
        this.setState({
            showSettings: false,
            showHelp: false
        });
    };

    handleEditorStateChange = ({ value }) => {
        this.setState({
            editorState: value
        });
    };

    render() {
        return (
            <div className="composer">
                <div className="top-bar">
                    <button
                        disabled={this.state.saving}
                        onClick={this.handleSave}
                        className="editor-button"
                    >
                        Save
                    </button>
                    <button
                        onClick={this.handleSettingsClick}
                        className="editor-button"
                    >
                        Settings
                    </button>
                    <button
                        onClick={this.handleHelpClick}
                        className="editor-button"
                    >
                        Help
                    </button>
                </div>
                <Textarea
                    className="title"
                    value={this.state.title}
                    onChange={this.handleTitleChange}
                    placeholder={this.editorPlaceholder}
                />
                <MdEditor
                    placeholder="More thoughts here..."
                    value={this.state.editorState}
                    onChange={this.handleEditorStateChange}
                />
                {this.state.showSettings && (
                    <IntroductionPage
                        githubCredentials={
                            this.props.initialState.githubCredentials
                        }
                        setToken={this.handleGithubCredentialsSave}
                        onClose={this.handleClose}
                        showToast={this.props.showToast}
                    />
                )}
                {this.state.showHelp && <HelpPage onClose={this.handleClose} />}
            </div>
        );
    }
}
