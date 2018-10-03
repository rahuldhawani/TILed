import Message from "antd/lib/message";
import "antd/lib/message/style/css";
import { EditorState } from "draft-js";
import * as React from "react";
import Textarea from "react-textarea-autosize";
import { IGithubCredentials, ISelectedText, IShowToast } from "../../../defs";
import { getInitialTextFromSelection, toMarkdown } from "../../helpers/draft";
import { createPost, verifyUser } from "../../helpers/utils";
import Editor from "../Editor";
import HelpPage from "../HelpPage";
import IntroductionPage from "../IntroductionPage";
import "./styles.scss";

const titles = [
    "So, what did you learn today?",
    "Give me a name",
    "Type your title",
    "What's up?"
];

interface IComposerProps {
    initialState: {
        initialSelectedText: ISelectedText;
        githubCredentials: IGithubCredentials;
    };
    setToken: (token: IGithubCredentials) => void;
    showToast: IShowToast;
}

interface IComposerState {
    title: string;
    editorState: EditorState;
    showSettings: boolean;
    showHelp: boolean;
    saving: boolean;
    showLoading: boolean;
}

export default class Composer extends React.PureComponent<
    IComposerProps,
    IComposerState
> {
    private editorPlaceholder: string =
        titles[Math.floor(Math.random() * titles.length)];

    private _hideLoading: () => void;

    constructor(props: IComposerProps) {
        super(props);
        this.state = {
            editorState: getInitialTextFromSelection(
                props.initialState.initialSelectedText
            ),
            saving: false,
            showHelp: false,
            showSettings: false,
            showLoading: false,
            title: ""
        };

        this.handleGithubCredentialsSave = this.handleGithubCredentialsSave.bind(
            this
        );
        this.handleSave = this.handleSave.bind(this);
    }

    public componentDidUpdate() {
        if (this.state.showLoading) {
            // @ts-ignore
            this._hideLoading = Message.loading("Loading...", 0);
        } else {
            if (this._hideLoading) {
                this._hideLoading();
            }
        }
    }

    public render() {
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
                <Editor
                    placeholder="More thoughts here..."
                    body={this.state.editorState}
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

    private handleTitleChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ): void => {
        this.setState({
            title: e.currentTarget.value
        });
    };

    private async handleSave() {
        if (!this.state.title) {
            return this.props.showToast(
                "Please add title!",
                "Titles are required to create filename.",
                "error"
            );
        }

        this.setState({
            saving: true,
            showLoading: true
        });

        const content = toMarkdown(this.state.editorState);
        const { username, token } = this.props.initialState.githubCredentials;
        if (username && token) {
            try {
                const post = await createPost(
                    { content, title: this.state.title },
                    { username, token }
                );

                const desc = (
                    <div>
                        A step closer towards the sharing. Here is the{" "}
                        <a target="_blank" href={post.html_url}>
                            link
                        </a>{" "}
                        for the Gist.
                    </div>
                );

                this.props.showToast(
                    "🎉 Successfully created Gist!",
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
            saving: false,
            showLoading: false
        });
    }

    private handleSettingsClick = () => {
        this.setState({
            showSettings: true
        });
    };

    private handleHelpClick = () => {
        this.setState({
            showHelp: true
        });
    };

    private async handleGithubCredentialsSave(
        githubCredentials: IGithubCredentials,
        verify = true
    ) {
        if (!verify) {
            this.props.setToken(githubCredentials);
        } else {
            this.setState({
                showLoading: true
            });
            const verfied = await verifyUser(githubCredentials);

            this.setState({
                showLoading: false
            });

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

    private handleClose = () => {
        this.setState({
            showHelp: false,
            showSettings: false
        });
    };

    private handleEditorStateChange = (value: EditorState) => {
        this.setState({
            editorState: value
        });
    };
}
