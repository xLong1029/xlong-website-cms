/*
 * 模块 : 存储弹窗相关配置（新增/编辑数据）
 * 作者 : 罗永梅（381612175@qq.com）
 * 日期 : 2019-3-22
 * 版本 : version 1.0
 */

export default {
	data() {
		return {            
            // 操作类型 add | edit
            storeType: 'add',
            // 存储弹窗
            storeModel:{
                show: false,
                title: ''
            },
            // 弹窗表单
            modelForm: {},
            // 编辑id
            editId: 0
        }
	},
	methods: {
		// 弹窗可见性
        storeModalVisible(val, type){
            this.storeModel.show = val;
            this.storeType = type;

            if(val){
                this.storeModel.title = type == 'add' ? '新增内容' : '编辑内容';
            }
            else{
                // 重置内容
                // this.modelForm = {};
                this.$refs['modelForm'].resetFields();
            }
        },
        storeData(form){
            this.$refs[form].validate((valid) => {
                if (valid) {
                    // 页面加载
                    this.pageLoading = true;
            
                    if(this.storeType == 'add') this.addData(); 
                    else this.editData();
                }
                else this.$Message.error('提交失败！填写有误');
            })
        }
	}
}