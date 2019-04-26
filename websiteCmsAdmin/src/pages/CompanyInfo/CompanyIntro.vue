<template>
    <div class="g-content">
        <!--  加载判断 -->
        <Loading v-if="pageLoading"></Loading>
        <div v-else>
            <Form ref="infoForm" :model="infoForm" :rules="validate" :label-width="180">
                <Form-item label="公司图片（用于首页）：" prop="companyImg">
                    <!-- 组件-图片上传-图片裁剪 -->
                    <ImageCropper :src="infoForm.companyImg" upload-dir="img/company/" :preview="true" :fileSize="150" size-hint="570*250px" @get-img-url="setPoster"></ImageCropper>
                </Form-item>
                <Form-item label="公司简介（用于首页）：" prop="companyIntro">
                    <Input v-model="infoForm.companyIntro" type="textarea" :rows="3" placeholder="请输入公司简介"/>
                </Form-item>
                <Form-item label="公司介绍：" prop="companyContent">
                    <!-- 组件-富文本编辑器 -->
                    <tinymce v-model="infoForm.companyContent" height="500"></tinymce>
                </Form-item>
                <!-- 操作按钮 -->
                <div class="m-operation">
                    <Button class="fr" type="primary" @click="submit('infoForm')">确认修改</Button>
                </div>
                <div class="clearfix"></div>
            </Form>
        </div>
    </div>
</template>

<script>
    // 组件
    import Loading from 'components/Common/Loading'
    import ImageCropper from 'components/Image/ImageCropper'
    import Tinymce from 'components/Common/Tinymce'
    // Api方法
    import Api from 'api/company_info.js'

    export default {
        components: { Loading, ImageCropper, Tinymce },
        data(){
            return{
                // 加载页面
                pageLoading: true,
                // 表单信息
                infoForm: {
                    // 封面地址
                    companyImg: '',
                    // 简介
                    companyIntro: '',
                    // 内容
                    companyContent: ''
                },
                // 验证规则
                validate: {
                    companyIntro: [{ required: true, message: '公司简介不能为空', trigger: 'blur'}],
                    companyImg: [{ required: true, validator: (rule, value, callback) => callback() }]
                },
            }
        },
        created(){
            this.init();
        },
        methods: {
            // 初始化页面
            init(){
                // 设置面包屑路径
                this.$store.commit('SET_BREADCRUMB', [
                    { name: '公司信息', path: null },
                    { name: '公司介绍', path: null }
                ]);
                this.getDetail();
            },
            // 保存
            submit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        if(this.infoForm.companyImg == ''){
                            this.$Message.error('请上传公司图片');
                            return false;
                        }
                        // 页面加载
                        this.pageLoading = true;
                        
                        // 修改
                        Api.EditCompanyIntro(this.infoForm)
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
                Api.GetCompanyIntro()
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
            // 获取并设置封面
            setPoster(url){
                this.infoForm.companyImg = url;
            },
        },
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
