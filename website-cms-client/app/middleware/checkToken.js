'use strict';

module.exports = options => {
    // session中token是否存在
    return async function tokenExist(ctx, next) {
		const sessionToken = ctx.session.token;
        const token = ctx.request.header.token;
		if(sessionToken && sessionToken == token) await next();
		else{
			// 清空用户信息
			ctx.session.user = null;
			ctx.body = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		}
	}
};