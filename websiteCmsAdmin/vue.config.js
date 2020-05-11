// vue.config.js相关配置请参考 https://github.com/vuejs/vue-cli/tree/dev/docs/config
// const webpack = require("webpack");
const production = process.env.NODE_ENV === 'production';
const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    // 部署应用程序的基本URL
    // 默认情况下，将部署在域的根目录下。如果部署在子路径上，则需要使用此选项指定子路径。例如，部署在https://www.foobar.com/my-app/，则publicPath到'/my-app/'
    publicPath: production ? '/public/admin/' : '/',
    // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
    assetsDir: "static",
    //默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。你可以通过将这个选项设为 false 来关闭文件名哈希。(false的时候就是让原来的文件名不改变)
    filenameHashing: false,
    // 生产环境是否生成 sourceMap 文件，将此设置为false不输出map文件可以加速生产构建
    productionSourceMap: false,
    // webpack配置，如果值是Object，则它将使用webpack-merge合并到最终配置中
    configureWebpack:{
        resolve: {
            alias: {
              // 定义别名和插件位置
              'vue$': 'vue/dist/vue.esm.js',
              '@': resolve('src'),
              'api': resolve('src/api'),
              'mock': resolve('src/mock'),
              'mixins': resolve('src/mixins'),
              'assets': resolve('src/assets'),
              'common': resolve('src/common'),
              'components': resolve('src/components'),
              'views': resolve('src/views'),
              'utils': resolve( 'src/utils'),
              'router': resolve( 'src/router'),
            }
          }
    },    
    chainWebpack: config => {
        config
          .plugin('html')
          .tap(args => {
            // 修改配置名称
            args[0].title= '企业后台管理系统';
            return args
          })
      },
    devServer: {
        // 端口
        port: 6061,
        https: false,
        // 配置自动启动浏览器
        open: true,
        // 代理服务
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:6060/api/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}