import tools from '@/tools'

export default {
	// 获取Banner列表
	GetBannerList: (params) => {
		return new Promise((resolve, reject) => {
			tools.HttpGet(`/api/WebsiteCms/ClientService/Banner/GetList`, params)
			.then(res => resolve(res))
			.catch(err => reject(err))
		})
	},
	// 修改Banner
	EditBanner: (params, id) => {
		return new Promise((resolve, reject) => {
			tools.HttpPost(`/api/WebsiteCms/ClientService/Banner/EditBanner?id=${id}`, params)
			.then(res => resolve(res))
			.catch(err => reject(err))
		})
	},
	// 新增Banner
	AddBanner: (params) => {
		return new Promise((resolve, reject) => {
			tools.HttpPost(`/api/WebsiteCms/ClientService/Banner/AddBanner`, params)
			.then(res => resolve(res))
			.catch(err => reject(err))
		})
	},
	// 删除Banner
	DelBanner: (params) => {
		return new Promise((resolve, reject) => {
			tools.HttpPost(`/api/WebsiteCms/ClientService/Banner/DelBanner`, params)
			.then(res => resolve(res))
			.catch(err => reject(err))
		})
	},
	// 启用禁用Banner
	SetEnable: (enable, ids) => {
		return new Promise((resolve, reject) => {
			tools.HttpPost(`/api/WebsiteCms/ClientService/Banner/SetEnable?enable=${enable}`, ids)
			.then(res => resolve(res))
			.catch(err => reject(err))
		})
	},
}
