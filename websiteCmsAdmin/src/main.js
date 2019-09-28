// 解决 ie11打开vue2.0项目空白 问题
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

// iView框架
import iView from 'iview'
// 定制iView主题样式
// 这里有个坑，会出现各种css-loader,style-loader和less-loader的报错
// 解决方法是安装最新的vue-cli和loader以来，webpack就不需要配置了，因为vue-cli会帮你配置安装的loader
import './theme/index.less'

Vue.use(iView)

Vue.config.productionTip = false

// 配置全局变量，用于配置C端地址，显示图片
Vue.prototype.GLOBAL = {
	BASE_URL: 'http://127.0.0.1:6060',
	ShowImg: function(url){
		return this.BASE_URL +  url;
	}
}

new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App }
})
