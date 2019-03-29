import Vue from 'vue';
import Vuex from 'vuex';
// Vuex 内置的日志插件，用于一般的调试
import createLogger from 'vuex/dist/logger';

import user from './modules/user';
import common from './modules/common';
import permission from './modules/permission';

const debug = process.env.NODE_ENV !== 'production'
// env里去获取当前的环境是否需要开启严格模式
// 在发布环境开启严格模式会造成性能上不必要的损失

Vue.use(Vuex);

// 状态存储仓库
const store = new Vuex.Store({
	// state分模块
	modules: {
		user,
		common,
		permission
	},
	plugins: debug ? [createLogger()] : []
});

export default store
