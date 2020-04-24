/*
 * 模块 : 邮箱自动填充相关配置
 * 作者 : 罗永梅（381612175@qq.com）
 * 日期 : 2017-9-22
 * 版本 : version 1.0
 */

export default {
	data() {
		return {
            // 邮箱列表
            emailList: [],
		}
    },
    created(){},
	methods: {
		// 选择邮箱后缀名
        selectEmail(value) {
            this.emailList = !value || value.indexOf('@') >= 0 ? [] : [
                value + '@qq.com',
                value + '@sina.com',
                value + '@dingtalk.com',
                value + '@115.com',
                value + '@163.com',
            ];
        },
        // 设置邮箱
        setEmail(value){
            if(this.infoForm) this.infoForm.email = value;
            else if(this.queryForm) this.queryForm.email = value; 
        }
	}
}