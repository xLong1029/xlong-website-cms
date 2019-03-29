import tools from '@/tools'

export default {
  // 获取单页面列表
  GetList: (params) => {
    return new Promise((resolve, reject) => {
      tools.HttpGet(`/api/WebsiteCms/ClientService/PageCont/GetPageContList`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 新增单页面
  AddPageCont: (params) => {
    return new Promise((resolve, reject) => {
      tools.HttpPost(`/api/WebsiteCms/ClientService/PageCont/AddPageCont`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 删除单页面
  DelPageCont: (params) => {
    return new Promise((resolve, reject) => {
      tools.HttpPost(`/api/WebsiteCms/ClientService/PageCont/DelPageCont`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 启用禁用单页面
  SetEnable: (enable, ids) => {
    return new Promise((resolve, reject) => {
      tools.HttpPost(`/api/WebsiteCms/ClientService/PageCont/SetEnablePageCont?enable=${enable}`, ids)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 获取单页面详情
  GetDetail: (id) => {
    return new Promise((resolve, reject) => {
      tools.HttpGet(`/api/WebsiteCms/ClientService/PageCont/GetPageContDetail?id=${id}`)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 编辑单页面
  EditPageCont: (params, id) => {
    return new Promise((resolve, reject) => {
      tools.HttpPost(`/api/WebsiteCms/ClientService/PageCont/EditPageCont?id=${id}`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
}
