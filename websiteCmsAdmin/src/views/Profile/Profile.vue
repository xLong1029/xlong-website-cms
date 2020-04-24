<template>
    <div class="g-content">
        <!--  加载判断 -->
        <Loading v-if="pageLoading"></Loading>
        <Form  v-else ref="infoForm" :model="infoForm" :rules="validate" :label-width="110">
            <Row>
                <i-col span="10">
                    <Form-item label="账号：">
                        <span>{{ infoForm.username }}</span>
                    </Form-item>
                    <Form-item label="真实姓名：" prop="realname">
                        <Input v-model="infoForm.realname" placeholder="请输入您的真实姓名"/>
                    </Form-item>
                    <Form-item label="头像：">
                        <!-- 组件-图片上传-单图片显示 -->
                        <SingleImage :src="infoForm.face" upload-dir="img/avatar/" :preview="true" @get-img-url="setFace"></SingleImage>
                    </Form-item>
                    <Form-item label="电子邮箱：" prop="email">
                        <Input v-model="infoForm.email" placeholder="请输入您的邮箱地址"/>
                    </Form-item>
                    <Form-item label="手机号码：" prop="mobile">
                        <Input v-model="infoForm.mobile" placeholder="请输入您的手机号码"/>
                    </Form-item>
                    <Form-item>
                        <Button type="primary" @click="submit('infoForm')">确认修改</Button>
                    </Form-item>
                </i-col>
            </Row>
        </Form>
    </div>
</template>

<script>
    // 组件
    import Loading from 'components/Common/Loading'
    import SingleImage from 'components/Image/UploadImage/SingleImage'
    // 通用方法
    import Common from 'utils/common.js'
	// Api方法
    import Api from 'api/profile.js'
    // Vuex
    import { mapGetters } from 'vuex'

    export default {
        components: {  Loading, SingleImage },
        computed: {
            ...mapGetters([ 'token' ])
        },
		data(){
			return {
                // 加载页面
                pageLoading: true,
				// 表单信息
                infoForm: {
                    // 用户名(账号)
                    username: '',
                    // 真实姓名
                    realname: '',
                    // 头像图片地址
                    face: require('@/assets/images/default-face.jpg'),
                    // 电子邮箱
                    email: '',
                    // 手机号码
                    mobile: '',
                },
				// 验证规则
                validate: {
                    realname: [
                        { required: true, message: '真实姓名不能为空', trigger: 'blur' },
                        {
							pattern: Common.regRealName, message: "真实姓名格式为2-20个字符的中文", trigger: "blur"
						}
                    ],
                    email: [{ pattern: Common.regEmail, message: "邮箱格式不正确", trigger: "blur" }],
                    mobile: [{ pattern: Common.regMobile, message: "手机号码格式不正确", trigger: "blur" }]
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
                    { name: '个人资料', path: null }
                ]);
                this.getProfile();
            },
            // 提交表单
            submit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.pageLoading = true;
                        
                        Api.EditProfile(this.infoForm)
                        .then(res => {
                            this.pageLoading = false;
                            if(res.code == 200) {
                                this.$Message.success('资料修改成功');
                                this.$store.commit('user/SET_USER_FACE', this.infoForm.face);
                            }
                            else this.$Message.warning(res.msg);
                        })
                        .catch(() => this.$Message.error('资料修改失败'));
                    }
                    else this.$Message.error('提交失败！填写有误');
                })
            },
            // 获取个人资料
            getProfile(){
                Api.GetUserInfo(this.token)
                .then(res => {
                    // 获取到数据
                    if(res.code == 200){
                        this.pageLoading = false;					
                        this.infoForm = res.data;
                    }
                    else this.$Message.warning(res.msg);
                })
                .catch(() => this.$Message.error('资料获取失败'));
            },
            // 设置头像
            setFace(url){
                this.infoForm.face = url;
            }
        }
	}
</script>

