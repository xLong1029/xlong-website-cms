/* eslint-disable */
import { routes } from 'router';
import { CopyArr } from 'utils';

/**
 * 使用meta.role判断用户身份是否有权限访问该路由
 * @param route
 * @param role
 */
function hasPermission(route, role) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.indexOf(role) >= 0;
  }
  // route.meta.roles不存在说明不需要身份验证
  else return true;
}

/**
 * 递归过滤路由表
 * @param routes
 * @param role
 */
function filterRoutes(routes, role) {
  // 超级管理员拥有所有权限，无需筛选
  if (role === 'admin') return routes;

  let res = [];

  routes.forEach(route => {
    const tmp = { ...route };
    if (hasPermission(tmp, role)) {
      if (tmp.children && tmp.children.length) {
        tmp.children = filterRoutes(tmp.children, role);
      }
      res.push(tmp);
    }
  })

  return res;
}

/**
 * 过滤掉隐藏的路由保存成侧边栏菜单
 * @param routes
 */
function getSidebarMenu(routes) {
  let res = [];

  routes.forEach(route => {
    const tmp = { ...route };
    if (!route.hidden) {
      if (tmp.children && tmp.children.length) {
        tmp.children = getSidebarMenu(tmp.children);
      }
      res.push(tmp);
    }
  })

  return res;
}

const state = {
  // 侧边栏导航菜单
  sidebarMenu: []
}

const mutations = {
  SET_SIDERBAR_MENU: (state, sidebarMenu) => {
    state.sidebarMenu = sidebarMenu;
  }
}

const actions = {
  // 动态生成侧边栏菜单
  setSidebarMenu({ commit }, role) {
    return new Promise((resolve, reject) => {
      // 主框架页面
      let mainRouterMap = routes.find(v => v.name === 'Main');

      // 筛选出有权限的路由
      let accessedRouters = filterRoutes(mainRouterMap.children, role);

      // 过滤掉隐藏的路由保存成侧边栏菜单
      let sidebarMenu = getSidebarMenu(accessedRouters);

      commit('SET_SIDERBAR_MENU', sidebarMenu);

      resolve();
    });
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
