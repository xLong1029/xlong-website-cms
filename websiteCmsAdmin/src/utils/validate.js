/*
 * 功能 : 封装与iView框架相关的表单验证方法
 * 作者 : 罗永梅（381612175@qq.com）
 * 日期 : 2017-10-25
 * 版本 : version 2.0
 */
import Common from './common.js'
import { CompareDate } from './index.js'

export default {
    // 验证密码
    ValidPassword: (password, callback, required) => {
        // 密码为空
        if(password == ''){
            // 若必填
            if(required) return callback(new Error('密码不能为空'));
            else return callback();
        }
        else{           
            if(!Common.regPassword.test(password)) return callback(new Error('密码格式为6-12位，字母、数字和下划线的组合'));
            else return callback();
        }
    },
    // 验证确认密码
    ValidPwdCheck: (password, pwdCheck, callback, required) => {
        // 确认密码为空
        if(pwdCheck == ''){
            // 若必填
            if(required) return callback(new Error('确认密码不能为空'));
            else {                
                if(password != '') return callback(new Error('确认密码不能为空'));
                else return callback();
            }
        }
        else{
            if(password != pwdCheck){
                return callback(new Error('两次输入密码不一致'));
            }
            else return callback();
        }
    },
    // 验证出生日期
    ValidBirthDate: (birhtDate, callback, required) => {
        // 出生日期为空
        if(birhtDate == ''){
            // 若必填
            if(required) return callback(new Error('出生日期不能为空'));
            else return callback();
        }
        else{
            let nowDate = new Date();
            const compare = CompareDate(birhtDate, nowDate);
            if (!compare) return callback(new Error('出生日期不能大于当前日期'));
            else return callback();
        }
    },
    // 验证所在省市
    ValidProvince: (province, callback, required) => {
        // 若必填
        if(required){
            // 省份为空
            if(province == ''){
                return callback(new Error('所在省份不能为空'));
            }
            else return callback();
        }
        else return callback();
    },
    // 验证是否同意协议
    ValidAgreement: (agerrment, errorText, callback, required) => {
        if(required){
            if (!agerrment) {
                return callback(new Error(errorText));
            }
            else return callback();
        }
        else return callback();       
    },
    // 验证验证码
    ValidCode: (code, callback, required) => {
        if(required){
            if(!code){
                return callback(new Error('验证码不能为空'));
            }
            else return callback(); 
        }
        else return callback();       
    },
    // 验证用户名
    ValidUserName: (userName, callback, required) => {
        if(required){
            if(!userName){
                return callback(new Error('用户名不能为空'));
            }
            else if (!Common.regUserName.test(userName)) {
                return callback(new Error('用户名格式为以字母开头的6-16位字母和数字的组合'));
            }
            else return callback(); 
        }
        else return callback();       
    },
    // 验证用户类型
    ValidUserType: (type, callback, required) => {
        if(required){
            if(!type){
                return callback(new Error('用户类型不能为空'));
            }
            else return callback(); 
        }
        else return callback();       
    },
    // 验证日期范围选择
    ValidRangeDate: (startDate, endDate, callback, required) => {
        // 若必填
        if(required && startDate == '') return callback(new Error('开始日期不能为空'));
        if(required && endDate == '') return callback(new Error('结束日期不能为空'));
        else{
            if(startDate){
                let nowDate = new Date();
                const compare = CompareDate(startDate, nowDate);
                
                if (!compare) return callback(new Error('开始日期不能大于当前日期'));
                else{
                    if(endDate){
                        const compare = CompareDate(startDate, endDate);
                        if (!compare) return callback(new Error('结束日期不能小于开始日期'));
                        else return callback(); 
                    }
                    else return callback(); 
                }
            }
            else{
                if(endDate) return callback(new Error('请选择开始日期'));
                else return callback();
            }
        } 
    }
}