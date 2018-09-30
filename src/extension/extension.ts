"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import { getWebView } from "./webview";
const Cache = require("vscode-cache");

const WINDOW_TITLE: string = "📕 TILed";

let selectedText: selectedTextType;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "til-vscode" is now active!');
    const storage = new Cache(context);

    context.subscriptions.push(
        vscode.commands.registerCommand("til.activiate", () => {
            Panel.createOrShow(context.extensionPath, storage);
        })
    );
}

// this method is called when your extension is deactivated
export function deactivate() {}

// our main Panel controller.
class Panel {
    /**
     * Track the currently panel. Only allow a single panel to exist at a time.
     */
    public static currentPanel: Panel | undefined;

    public static readonly viewType = "tilEditor";

    private readonly _panel: vscode.WebviewPanel;
    private _storage: any;
    // private readonly _extensionPath: string;

    private _disposables: vscode.Disposable[] = [];

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
                    text: editor.document.getText(selection),
                    language: editor.document.languageId
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

                // @TODO And restric the webview to only loading content from our extension's `media` directory.
                localResourceRoots: [
                    vscode.Uri.file(path.join(extensionPath, "dist"))
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

    constructor(
        panel: vscode.WebviewPanel,
        extenstionPath: string,
        selection: selectedTextType,
        storage: any
    ) {
        this._panel = panel;
        // this._extensionPath = extenstionPath;
        this._storage = storage;
        const githubCredentials = JSON.parse(this._storage.get("gat"));
        this._panel.title = WINDOW_TITLE;
        this._panel.webview.html = getWebView(
            extenstionPath,
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

    public handleMessage(message) {
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
