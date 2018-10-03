import notification from "antd/lib/notification";

import "antd/lib/notification/style/css";
import * as React from "react";
import { render } from "react-dom";
import { IGithubCredentials } from "../defs";
import Composer from "./components/Composer";
import "./styles.css";

const openNotificationWithIcon = (
    message: string,
    description: string,
    type = "error"
): void => {
    // @ts-ignore
    notification[type]({
        description,
        message
    });
};

const setToken = (token: IGithubCredentials): void => {
    storage.setItem("gat", token);
};

const initialState = (window as any).__INITIAL_STATE__;
const vscode = (window as any).vscode;

const storage = {
    setItem(key: string, value: object | string) {
        if (vscode) {
            vscode.postMessage({
                key,
                command: "storage",
                type: "put",
                value: JSON.stringify(value)
            });
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }
};

const applyBaseVscodeCss = () => {
    const computedStyles = getComputedStyle(document.head);

    const bgColor = computedStyles
        .getPropertyValue("--vscode-editor-background")
        .trim();

    const color = computedStyles
        .getPropertyValue("--vscode-editor-foreground")
        .trim();
    // const secondaryBg = computedStyles
    //     .getPropertyValue("--vscode-tab-activeBackground") // --vscode-editorGroupHeader-tabsBackground
    //     .trim();
    const secondaryBg = "rgba(127, 127, 127, 0.1)";
    // const thirdBg = computedStyles
    //     .getPropertyValue("--vscode-tab-activeBorder")
    //     .trim();
    const thirdBg = "rgba(127, 127, 127, 0.2)";

    const linkColor = computedStyles.getPropertyValue("--link-color").trim(); //
    const buttonBackground = computedStyles
        .getPropertyValue("--vscode-button-background")
        .trim(); //
    const buttonForeground = computedStyles
        .getPropertyValue("--vscode-button-foreground")
        .trim(); //
    const buttonHoverBgColor = computedStyles
        .getPropertyValue("--vscode-button-hoverBackground")
        .trim(); //

    const styleStr = `
    --til-background-color: ${bgColor};
    --til-text-color: ${color};
    --til-secondary-background-color: ${secondaryBg};
    --til-third-background-color: ${thirdBg};
    --til-link-color: ${linkColor};
    --til-button-bgcolor: ${buttonBackground};
    --til-button-hover-bgcolor: ${buttonHoverBgColor};
    --til-button-color: ${buttonForeground};
    `;

    document.body.setAttribute("style", styleStr);
};

applyBaseVscodeCss();

render(
    <Composer
        setToken={setToken}
        showToast={openNotificationWithIcon}
        initialState={initialState}
    />,
    document.getElementById("root")
);
