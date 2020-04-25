import router from './router'
import store from '@/store'
import { Message } from 'view-design'
// 获取cookie
import { GetCookie } from 'utils'

// 不重定向白名单
const whiteList = ['Login', 'Err404'];

router.beforeEach(async (to, from, next) => {
	// 获取存储token
	let isLogin = Boolean(GetCookie('xlong_token'));
	// 判断是否已登录
	if (isLogin) {
		// 如果路由地址为登录页，则重定向到管理后台主页
		if (to.name === 'Login') next({ name: 'Main' });
		else {
			try {
				// 获取站点信息
				await store.dispatch('common/getSiteInfo');

				// 获取用户信息
				const { role } = await store.dispatch('user/checkToken');
				console.log(`Get role's value, and the user's roles is ${role}.`);

				// 生成侧边栏菜单
				await store.dispatch('permission/setSidebarMenu', role);

				// 是否有路由元信息
				if (to.meta && to.meta.roles) {
					if (to.meta.roles.indexOf(role) !== -1) next();
					else next({ name: 'Err404' })
				}
				else next();
			} catch (err) {
				// 重新登录
				Message.error('用户登录信息已失效，请重新登录');
				setTimeout(async () => {
					await store.dispatch('user/logout');
					next({ name: 'Login' });
				}, 500);
			}
		}
	}
	// 没有token则全部重定向到登录页
	else {
		console.log(to.name);
		// 免登录白名单，可直接进入
		if (whiteList.indexOf(to.name) !== -1) next();
		else next({ name: 'Login' });
	}
})

router.afterEach(() => {
})