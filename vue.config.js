const fs = require("fs");
const glob = require("glob");
const postcssConfig = require(__dirname + "/postcss.config.js");
const lessConfig = require(__dirname + "/less.config.js");

let pages = {};
let entries;

try {
  entries = glob("src/pages/*/*/main.js", { sync: true });
} catch (err) {
  entries = [];
  throw err;
}

entries.forEach(file => {
  const fileSplit = file.split("/");
  const length = fileSplit.length;
  let pageHtml = fileSplit.slice(0, length - 1).join("/") + "/index.html";
  if (!fs.existsSync(pageHtml)) {
    pageHtml = "public/index.html";
  }

  const key = fileSplit
    .slice(2, length - 1)
    .join("_")
    .toLowerCase();
  const filename = fileSplit.slice(1, length - 1).join("/") + ".html";

  pages[key] = {
    entry: file,
    template: pageHtml,
    filename: filename
  };
});

module.exports = {
  baseUrl: process.env.NODE_ENV === "production" ? "../../" : "/",
  assetsDir: "assets",
  pages
};

chainWebpack: (config) => {
  // 生产环境，开启js\css压缩
  if (process.env.NODE_ENV === 'production') {
    config.plugin('compressionPlugin').use(new CompressionPlugin({
      test: /\.(js|css|less)$/, // 匹配文件名
      threshold: 10240, // 对超过10k的数据压缩
      minRatio: 0.8,
      deleteOriginalAssets: true // 删除源文件
    }))
  }
}
