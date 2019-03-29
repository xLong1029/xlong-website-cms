import CommonApi from 'api/common.js';

// 通用设置
const common = {
  state: {
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
  },
  // 计算属性
  getters: {
    sidebarSpan: state => state.sidebarSpan,
    breadcrumb: state => state.breadcrumb,
    sidebarMenu: state => state.sidebarMenu,
    siteInfo: state => state.siteInfo
  },
  // 用来处理数据的函数，只能同步操作
  mutations: {
    SET_SIDEBAR_SPAN: (state, sidebarSpan) => {
      state.sidebarSpan = sidebarSpan;
    },
    SET_BREADCRUMB: (state, breadcrumb) => {
      state.breadcrumb = breadcrumb;
    },
    SET_SIDERBAR_MENU: (state, sidebarMenu) => {
      state.sidebarMenu = sidebarMenu;
    },
    SET_SITE_INFO: (state, siteInfo) => {
      state.siteInfo = siteInfo;
    },
  },
  // 异步操作
  actions: {
    // 获取站点信息
    GetSiteInfo({ commit }) {
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
}

export default common;
