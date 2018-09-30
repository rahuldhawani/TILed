import Editor from "slate-md-editor";
import * as React from "react";
import { Value } from "slate";
import { State } from "markup-it";
import markdown from "markup-it/lib/markdown";
import "./styles.scss";
import "antd/dist/antd.css";
import helpMd from "./help.md";

const MdEditor = Editor();
const mdParser = State.create(markdown);

const value = Value.create({
    document: mdParser.deserializeToDocument(helpMd)
});
export default class DemoEditor extends React.PureComponent<{
    onClose: () => void;
}> {
    render() {
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
                <MdEditor value={value} />
            </div>
        );
    }
}
