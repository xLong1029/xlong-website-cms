import request from 'utils/request.js'

export default {
  // 获取账户列表
  GetList: (params) => {
    return new Promise((resolve, reject) => {
      request.HttpGet(`/api/WebsiteCms/AccountService/Admin/GetList`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 新增账户
  AddAccount: (params) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/AccountService/Admin/AddAccount`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 删除账户
  DelAccount: (params) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/AccountService/Admin/DelAccount`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 启用禁用账户
  SetEnable: (enable, ids) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/AccountService/Admin/SetEnable?enable=${enable}`, ids)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 获取账户详情
  GetDetail: (id) => {
    return new Promise((resolve, reject) => {
      request.HttpGet(`/api/WebsiteCms/AccountService/Admin/GetDetail?id=${id}`)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 编辑账户
  EditAccount: (params, id) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/AccountService/Admin/EditAccount?id=${id}`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
}
