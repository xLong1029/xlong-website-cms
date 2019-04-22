/*
 * 模块 : 关键词弹窗相关配置
 * 作者 : 罗永梅（381612175@qq.com）
 * 日期 : 2019-4-22
 * 版本 : version 1.0
 */
// 通用JS
import { StrToArr, UniqueArr, ArrRemovEmpty } from 'common/important.js'

export default {
	data() {
		return{
            // 显示关键词对话框
            kwModelShow: false,
            // 弹窗表单
            kwModelForm: {
                keyword: ''
            }
        }
    },
	methods: {
		// 添加关键词对话框显示状态
        kwModelVisible(val){
            this.kwModelShow = val;
            if(!val) this.kwModelForm.keyword = '';
        },
        // 移除关键词
        removeKeyword(index){
            this.infoForm.metaKeywords.splice(index, 1);
        },
        // 添加关键词
        addKeywords(form){
            this.$refs[form].validate((valid) => {
                if (valid) {
                    // 去除所有空格
                    let str = this.kwModelForm.keyword.replace(/\s*/g,"");

                    // 将中文逗号全转成英文逗号
                    str = str.replace(/，/g, ',');

                    let arr = StrToArr(str, ',');
                    arr = UniqueArr(arr);
                    arr = ArrRemovEmpty(arr);
    
                    this.infoForm.metaKeywords.push(...arr);
                    this.kwModelVisible(false);
                }
                else this.$Message.error('提交失败！填写有误');
            })
        }
	}
}