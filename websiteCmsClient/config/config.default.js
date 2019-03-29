'use strict';
const isProduction = process.env.NODE_ENV === 'production';

console.log(`isProduction is ${isProduction}`);

module.exports = appInfo => {
	const config = exports = {};

	// use for cookie sign key, should change to your own and keep security
	config.keys = appInfo.name + '_199111300725_1029';

	config.session = {
		key: 'EGG_SESS',
		maxAge: 30 * 60 * 1000, // 30分钟
		httpOnly: true,
		encrypt: true
	};

	// config.security = {
	// 	csrf: {
	// 		headerName: 'x-csrf-token', // 通过 header 传递 CSRF token 的默认字段为 x-csrf-token
	// 	}
	// };

	// 可跨域请求配置
	config.security = {
			csrf: {
				enable: false,
				ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
			},
			domainWhiteList: ['*'] // 可访问的白名单地址
		};
		config.cors = {
			allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
	};

	config.view = {
		defaultViewEngine: 'nunjucks',
		noCache: isProduction, // 仅在生产环境下开启
		mapping: {
			'.html': 'nunjucks',
		}
	};

	config.multipart = {
		fileSize: '50mb',
	};

	// add your config here
	config.middleware = [];

	return config;
};