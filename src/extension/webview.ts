import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { IGithubCredentials, ISelectedText } from "../defs";

export const getWebView = (
    extenstionPath: string,
    initialSelectedText: ISelectedText,
    githubCredentials: IGithubCredentials
): string => {
    const mainfestPath = path.join(extenstionPath, "dist/app", "manifest.json");

    const manifest = JSON.parse(fs.readFileSync(mainfestPath).toString());

    // Local path to main script run in the webview
    const scriptPathOnDisk = vscode.Uri.file(
        path.join(extenstionPath, "dist/app", manifest["main.js"])
    );

    // And the uri we use to load this script in the webview
    const scriptUri = scriptPathOnDisk.with({ scheme: "vscode-resource" });

    const cssPathOnDisk = vscode.Uri.file(
        path.join(extenstionPath, "dist/app", manifest["main.css"])
    );

    // And the uri we use to load this script in the webview
    const cssUri = cssPathOnDisk.with({ scheme: "vscode-resource" });
    /* tslint:disable */
    return /* html */ `
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <link rel="stylesheet" href="${cssUri}">
        </head>

        <body>
            <div id="root"></div>
            <script>
                var __INITIAL_STATE__ = ${JSON.stringify({
                    initialSelectedText: initialSelectedText,
                    githubCredentials: githubCredentials
                })}
            </script>
            <script>
                var vscode = acquireVsCodeApi();
            </script>
            <script src="${scriptUri}" />
        </body>
    </html>`;
};
