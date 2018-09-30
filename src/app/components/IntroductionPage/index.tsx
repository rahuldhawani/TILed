import * as React from "react";
import "./styles.scss";

export default class IntroductionPage extends React.PureComponent<
    {
        setToken: (string, boolean?) => void;
        onClose: () => void;
        showToast: showToastType;
        githubCredentials: githubCrederntialType;
    },
    {
        githubCredentials: githubCrederntialType;
        showEditCredentials: boolean;
    }
> {
    constructor(props) {
        super(props);
        this.state = {
            githubCredentials: {
                token: props.githubCredentials.token || "",
                username: props.githubCredentials.username || ""
            },
            showEditCredentials: !!props.githubCredentials.token
        };
    }

    handleTokenSave = () => {
        if (
            this.state.githubCredentials.token &&
            this.state.githubCredentials.username
        ) {
            this.props.setToken(this.state.githubCredentials);
        } else {
            this.props.showToast(
                "Opps!",
                "Please provide username and token!",
                "error"
            );
        }
    };

    handleValue = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            githubCredentials: {
                ...this.state.githubCredentials,
                [e.currentTarget.name]: e.currentTarget.value
            }
        });
    };

    handleCredentialsRemove = () => {
        this.setState(
            {
                githubCredentials: {
                    username: "",
                    token: ""
                },
                showEditCredentials: false
            },
            () => this.setCredentials(false)
        );
    };

    setCredentials = verify => {
        this.props.setToken(this.state.githubCredentials, verify);
    };

    _getButtons() {
        let buttons;
        if (this.state.showEditCredentials) {
            const isUpdateDisabled =
                this.state.githubCredentials.token ===
                this.props.githubCredentials.token;
            buttons = (
                <React.Fragment>
                    <button
                        onClick={this.handleCredentialsRemove}
                        className="access-token__button--text"
                    >
                        🗑 Remove
                    </button>
                    <button
                        onClick={this.handleTokenSave}
                        className="access-token__button"
                        disabled={isUpdateDisabled}
                    >
                        🖋 Update
                    </button>
                </React.Fragment>
            );
        } else {
            buttons = (
                <button
                    onClick={this.handleTokenSave}
                    className="access-token__button"
                >
                    Save & Continue 👉
                </button>
            );
        }

        return <div className="access-token__buttons">{buttons}</div>;
    }

    render() {
        const { username, token } = this.state.githubCredentials;

        return (
            <div className="page">
                <div className="top-bar">
                    <button
                        onClick={this.props.onClose}
                        className="editor-button"
                    >
                        Close
                    </button>
                </div>
                <div className="intro-container">
                    <div className="intro__emoji">👋</div>
                    <div className="intro__heading">Hi there!!</div>
                    <div className="intro__second-heading">
                        Welcome to TILed
                    </div>
                    <div className="intro__content">
                        We are so glad you are also a believer of “Learn in
                        Public” because that's the motto of TILed; share your
                        minute learnings with the world. As an MVP of this
                        project, you can share you TIL via Github Gists. More
                        ways to share is our roadmap. So, go ahead, paste your
                        Github username and{" "}
                        <a href="https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/">
                            Access Token
                        </a>{" "}
                        👇
                    </div>

                    <div className="access-token">
                        <div className="access-token__header">
                            Github Credentials
                        </div>
                        <input
                            className="access-token__input"
                            type="text"
                            name="username"
                            placeholder="Enter your Github Username"
                            value={username}
                            onChange={this.handleValue}
                        />
                        <input
                            className="access-token__input"
                            type="text"
                            name="token"
                            placeholder="Enter your Github Access Token"
                            value={token}
                            onChange={this.handleValue}
                        />

                        {this._getButtons()}
                    </div>
                </div>
            </div>
        );
    }
}
