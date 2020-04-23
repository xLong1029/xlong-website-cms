/* eslint-disable */
import Api from 'api/passport.js';
import { GetCookie, DelCookie } from 'utils';

// 设置账户信息
function setAccount(_commit, info) {
	// 设置用户身份
	let role = '';
	switch (info.type) {
		case 1: role = 'admin'; break;
		case 2: role = 'manager'; break;
		case 3: role = 'editor'; break;
		default: role = ''
	}
	info.role = role;
	_commit('SET_USER', info);

	return info;
}

// 清空账户信息
function clearAccount(_commit) {
	// 清除token
	DelCookie('xlong_token');
	_commit('SET_USER', {});
}

const state = {
	// 登录凭证
	token: GetCookie('xlong_token'),
	// 用户信息
	user: {
		face: '',
		role: '',
		realname: ''
	}
}

const mutations = {
	SET_USER_TOKEN: (state, token) => {
		state.token = token;
	},
	SET_USER: (state, user) => {
		state.user = user;
	},
	SET_USER_FACE: (state, face) => {
		state.user.face = face;
	}
}

const actions = {
	// 获取用户信息
	checkToken({ commit }) {
		return new Promise((resolve, reject) => {
			Api.CheckToken(GetCookie('xlong_token')).then(res => {
				if (res.code == 200) {
					const info = setAccount(commit, res.data);
					console.log(info);
					resolve(info);
				}
				else {
					clearAccount(commit);
					reject();
				}
			}).catch(() => {
				clearAccount(commit);
				reject()
			})
		});
	},
	// 登出
	logout({ commit }) {
		return new Promise(resolve => {
			clearAccount(commit);
			resolve();
		});
	},
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
};
