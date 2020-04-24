/*
 * 模块 : 表格查询相关配置
 * 作者 : 罗永梅（381612175@qq.com）
 * 日期 : 2017-8-31
 * 版本 : version 1.0
 */

export default {
	data() {
		return {}
	},
	methods: {
		// 获取查询开始日期
		getStartDate(date) {
			console.log('get start date:' + date);
			this.queryForm.sTime = date;
		},
		// 获取查询结束日期
		getEndDate(date) {
			console.log('get end date:' + date);
			this.queryForm.eTime = date;
		},
		// 查询
		// form:表单对象， getValid:是否需要验证表单
		query(form, getValid) {
			// 修改当前页码
			this.page.pageNo = 1;

			if(getValid == 'valid'){
				// 表单验证
				this.$refs[form].validate((valid)=>{
					// 传值true表示要筛选用户列表            
					if (valid) this.getTableList(true);
					else this.$Message.warning('查询失败！填写有误');
				})
			}
			else this.getTableList(true);
		},
		// 删除查询对象属性（清空对象）
		clearQuery(){		
			for(let key in this.queryForm){
				delete this.queryForm[key];
			}
		},
		// 重置查询内容
		resetQuery(form){
			this.clearQuery();
			this.$refs[form].resetFields();
			// 重置页码
			this.page.pageNo = 1;
			this.getTableList();
		},
		// 获取表格列表
		getTableList(query){
			this.pageLoading = true;

			// 是否需要筛选查询
			if(this.queryForm){
				this.queryForm.pageNo = this.page.pageNo;
				this.queryForm.pageSize = this.page.pageSize;

				if(query){
					if(this.queryForm.sTime != '' && this.queryForm.eTime == ''){
						this.queryForm.eTime = new Date();
					}
				}
			}

			this.apiGetList().then(res => {
				this.pageLoading = false;
				if(res.code == 200){
					// 设置数据
					this.setListData(res.data);
					if(this.page){
						// 设置页码
						this.setPage(res.page);
					}
				}
				else this.$Message.error('数据获取失败');
			})
			.catch(err => console.log(err))
		},
		// 设置列表数据
		setListData(result){
			if(result.length > 0){
				this.listData = result;
			}
			else this.listData = [];
		},
		// 更新列表信息
		updateList(){
			// 判断是否为查询状态
			this.isQuery ? this.getTableList(true) : this.getTableList();
		}
	}
}