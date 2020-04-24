<template>
    <div class="g-content">
        <div style="width:500px;">
            <Form ref="editForm" :model="editForm" :rules="validate" :label-width="100">
                <Form-item prop="oldPassword" label="旧密码：">
                    <Input type="password" v-model="editForm.oldPassword" placeholder="请输入旧密码"/>
                </Form-item>
                <Form-item prop="newPassword" label="新密码：">
                    <Input type="password" v-model="editForm.newPassword" placeholder="请输入新密码（6-12位字母和数字的组合）"/>
                </Form-item>
                <Form-item prop="passwdCheck" label="确认密码：">
                    <Input type="password" v-model="editForm.passwdCheck" placeholder="请输入确认密码"/>
                </Form-item>
                <Form-item>
                    <Button type="primary" @click="submit('editForm')">确认修改</Button>
                </Form-item>
            </Form>
        </div>
    </div>
</template>

<script>
    // 验证方法
	import Validate from 'utils/validate.js'
	// Api方法
    import Api from 'api/profile.js'

	export default {
		data(){
			return {
				// 表单信息
				editForm:{
                    // 旧密码
                    oldPassword: '',
					// 新密码
					newPassword: '',
					// 确认密码
					passwdCheck: '',
				},
				// 验证规则
				validate: {
                    oldPassword: [{
                        validator: (rule, value, callback) => {
                            Validate.ValidPassword(value, callback, true);
                        },
                        trigger: 'blur',
                        required: true,
                    }],
                    newPassword:[{
                        validator: (rule, value, callback) => {
                            Validate.ValidPassword(value, callback, true);
                        },
                        trigger: 'blur',
                        required: true,
                    }],
                    passwdCheck:[{
                        validator: (rule, value, callback) => {
                            Validate.ValidPwdCheck(this.editForm.newPassword, value, callback, true);
                        },
                        trigger: 'blur',
                        required: true,
                    }],
                }
			}
        },
        created(){
            this.init();
        },
        methods:{
            // 初始化页面
            init(){
                // 设置面包屑路径
                this.$store.commit('common/SET_BREADCRUMB', [
                    { name: '修改密码', path: '/ChangePwd' }
                ]);
            },
            // 提交表单
            submit(form){
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        if(this.editForm.oldPassword == this.editForm.newPassword){
                            this.$Message.error('旧密码和新密码不能相同');
                        }
                        else{
                            Api.ChangePwd(this.editForm)
                            .then(res => {
                                if(res.code == 200){                                                            
                                    // 登出 action方法
                                    this.$store.dispatch('user/logout')
                                    .then(() => {
                                        this.$Message.success('密码修改成功！请重新登录');
                                        this.$router.push({ name: 'Login' });
                                    })
                                    .catch(err => console.log(err))
                                }
                                else this.$Message.warning(res.msg);
                            })
                            .catch(() => this.$Message.error('密码修改失败'));
                        }
                    }
                    else this.$Message.error('提交失败！填写有误');
                })
            },
        }
	}
</script>
