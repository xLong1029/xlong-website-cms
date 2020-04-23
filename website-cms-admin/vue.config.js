// vue.config.js相关配置请参考 https://github.com/vuejs/vue-cli/tree/dev/docs/config
// const webpack = require("webpack");
const production = process.env.NODE_ENV === 'production';
const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
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