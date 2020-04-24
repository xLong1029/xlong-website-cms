'use strict';

// had enabled by egg
// exports.static = true;

// 启用 nunjucks 插件
exports.nunjucks = {
    enable: true,
    package: 'egg-view-nunjucks'
};

exports.cors = {
    enable: true,
    package: 'egg-cors',
};