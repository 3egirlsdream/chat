// const variables = require(__dirname + "/src/assets/css/variables.js");
// // const theme = require(__dirname +"/src/assets/css/theme.js");

// module.exports = {
//   plugins: [
//     require("postcss-assets")(false),
//     require("postcss-import")({}),
//     require("postcss-pxtorem")({
//       rootValue: 37.5,
//       propList: ["*"]
//     }),
//     // require("postcss-theme-variables")({
//     //   vars: theme,
//     //   prefix: "$"
//     // }),
//     require("postcss-extend-rule")({}),
//     require("postcss-advanced-variables")({
//       variables
//     }),
//     require("postcss-plugin-bem-atrule")({
//       "defaultNamespace": "el",
//       "style": "suit",
//       "separators": {
//         "descendent": "__",
//         "modifier": "--"
//       },
//       "shortcuts": {
//         "utility": "util",
//         "component": "b",
//         "modifier": "m",
//         "descendent": "e"
//       }
//     }),
//     require("postcss-preset-env")({
//       "stage": 2
//     }),
//     require("postcss-atroot")({}),
//     require("postcss-property-lookup")({}),
//     require("postcss-nested")({}),
//     require("postcss-nested-ancestors")({}),
//     require("postcss-calc")({}),
//     require('autoprefixer')({
//       browsers: ['Android >= 4.0', 'iOS >= 7']
//     }),
//     require("postcss-sass-color-functions")({}),
//     require("lost")(false),
//     require("postcss-utils")({})
//   ]
// };
