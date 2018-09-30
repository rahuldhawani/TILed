const path = require("path");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

module.exports = (env, argv) => ({
    entry: "./src/app/index.tsx",
    output: {
        filename: "main.js",
        path: console.log(__dirname) || path.resolve(__dirname, "dist/app")
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".jsx"]
    },
    devtool: argv.mode === "production" ? "none" : "source-map",
    module: {
        rules: [
            {
                test: /\.md$/,
                use: "raw-loader"
            },
            {
                test: /\.(tsx|ts)$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        plugins: [
                            "@babel/plugin-proposal-class-properties",
                            "@babel/plugin-syntax-dynamic-import"
                        ],
                        presets: [
                            "@babel/typescript",
                            "@babel/react",
                            [
                                "@babel/preset-env",
                                {
                                    targets: {
                                        browsers: ["last 2 Chrome versions"]
                                    }
                                }
                            ]
                        ]
                    }
                }
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            minimize: {
                                safe: true
                            }
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {}
                    }
                ]
            }
        ]
    },
    plugins: [
        new WebpackAssetsManifest(),
        new MiniCssExtractPlugin({
            filename: "main.css"
        })
    ]
});
