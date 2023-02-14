import path from "path"

let settings = {
    mode: "development",
    target: "web",
    entry: "./src/index.ts",
    output: {
      path: path.resolve("./dist"),
      filename: "index.js",
      library: "SerialMonitor",
      libraryTarget: "umd",
      globalObject: "this",
      umdNamedDefine: true
    },
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",
    resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
    },
    module: {
      rules: [
        // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
        { test: /\.tsx?$/, loader: "ts-loader", options: { "transpileOnly": true } },
        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        { test: /\.js$/, loader: "source-map-loader" },
      ],
    },
  };

  export default settings