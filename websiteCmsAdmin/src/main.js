// 解决 ie11打开vue2.0项目空白 问题
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// 权限
import './permission'

// ViewUI框架
import ViewUI from 'view-design';
// 定制ViewUI主题样式
import './theme/index.less'

Vue.use(ViewUI);

Vue.config.productionTip = false

// 配置全局变量，用于配置C端地址，显示图片
Vue.prototype.GLOBAL = {
	BASE_URL: 'http://127.0.0.1:6060',
	ShowImg: function(url){
		return this.BASE_URL +  url;
	}
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')