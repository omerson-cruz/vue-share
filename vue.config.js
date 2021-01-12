module.exports = {
  transpileDependencies: ["vuetify"],
  // publicPath:
  //   process.env.NODE_ENV === "production"
  //     ? "/vue-share/" // <== name of your GH repository
  //     : "/",
  configureWebpack: {
    devtool: "#source-map",
  },
};
