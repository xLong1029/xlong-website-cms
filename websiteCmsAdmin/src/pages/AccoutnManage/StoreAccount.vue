<template>
    <div class="g-content">
        <!--  加载判断 -->
        <Loading v-if="pageLoading"></Loading>
        <Form v-else ref="infoForm" :model="infoForm" :rules="validate" :label-width="120">
            <!-- 个人信息 -->
            <h2 class="m-title">个人信息</h2>
            <div class="m-content">
                <Row>
                    <Col span="12">
                        <Form-item v-if="pageType == 'edit'" label="用户编号：">
                            <span>{{ userId }}</span>
                        </Form-item>
                        <Form-item label="用户名：" prop="username">
                            <Input v-model="infoForm.username" placeholder="请输入用户名"/>
                        </Form-item>
                        <Form-item label="真实姓名：" prop="realname">
                            <Input v-model="infoForm.realname" placeholder="请输入真实姓名"/>
                        </Form-item>
                        <Form-item label="用户类型：" prop="type">
                            <Radio-group v-model="infoForm.type">
                                <Radio :label="1">超级管理员</Radio>
                                <Radio :label="2">普通管理员</Radio>
                                <Radio :label="3">文章管理员</Radio>
                            </Radio-group>
                        </Form-item>
                        <Form-item label="手机号码：" prop="mobile">
                            <Input v-model="infoForm.mobile" placeholder="请输入手机号码"/>
                        </Form-item>
                    </Col>
                    <Col span="12">
                        <Form-item v-if="pageType == 'edit'" label="创建时间：">
                            <span>{{ infoForm.createTime }}</span>
                        </Form-item>
                        <Form-item label="头像：" style="margin-bottom:16px;">
                            <!-- 组件-图片上传-单图片显示 -->
                            <SingleImage :src="GLOBAL.ShowImg(infoForm.face)" upload-dir="img/avatar/" :preview="true" size-hint="100*100px" @get-img-url="setFace"></SingleImage>
                        </Form-item>
                         <Form-item label="邮箱：" prop="email">
                            <AutoComplete v-model="infoForm.email" :data="emailList" @on-search="selectEmail" @on-select="setEmail" placeholder="请输入邮箱地址"></AutoComplete>
                        </Form-item>
                    </Col>
                </Row>
            </div>
            <!-- 账号信息 -->
            <h2 class="m-title">账号信息<span v-if="pageType == 'edit'">(密码为空表示不做修改)</span></h2>
            <div class="m-content">
                <Row>
                    <Col span="12">
                    <Form-item label="密码：" prop="password">
                        <Input type="password" v-model="infoForm.password" placeholder="请输入密码"/>
                    </Form-item>
                    </Col>
                    <Col span="12">
                    <Form-item label="确认密码：" prop="passwdCheck">
                        <Input type="password" v-model="infoForm.passwdCheck" placeholder="请输入确认密码"/>
                    </Form-item>
                    </Col>
                </Row>
            </div>
            <!-- 操作按钮 -->
            <div class="m-operation">
                <Button v-if="pageType == 'edit'" class="fr" type="primary" @click="submit('infoForm')">确认修改</Button>
                <Button v-else class="fr" type="primary" @click="submit('infoForm')">确认新增</Button>
                <Button class="fr" type="ghost" @click="$router.go(-1)">返回</Button>
                <div class="clearfix"></div>
            </div>
        </Form>
    </div>
</template>

<script>
    // 组件
    import Loading from 'components/Common/Loading'
    import SingleImage from 'components/Image/UploadImage/SingleImage'
    // 通用JS
    import Common from 'common/common.js'
    import { GetUrlQuery } from 'common/important.js'
    // 验证方法
    import Validate from 'common/validate.js'
    // 邮箱自动填充
    import EmailComplete from 'mixins/email_complete.js'
    // Api方法
    import Api from 'api/account_manage.js'
    
    export default {
        components: { Loading, SingleImage },
        mixins: [ EmailComplete ],
        data() {
            return {
                // 加载页面
                pageLoading: true,
                // 页面描述
                pageType: 'add',
                // 用户编号
                userId: '',
                // 创建时间
                createdAt: '',
                // 表单信息
                infoForm: {
                    // 用户名
                    username: '',                
                    // 真实姓名
                    realname: '',
                    // 手机号
                    mobile: '',
                    // 邮箱
                    email: '',
                    // 用户类型
                    type: 0,
                    // 创建时间
                    createTime: ''
                },
                // 验证规则
                validate: {
                    username: [
                        { required: true, message: '用户名不能为空', trigger: 'blur'},
                        { pattern: Common.regUserName, message: '用户名格式为以字母开头的6-16位字母和数字的组合', trigger: 'blur' }
                    ],
                    realname: [{ required: true, message: '真实姓名不能为空', trigger: 'blur'}],
                    type: [{
                        required: true,
                        validator: (rule, value, callback) => {
                            Validate.ValidUserType(value, callback, true);
                        },
                        trigger: 'change'
                    }],
                    mobile: [
                        { required: true, message: '手机号码不能为空', trigger: 'blur'},
                        { pattern: Common.regMobile, message: '手机号码格式不正确', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '邮箱不能为空', trigger: 'blur'},
                        { pattern: Common.regEmail, message: '邮箱格式不正确', trigger: 'change' }
                    ],
                    password: [{
                        validator: (rule, value, callback) => {
                            Validate.ValidPassword(value, callback, false);
                        },
                        trigger: 'blur'
                    }],
                    passwdCheck: [{
                        validator: (rule, value, callback) => {
                            Validate.ValidPwdCheck(this.infoForm.password, value, callback, false);
                        },
                        trigger: 'blur'
                    }]
                },
            }
        },
        created() {
            let id = GetUrlQuery('id');          
            // 判断是否是编辑页
            if(id){
                // 获取用户编号
                this.userId = id;
                this.$store.commit('SET_BREADCRUMB', [
                    { name: '账户列表', path: '/admin/AccoutnManage/List' },
                    { name: '账户详情', path: null }
                ]);
                // 获取账户详情
                this.getDetail();
                this.pageType = 'edit';
            }
            else{
                this.pageLoading = false;
                this.$store.commit('SET_BREADCRUMB', [
                    { name: '账户列表', path: '/admin/AccoutnManage/List' },
                    { name: '新增账户', path: null }
                ]);
            }
        },
        methods: {
            // 提交表单
            submit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        // 页面加载
                        this.pageLoading = true;
                        
                        if(this.pageType == 'add'){
                            // 新增用户
                            Api.AddAccount(this.infoForm)
                            .then(res => {
                                // 取消页面加载
                                this.pageLoading = false;
                                console.log(res);
                                if(res.code == 200){
                                    this.$Message.success({
                                        content: '新增账户成功!',
                                        onClose: () => {
                                            // 跳转到列表页
                                            this.$router.push({ name: 'AccoutnManage' });
                                        }
                                    }); 
                                }
                                else this.$Message.warning(res.msg);
                            })
                            .catch(err => console.log(err))
                        }
                        else{
                            // 修改账户信息
                            Api.EditAccount(this.infoForm, this.userId)
                            .then(res => {
                                // 取消页面加载
                                this.pageLoading = false;
                                if(res.code == 200){
                                    this.getDetail();
                                    this.$Message.success('账户修改成功!');
                                }
                                else this.$Message.warning(res.msg);
                            })
                            .catch(err => console.log(err))
                        }
                    }
                    else this.$Message.error('提交失败！填写有误');
                })    
            },
            // 获取账户详情
            getDetail(){
                Api.GetDetail(this.userId)
                .then(res => {
                    this.pageLoading = false;
                    if(res.code == 200){
                        this.infoForm = res.data;
                    }
                    else this.$Message.warning(res.msg);
                })
                .catch(err => console.log(err))
            },           
            // 获取并设置头像
            setFace(url){
                this.infoForm.face = url;
            }
        }
    }
</script>

<style lang="less" scoped>    
    .m-operation {
        button, a {
            min-width: 80px;
            margin-left: 10px;
        }
    }
</style>