import Api from 'api/passport.js';
import { GetCookie, DelCookie } from 'common/important.js';

// 设置账户信息
function setAccount(_commit, info) {
	// 设置用户身份
	let role = '';		
	switch(info.type){
		case 1: role = 'admin'; break;
		case 2: role = 'manager'; break;
		case 3: role = 'editor'; break;
		default: role = ''
	}
	info.role = role;
	_commit('SET_USER', info);

	return role;
}

// 清空账户信息
function clearAccount(_commit) {
	// 清除token
	DelCookie('hj_token');
	_commit('SET_USER', {});
}

// 用户信息
const user = {
	// 负责存储整个应用的状态数据
	state: {
		// 登录凭证
	  	token: GetCookie('hj_token'),
	  	// 用户信息
	  	user:{
			face: '',
			role: '',
			realname: ''
		}
	},
	// 计算属性
	getters: {
		token: state => state.token,
		user: state => state.user,
	},
	// 用来处理数据的函数，只能同步操作
	mutations: {
		SET_USER_TOKEN: (state, token) => {
			state.token = token;
		},
		SET_USER: (state, user) => {
			state.user = user;
		},
		SET_USER_FACE: (state, face) => {
			state.user.face = face;
		}
	},
	// 异步操作
	actions: {
		// 获取用户信息
		CheckToken ({ commit }, token) {
			return new Promise((resolve, reject) => {
				Api.CheckToken(token).then(res => {
					if(res.code == 200){
						setAccount(commit, res.data);
						resolve(res);
					}
					else{
						clearAccount(commit);
						reject(res);
					}					
				})
				.catch((err) => {
					clearAccount(commit);
					reject(err)
				})
			});
		},
		// 登出
		LogOut ({ commit }) {
			return new Promise(resolve => {
				clearAccount(commit);
				resolve();
			});
		},
	}
}

export default user;
