import * as React from "react";
import { fromMarkdown } from "../../helpers/draft";
import Editor from "../Editor";

// @ts-ignore
import helpMd from "./help.md";

import "./styles.scss";

export default class DemoEditor extends React.PureComponent<
    {
        onClose: () => void;
    },
    { body: object }
> {
    public state = {
        body: fromMarkdown(helpMd)
    };

    public render() {
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
                <Editor
                    placeholder="Help"
                    body={this.state.body}
                    onChange={this.handleChange}
                />
            </div>
        );
    }

    private handleChange = (body: object) => {
        this.setState({
            body
        });
    };
}
