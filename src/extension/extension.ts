"use strict";

import * as path from "path";
import * as vscode from "vscode";

/* tslint:disable */
// @ts-ignore
const Cache = require("vscode-cache");
/* tslint:enable */

import { ISelectedText } from "../defs";
import { getWebView } from "./webview";

const WINDOW_TITLE: string = "TILed";

let selectedText: ISelectedText;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated

    // @ts-ignore
    const storage = new Cache(context);

    context.subscriptions.push(
        vscode.commands.registerCommand("til.activiate", () => {
            Panel.createOrShow(context.extensionPath, storage);
        })
    );
}

// this method is called when your extension is deactivated
// export function deactivate() {}

// our main Panel controller.
class Panel {
    /**
     * Track the currently panel. Only allow a single panel to exist at a time.
     */
    public static currentPanel: Panel | undefined;

    public static readonly viewType = "tilEditor";

    public static createOrShow(extensionPath: string, storage: any) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // If we already have a panel, show it.
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            editor.edit(() => {
                const selection = editor.selection;
                selectedText = {
                    language: editor.document.languageId,
                    text: editor.document.getText(selection)
                };
            });
        }

        if (Panel.currentPanel) {
            Panel.currentPanel._panel.dispose();
        }

        // Otherwise, create a new panel.
        const columnToOpenIn: number =
            typeof column === "number"
                ? (column % 2) + 1
                : vscode.ViewColumn.Two;

        const panel = vscode.window.createWebviewPanel(
            Panel.viewType,
            WINDOW_TITLE,
            columnToOpenIn,
            {
                // Enable javascript in the webview
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.file(path.join(extensionPath, "dist")),
                    vscode.Uri.file(path.join(extensionPath, "static"))
                ]
            }
        );

        Panel.currentPanel = new Panel(
            panel,
            extensionPath,
            selectedText,
            storage
        );
    }

    private readonly _panel: vscode.WebviewPanel;
    private _storage: any;
    // private readonly _extensionPath: string;

    private _disposables: vscode.Disposable[] = [];

    constructor(
        panel: vscode.WebviewPanel,
        extensionPath: string,
        selection: ISelectedText,
        storage: any
    ) {
        this._panel = panel;
        this._storage = storage;

        const _creds = this._storage.get("gat");

        let githubCredentials = { username: "", token: "" };

        if (_creds) {
            githubCredentials = JSON.parse(_creds);
        }
        this._panel.title = WINDOW_TITLE;
        this._panel.iconPath = vscode.Uri.file(
            path.join(extensionPath, "static", "icon.png")
        );
        this._panel.webview.html = getWebView(
            extensionPath,
            selection,
            githubCredentials
        );

        // listeners on webivewPanel
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.onDidReceiveMessage(
            message => this.handleMessage(message),
            null,
            this._disposables
        );
    }

    public handleMessage(message: {
        command: string;
        type: string;
        key?: string;
        value?: string;
    }) {
        switch (message.command) {
            case "storage":
                {
                    const { type, key, value } = message;

                    if (type === "put") {
                        this._storage.put(key, value);
                    }
                }

                break;
        }
    }

    public dispose() {
        Panel.currentPanel = undefined;

        // Clean up our resources
        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
}
