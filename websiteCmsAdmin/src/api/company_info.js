import request from 'utils/request.js'

export default {
  // 获取公司介绍
  GetCompanyIntro: () => {
    return new Promise((resolve, reject) => {
      request.HttpGet(`/api/WebsiteCms/InfoService/Compnay/GetCompanyIntro`)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 修改公司介绍
  EditCompanyIntro: (params) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/InfoService/Compnay/EditCompanyIntro`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 获取团队介绍
  GetTeamContent: () => {
    return new Promise((resolve, reject) => {
      request.HttpGet(`/api/WebsiteCms/InfoService/Team/GetContent`)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 修改团队介绍
  EditTeamContent: (params) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/InfoService/Team/EditContent`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 获取联系信息列表
  GetContactList: () => {
    return new Promise((resolve, reject) => {
      request.HttpGet(`/api/WebsiteCms/InfoService/Contact/GetList`)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 修改联系信息
  EditContactInfo: (params, id) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/InfoService/Contact/EditContact?id=${id}`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 新增联系信息
  AddContactInfo: (params) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/InfoService/Contact/AddContact`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 删除联系信息
  DelContactInfo: (params) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/InfoService/Contact/DelContact`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 启用禁用联系信息
  SetEnableContact: (enable, ids) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/InfoService/Contact/SetEnable?enable=${enable}`, ids)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
}
