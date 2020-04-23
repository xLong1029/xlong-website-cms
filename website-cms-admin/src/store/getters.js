const getters = {
  token: state => state.user.token,
  user: state => state.user.user,
  sidebarSpan: state => state.common.sidebarSpan,
  breadcrumb: state => state.common.breadcrumb,
  sidebarMenu: state => state.permission.sidebarMenu,
  siteInfo: state => state.common.siteInfo
}
export default getters
