<template>
  	<div id="login" class="m-login">
       <Form ref="loginForm" :model="loginForm" :rules="validate" class="login-form">
       		<h3 class="form-title"><a href="/"><img :src="siteInfo.logo"/></a></h3>
	        <Form-item prop="username">
	            <Input v-model="loginForm.username" placeholder="请输入手机号码" @keyup.enter.native="submit('loginForm')">
	            	<Icon type="ios-person-outline" slot="prepend"></Icon>
	            </Input>
	        </Form-item>
	        <Form-item prop="password">
	            <Input type="password" v-model="loginForm.password" placeholder="请输入密码" @keyup.enter.native="submit('loginForm')">
	            	<Icon type="ios-locked-outline" slot="prepend"></Icon>
	            </Input>
	        </Form-item>
	        <Form-item>
	            <Checkbox v-model="remeberPwd">记住密码</Checkbox>
	            <!-- <router-link to="/SendVerifyCode" class="fr">忘记密码</router-link> -->
	        </Form-item>
	        <Form-item>
	            <Button type="primary" long @click="submit('loginForm')" :loading="loading">登录</Button>
	        </Form-item>
	        <div style="text-align:center">测试使用登录账号:user2 密码:123456</div>
	    </Form>
		<!-- 项目版权 -->
		<div class="copyright">
			Copyright &copy; 2018 {{ siteInfo.companyName }} 版权所有 {{ siteInfo.webRecordInfo }}
		</div>
	</div>
</template>

<script>
	import { SetCookie, SetLocalS, GetLocalS, Encrypt, Decrypt } from 'common/important.js'
	// Api方法
	import LoginApi from 'api/passport.js'
	import CommonApi from 'api/common.js'

	export default {
		data(){
			return {
				// 加载状态
				loading: false,
				siteInfo: {
					// logo
					logo: require('assets/images/logo-green.png'),
                    // 备案信息
                    webRecordInfo: '',
                    // 公司名称
                    companyName: '',
                    // 站点链接
                    website: '',
				},
				// 表单信息
				loginForm:{
					// 用户名
					username: 'admin',
					// 密码
					password: 'admin123',
				},
				// 记住密码
				remeberPwd: false,
				// 验证规则
				validate: {
                    username: [
						{ required: true, message: '用户名不能为空', trigger: 'blur' },
						{ pattern: /^[\S]+$/, message: '请不要输入空字符', trigger: 'blur' }
					],
                    password: [{ required: true, message: '登录密码不能为空', trigger: 'blur' }],
                }
			}
		},
		created() {
			this.init();
		},
		mounted(){
			const loginBg = document.getElementById('login');
			// 设置背景颜色高度
			loginBg.style.height = document.body.scrollHeight + 'px';
			// 监听窗口变化
            window.onresize = () => {
				loginBg.style.height = document.body.scrollHeight + 'px';
            }
		},
		methods:{
			// 初始化页面
			init(){
				// 判断本地存储用户名是否存在
				if (GetLocalS('username')) {
					// 获取本地存储的用户名和密码
					this.loginForm.username = GetLocalS('username');
					this.loginForm.password = Decrypt(GetLocalS('password'));
					this.remeberPwd = true;
				}

				// 获取站点信息
				CommonApi.GetSiteInfo()
                .then(res => {
                    // 取消页面加载
                    this.pageLoading = false;
                    if(res.code == 200){
						this.siteInfo = res.data;
						this.$store.commit('SET_SITE_INFO', res.data);
                    }
                    else this.$Message.warning(res.msg);
                })
                .catch(err => console.log(err))
			},
			// 提交表单
			submit (form){
                this.$refs[form].validate((valid) => {
                    if (valid) {
						LoginApi.Login(this.loginForm)
						.then(res => {
							if(res.code == 200){
								const result = res.data;

								// 存储token
								SetCookie('hj_token', result.token);
								// 判断是否记住密码
								if (this.remeberPwd) {
									// 本地存储用户名和密码
									SetLocalS('username', this.loginForm.username);
									SetLocalS('password', Encrypt(this.loginForm.password));
								}
								this.$store.commit('SET_USER_TOKEN', result.token);
								
								// 跳转到后台主页
								this.$router.push({ name: 'Main' });
								this.$Message.success('登录成功!');
							}
							else this.$Message.error('登录失败!用户名或密码不正确！');
						})
						.catch(err => console.log(err));
                    }
                    else this.$Message.error('登录失败!填写有误！');
                })
            },
		}
	}
</script>
<style lang="less" scoped>
	.m-login {
	    position: relative;
	    width: 100%;
	    height: 100%;
	    height: 100vh;
		min-height: 900px;
	    background-color: #4d5256;
	}

	.login-form{
	    position: absolute;
	    left: 50%;
		top: 50%;
	    width: 400px;
	    padding: 35px 35px 15px;
	    margin: auto;
		margin-top: -250px;
		margin-left: -200px;
	    background: #fff;
	    border: 1px solid #eaeaea;
	    border-radius: 5px;
		-moz-border-radius: 5px;
		-webkit-border-radius: 5px;
		box-shadow: 0 0 25px #555;
	}

	.form-title{
		font-size: 24px;
		font-weight: 400;
		color: #555;
		margin: 0 auto 20px;
		text-align: center;
		font-weight: 700;

		img{
			display: inline-block;
			width: 130px;
		}
	}

	.copyright{
		position: absolute;
		bottom: 20px;
		width: 100%;
		text-align: center;
		color: #888;
		font-size: 12px;
	}
</style>
