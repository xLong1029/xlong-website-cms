<template>
    <div class="g-content">
        <!--  加载判断 -->
        <Loading v-if="pageLoading"></Loading>
        <Form v-else ref="infoForm" :model="infoForm" :rules="validate" :label-width="150">
            <Row>
                <i-col span="12">
                    <Form-item label="二维码图片：" prop="qrcodeImg">
                        <!-- 组件-图片上传-单图片显示 -->
                        <SingleImage :src="infoForm.qrcodeImg" upload-dir="img/qrcode/" :preview="true" size-hint="100*100px" :fileSize="180" @get-img-url="setPic"></SingleImage>
                    </Form-item>
                    <Form-item label="热线电话 / 邮箱：" prop="contactWay">
                        <Input v-model="infoForm.contactWay" placeholder="请输入联系方式"/>
                    </Form-item>
                    <Form-item label="公司地址：" prop="companyAddr">
                        <Input v-model="infoForm.companyAddr" placeholder="请输入公司地址"/>
                    </Form-item>
                    <!-- 操作按钮 -->
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
    // Api方法
    import Api from 'api/common.js'

    export default {
        components: { Loading, SingleImage },
        data(){
            return{
                // 加载页面
                pageLoading: false,
                // 表单信息
                infoForm: {
                    // 网站LOGO
                    qrcodeImg: '',
                    // 备案信息
                    companyAddr: '',
                    // 公司名称
                    contactWay: '',
                },
                // 验证规则
                validate: {
                    qrcodeImg: [{ required: true, validator: (rule, value, callback) => callback() }],
                    contactWay: [{ required: true, message: '联系方式不能为空', trigger: 'blur'}],
                    companyAddr: [{ required: true, message: '公司地址不能为空', trigger: 'blur'}]
                },
                // 显示关键词对话框
                kwModelShow: false,
                // 弹窗表单
                modelForm: {
                    keyword: ''
                }    
            }
        },
        created(){
            this.init();
        },
        methods: {
            // 初始化页面
            init(){
                // 设置面包屑路径
                this.$store.commit('common/SET_BREADCRUMB',  [
                    { name: '站点管理', path: null },
                    { name: '底部信息', path: null }
                ]);
                this.getDetail();
            },
            // 保存
            submit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        if(this.infoForm.qrcodeImg == ''){
                            this.$Message.error('请上传二维码图片');
                            return false;
                        }
                        // 页面加载
                        this.pageLoading = true;
                        
                        // 修改
                        Api.EditFooterInfo(this.infoForm)
                        .then(res => {
                            // 取消页面加载
                            this.pageLoading = false;
                            if(res.code == 200){
                                this.$Message.success('修改成功');
                                this.getDetail();
                            }
                            else this.$Message.warning(res.msg);
                        })
                        .catch(err => console.log(err))
                    }
                    else this.$Message.error('提交失败！填写有误');
                })    
            },
            // 获取信息
            getDetail(){
                Api.GetFooterInfo()
                .then(res => {                    
                    // 取消页面加载
                    this.pageLoading = false;
                    if(res.code == 200){
                        // 设置数据
                        this.infoForm = res.data;
                    }
                    else this.$Message.warning(res.msg);
                })
                .catch(err => console.log(err))
            },
            // 设置图片
            setPic(url){
                this.infoForm.qrcodeImg = url;
            }
        },
    }
</script>