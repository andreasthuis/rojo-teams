const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/main.js",

  output: {
    path: path.resolve(__dirname, ".webpack/main"),
    filename: "index.js",
  },

  target: "electron-main",

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/menus", to: "menus" },
        { from: "src/css", to: "css" },
        { from: "src/html", to: "html" },
        { from: "src/js", to: "js" },
      ],
    }),
  ],
};
