<template>
    <div class="g-content">
        <!--  加载判断 -->
        <Loading v-if="pageLoading"></Loading>
        <div v-else>
            <Form ref="infoForm" :model="infoForm" :rules="validate" :label-width="120">
                <Form-item label="案例分类：" prop="categoryId">
                    <Select v-model="infoForm.categoryId" placeholder="请选择分类">
                        <Option v-for="(item, index) in cateList" :value="item.id" :key="index">{{ item.categoryName }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="案例标题：" prop="title">
                    <Input v-model="infoForm.title" placeholder="请输入案例标题"/>
                </Form-item>
                <Form-item label="案例封面：" prop="poster">
                    <!-- 组件-图片上传-图片裁剪 -->
                    <ImageCropper :src="infoForm.imgUrl" upload-dir="img/case/" :preview="true" :fixed="true" :fixedNumber="[90,59]" :autoCropWidth="450" :fileSize="300" size-hint="450*295px" @get-img-url="setPoster"></ImageCropper>
                </Form-item>
                <Form-item label="项目完成时间：" prop="finishedTime">
                    <DatePicker v-model="infoForm.finishedTime" type="date"  placeholder="请选择项目完成时间"></DatePicker>
                </Form-item>
                <Form-item label="负责人：" prop="projectLeader">
                    <Input v-model="infoForm.projectLeader" placeholder="请输入负责人名称"/>
                </Form-item>
                <Form-item label="关键词：">
                    <Tag v-for="(item, index) in infoForm.metaKeywords" :key="index" :name="item" closable @on-close="removeKeyword(index)">{{ item }}</Tag>
                    <Button icon="ios-add" type="dashed" size="small" @click="kwModelVisible(true)">添加关键词</Button>
                </Form-item>
                <Form-item label="页面描述：">
                    <Input v-model="infoForm.metaDescription" type="textarea" :rows="3" :maxlength="200" placeholder="请输入案例描述（不超过200个字符）"/>
                </Form-item>
                <Form-item label="案例内容：" prop="content">
                    <!-- 组件-富文本编辑器 -->
                    <tinymce v-model="infoForm.content" height="500"></tinymce>
                </Form-item>
                <!-- 操作按钮 -->
                <div class="m-operation">
                    <Button v-if="pageType == 'edit'" class="fr" type="primary" @click="submit('infoForm')">确认修改</Button>
                    <Button v-else class="fr" type="primary" @click="submit('infoForm')">确认新增</Button>
                    <Button class="fr" type="ghost" @click="$router.go(-1)">返回</Button>
                    <div class="clearfix"></div>
                </div>
            </Form>
        </div>
        <!-- 添加关键词 -->
        <Modal v-model="kwModelShow" :width="600" title="添加关键词" @on-cancel="kwModelVisible(false)">
            <div>
                <Form ref="modelForm" :model="modelForm" :rules="validate" :label-width="80">
                    <Form-item label="关键词：" prop="keyword">
                        <Input v-model="modelForm.keyword" type="textarea" placeholder="请输入关键词"/>
                    </Form-item>
                    
                    <div class="hint">* 输入的关键词请以逗号" , "进行分隔</div>
                </Form>
            </div>
            <div slot="footer">
                <Button type="text" @click="kwModelVisible(false)">取消</Button>
                <Button type="primary" @click="addKeywords('modelForm')">确认</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    // 组件
    import Loading from 'components/Common/Loading'
    import ImageCropper from 'components/Image/ImageCropper'
    //导入富文本组件
	import Tinymce from "components/Common/Tinymce.vue";
    // 通用JS
    import { GetUrlQuery, StrToArr, ArrToStr, UniqueArr, ArrRemovEmpty } from 'common/important.js'
    // Api方法
    import Api from 'api/product_service.js'
    
    export default {
        components: { Loading, ImageCropper, Tinymce },
        data() {
            return {
                // 加载页面
                pageLoading: true,
                // 页面描述
                pageType: 'add',
                // 案例id
                caseId: '',
                // 表单信息
                infoForm: {
                    // 案例分类
                    categoryId: '',
                    // 封面地址
                    imgUrl: '',
                    // 标题
                    title: '',
                    // 负责人
                    projectLeader: '',
                    // 关键词
                    metaKeywords: [],
                    // 页面描述
                    metaDescription: '',
                    // 内容
                    content: '',
                    // 项目完成时间
                    finishedTime: ''
                },
                // 验证规则
                validate: {
                    title: [{ required: true, message: '案例标题不能为空', trigger: 'blur'}],
                    content: [{ required: true, message: '案例内容不能为空', trigger: 'blur'}],
                    poster: [{ required: true, validator: (rule, value, callback) => callback() }],
                    keyword: [{ required: true, message: '关键词不能为空', trigger: 'blur'}],
                    projectLeader: [{ required: true, message: '负责人不能为空', trigger: 'blur'}],
                    categoryId: [{ required: true, validator: (rule, value, callback) => {
                        if(!this.infoForm.categoryId) callback('请选择案例分类');
                        else callback();
                    }, trigger: 'change'}],
                    finishedTime: [{ required: true, validator: (rule, value, callback) => {
                        if(!this.infoForm.finishedTime) callback('请选择项目完成时间');
                        else callback();
                    }, trigger: 'change'}]
                },
                // 显示关键词对话框
                kwModelShow: false,
                // 弹窗表单
                modelForm: {
                    keyword: ''
                },
                // 分类列表
                cateList: []
            }
        },
        created() {
            // 获取分类列表
            this.getCateList();
            let id = GetUrlQuery('id');
            // 判断是否是编辑页
            if(id){
                // 获取用户编号
                this.caseId = id;
                this.$store.commit('SET_BREADCRUMB', [
                    { name: '案例管理', path: null },
                    { name: '案列列表', path: '/admin/CaseManage/List' },
                    { name: '案例详情', path: '' }
                ]);
                // 获取案例详情
                this.getDetail();
                this.pageType = 'edit';
            }
            else{
                this.pageLoading = false;
                this.$store.commit('SET_BREADCRUMB', [
                    { name: '案例管理', path: null },
                    { name: '案列列表', path: '/admin/CaseManage/List' },
                    { name: '新增案例', path: '' }
                ]);
            }
        },
        methods: {
            // 保存案例
            submit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        if(this.infoForm.imgUrl == ''){
                            this.$Message.error('请上传案例封面');
                            return false;
                        }
                        // 页面加载
                        this.pageLoading = true;

                        this.infoForm.metaKeywords = ArrToStr(this.infoForm.metaKeywords, ',');
                        
                        if(this.pageType == 'add'){
                            // 新增
                            Api.AddCase(this.infoForm)
                            .then(res => {
                                // 取消页面加载
                                this.pageLoading = false;
                                if(res.code == 200){
                                    this.$Message.success({
                                        content: '新增成功',
                                        onClose: () => {
                                            // 跳转到列表页
                                            this.$router.push({ name: 'CaseList' });
                                        }
                                    }); 
                                }
                                else this.$Message.warning(res.msg);
                            })
                            .catch(err => this.$Message.error(err.message))
                        }
                        else{
                            // 修改
                            Api.EditCase(this.infoForm, this.caseId)
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
                    }
                    else this.$Message.error('提交失败！填写有误');
                })    
            },
            // 获取分类列表
            getCateList(){
                Api.GetCateList(this.caseId)
                .then(res => {                                  
                    if(res.code == 200){
                        this.cateList = res.data;
                    }
                    else this.$Message.warning(res.msg);
                })
                .catch(err => console.log(err))
            },
            // 获取案例详情
            getDetail(){
                Api.GetCaseDetail(this.caseId)
                .then(res => {                    
                    // 取消页面加载
                    this.pageLoading = false;                                       
                    if(res.code == 200){
                        // 设置数据
                        this.infoForm = res.data;
                        this.infoForm.metaKeywords = res.data.metaKeywords ? StrToArr(res.data.metaKeywords, ',') : [];
                    }
                    else this.$Message.warning(res.msg);
                })
                .catch(err => console.log(err))
            },
            // 获取并设置封面
            setPoster(url){
                this.infoForm.imgUrl = url;
            },
            // 添加关键词对话框显示状态
            kwModelVisible(val){
                this.kwModelShow = val;
                if(!val) this.modelForm.keyword = '';
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
                        let str = this.modelForm.keyword.replace(/\s*/g,"");

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
</script>

<style lang="less">
    @import "../../assets/less/color";

    .m-operation {
        button, a {
            min-width: 80px;
            margin-left: 10px;
        }
    }

    .hint{
        margin-top: 20px;
    }
</style>