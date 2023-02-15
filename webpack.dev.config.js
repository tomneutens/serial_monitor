import path from "path"

let settings = {
    mode: "development",
    target: "web",
    entry: "./src/serial-monitor.ts",
    output: {
      path: path.resolve("./dist"),
      filename: "serial-monitor.js",
      library: {
        name: "SerialMonitor",
        type: "umd"
      },
      globalObject: "self",
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
        { test: /\.tsx?$/, loader: "ts-loader"},
        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        { test: /\.js$/, loader: "source-map-loader" },
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false
          }
        }
      ],
    },
  };

  export default settings