<template>
    <div class="g-content">
        <!--  加载判断 -->
        <Loading v-if="pageLoading"></Loading>
        <Form v-else ref="infoForm" :model="infoForm" :rules="validate" :label-width="120">
            <Row>
                <Col span="12">
                    <Form-item label="网站LOGO：" prop="logo">
                        <!-- 组件-图片上传-单图片显示 -->
                        <SingleImage :src="infoForm.logo" upload-dir="img/logo/" :preview="true" size-hint="220*72px" :fileSize="180" @get-img-url="setPic"></SingleImage>
                    </Form-item>
                    <Form-item label="公司名称：" prop="companyName">
                        <Input v-model="infoForm.companyName" placeholder="请输入公司名称"/>
                    </Form-item>
                    <Form-item label="备案信息：" prop="webRecordInfo">
                        <Input v-model="infoForm.webRecordInfo" placeholder="请输入备案信息"/>
                    </Form-item>
                    <Form-item label="站点地址：" prop="website">
                        <Input v-model="infoForm.website" placeholder="请输入站点地址"/>
                    </Form-item>
                    <Form-item label="站点关键词：" prop="metaKeywords">
                        <Tag v-for="(item, index) in infoForm.metaKeywords" :key="index" :name="item" closable @on-close="removeKeyword(index)">{{ item }}</Tag>
                    <Button icon="ios-add" type="dashed" size="small" @click="kwModelVisible(true)">添加关键词</Button>
                    </Form-item>
                    <Form-item label="站点描述：">
                        <Input v-model="infoForm.metaDescription" type="textarea" :rows="4" placeholder="请输入站点描述"/>
                    </Form-item>
                    <!-- 操作按钮 -->
                    <Form-item>
                        <Button type="primary" @click="submit('infoForm')">确认修改</Button>
                    </Form-item>
                </Col>
            </Row>
        </Form>
        <!-- 添加关键词 -->
        <Modal v-model="kwModelShow" :width="600" title="添加关键词" @on-cancel="kwModelVisible(false)">
            <div>
                <Form ref="kwModelForm" :model="kwModelForm" :rules="validate" :label-width="80">
                    <Form-item label="关键词：" prop="keyword">
                        <Input v-model="kwModelForm.keyword" type="textarea" placeholder="请输入关键词"/>
                    </Form-item>
                    <div class="hint">* 输入的关键词请以逗号" , "进行分隔</div>
                </Form>
            </div>
            <div slot="footer">
                <Button type="text" @click="kwModelVisible(false)">取消</Button>
                <Button type="primary" @click="addKeywords('kwModelForm')">确认</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    // 组件
    import Loading from 'components/Common/Loading'
    import SingleImage from 'components/Image/UploadImage/SingleImage'
    // 通用JS
    import { StrToArr, ArrToStr } from 'utils'
    // 关键词设置
    import KeywordModel from 'mixins/keyword_model.js'
    // Api方法
    import Api from 'api/common.js'

    export default {
        components: { Loading, SingleImage },
        mixins: [  KeywordModel ],
        data(){
            return{
                // 加载页面
                pageLoading: false,
                // 表单信息
                infoForm: {
                    // 网站LOGO
                    logo: '',
                    // 备案信息
                    webRecordInfo: '',
                    // 公司名称
                    companyName: '',
                    // 站点链接
                    website: '',
                    // 关键词
                    metaKeywords: '',
                    // 描述内容
                    metaDescription: ''
                },
                // 验证规则
                validate: {
                    logo: [{ required: true, validator: (rule, value, callback) => callback() }],
                    companyName: [{ required: true, message: '公司名称不能为空', trigger: 'blur'}],
                    webRecordInfo: [{ required: true, message: '备案信息不能为空', trigger: 'blur'}],
                    website: [{ required: true, message: '站点地址不能为空', trigger: 'blur'}],
                    keyword: [{ required: true, message: '关键词不能为空', trigger: 'blur'}]
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
                this.$store.commit('SET_BREADCRUMB',  [
                    { name: '站点管理', path: null },
                    { name: '站点信息', path: null }
                ]);
                this.getDetail();
            },
            // 保存
            submit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        if(this.infoForm.logo == ''){
                            this.$Message.error('请上传网站LOGO');
                            return false;
                        }
                        // 页面加载
                        this.pageLoading = true;

                        this.infoForm.metaKeywords = ArrToStr(this.infoForm.metaKeywords, ',');

                        // 修改
                        Api.EditSiteInfo(this.infoForm)
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
                Api.GetSiteInfo()
                .then(res => {
                    // 取消页面加载
                    this.pageLoading = false;
                    if(res.code == 200){
                        // 设置数据
                        this.infoForm = res.data;
                        this.infoForm.metaKeywords = res.data.metaKeywords ? StrToArr(res.data.metaKeywords, ',') : [];
                        this.$store.commit('SET_SITE_INFO', this.infoForm);
                    }
                    else this.$Message.warning(res.msg);
                })
                .catch(err => console.log(err))
            },
            // 设置图片
            setPic(url){
                this.infoForm.logo = url;
            }
        }
    }
</script>
