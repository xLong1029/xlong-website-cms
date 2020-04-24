import CommonApi from 'api/common.js';

const state = {
  // 侧边栏span宽度
  sidebarSpan: 3,
  // 侧边栏导航菜单
  sidebarMenu: [],
  // 面包屑路径
  // [{
  // 	name: '首页',
  // 	path: '/Home'
  // }]
  breadcrumb: [],
  // 站点信息
  siteInfo: {}
}

const mutations = {
  SET_SIDEBAR_SPAN: (state, sidebarSpan) => {
    state.sidebarSpan = sidebarSpan;
  },
  SET_BREADCRUMB: (state, breadcrumb) => {
    state.breadcrumb = breadcrumb;
  },
  SET_SITE_INFO: (state, siteInfo) => {
    state.siteInfo = siteInfo;
  }
}

const actions = {
  // 获取站点信息
  getSiteInfo({ commit }) {
    // 获取站点信息
    CommonApi.GetSiteInfo()
      .then(res => {
        if (res.code == 200) {
          commit('SET_SITE_INFO', res.data);
        }
      })
      .catch(err => console.log(err))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
