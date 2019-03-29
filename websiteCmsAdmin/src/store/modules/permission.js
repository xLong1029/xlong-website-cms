import { routerMap } from 'router';
import { CopyArr } from 'common/important.js';

// 判断用户身份是否有权限访问该路由
function hasPermission(role, route) {
	if (route.meta && route.meta.roles) {
		return route.meta.roles.indexOf(role) >= 0;
	}
	// route.meta.roles不存在说明不需要身份验证
	else return true;
}

// 用户信息
const permission = {
	// 异步操作
	actions: {
		// 动态生成侧边栏菜单
		SetSidebarMenu ({ commit }, role) {
			// 为了防止routerMap跟着改变，使用数组深克隆
			let mainRouterMap = CopyArr(routerMap.find(v => v.name === 'Main'));

			// 筛选出有权限的路由
			let accessedRouters = mainRouterMap.children.filter(v => {
				// 超级管理员拥有所有权限，无需筛选
				if(role === 'admin') return true;
				if(hasPermission(role, v)) {
					const children = v.children;
					if(children && children.length){
						// 三级路由
						v.children = children.filter(child => {
							if(hasPermission(role, child)) return child;
							return false;
						});
					}
					return v;
				}
				return false;
			});

			// 过滤掉隐藏的路由保存成侧边栏菜单
			let sidebarMenu = accessedRouters.filter(route => {
				if(!route.hidden){
					const children = route.children;
					if(children && children.length){
						route.children = children.filter(child => {
							return !child.hidden;
						});
					}
					return route;
				}
				return false;
			});

			commit('SET_SIDERBAR_MENU', sidebarMenu);
		}
	}
}

export default permission;
