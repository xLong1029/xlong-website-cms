import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
// Vuex 内置的日志插件，用于一般的调试
import createLogger from 'vuex/dist/logger';

const debug = process.env.NODE_ENV !== 'production'
// env里去获取当前的环境是否需要开启严格模式
// 在发布环境开启严格模式会造成性能上不必要的损失

Vue.use(Vuex);

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

// 状态存储仓库
const store = new Vuex.Store({
	// state分模块
  modules,
  getters,
	plugins: debug ? [createLogger()] : []
});

export default store
