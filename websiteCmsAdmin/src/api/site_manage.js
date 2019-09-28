import request from 'utils/request.js'

export default {
	// 获取友情链接列表
	GetFLinkList: (params) => {
		return new Promise((resolve, reject) => {
			request.HttpGet(`/api/WebsiteCms/ClientService/FriendlyLink/GetList`, params)
			.then(res => resolve(res))
			.catch(err => reject(err))
		})
	},
	// 修改友情链接
	EditFLink: (params, id) => {
		return new Promise((resolve, reject) => {
			request.HttpPost(`/api/WebsiteCms/ClientService/FriendlyLink/EditLink?id=${id}`, params)
			.then(res => resolve(res))
			.catch(err => reject(err))
		})
	},
	// 新增友情链接
	AddFLink: (params) => {
		return new Promise((resolve, reject) => {
			request.HttpPost(`/api/WebsiteCms/ClientService/FriendlyLink/AddLink`, params)
			.then(res => resolve(res))
			.catch(err => reject(err))
		})
	},
	// 删除友情链接
	DelFLink: (params) => {
		return new Promise((resolve, reject) => {
			request.HttpPost(`/api/WebsiteCms/ClientService/FriendlyLink/DelLink`, params)
			.then(res => resolve(res))
			.catch(err => reject(err))
		})
	},
	// 启用禁用友情链接
	SetEnableFLink: (enable, ids) => {
		return new Promise((resolve, reject) => {
			request.HttpPost(`/api/WebsiteCms/ClientService/FriendlyLink/SetEnable?enable=${enable}`, ids)
			.then(res => resolve(res))
			.catch(err => reject(err))
		})
	},
}
