// 解决 ie11打开vue2.0项目空白 问题
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// 获取cookie
import { GetCookie } from './common/important'

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

// 不重定向白名单
const whiteList = [ 'Err404', 'Login']

router.beforeEach((to, from, next) => {
	// 获取存储token
	let isLogin = Boolean(GetCookie('hj_token'));
	// 判断是否已登录
	if(isLogin){
		// 如果路由地址为登录页，则重定向到管理后台主页
		if(to.name === 'Login') next({ name : 'Main'});
		else{
			// 获取站点信息
			store.dispatch('GetSiteInfo');
			// 验证token
			store.dispatch('CheckToken', GetCookie('hj_token')).then(() => {
				const role = store.getters.user.role;
				console.log(`Get role's value, and the user's role is ${role}.`);

				// 生成侧边栏菜单
				store.dispatch('SetSidebarMenu', role);
				// 是否有路由元信息
				if(to.meta && to.meta.roles){
					if(to.meta.roles.indexOf(role) !== -1) next();
					else next({ name : 'Err404'})
				}
				else next();
				
			}).catch(err => {
				// 提示'用户验证信息失效，请重新登录'
				alert(err.msg);
				next({ name : 'Login'});
			});
		}
	}
	// 没有token则全部重定向到登录页
	else{
		// 免登录白名单，可直接进入
		if(whiteList.indexOf(to.name) !== -1) next();
		else next({ name : 'Login'});
	}
})

new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App }
})
