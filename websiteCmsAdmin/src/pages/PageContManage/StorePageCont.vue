<template>
    <div class="g-content">
        <!--  加载判断 -->
        <Loading v-if="pageLoading"></Loading>
        <div v-else>
            <Form ref="infoForm" :model="infoForm" :rules="validate" :label-width="120">
                <Form-item label="页面地址：">
                    <a :href="website + '/page/' + infoForm.name" target="_blank">{{ '/page/' + infoForm.name }}</a>
                </Form-item>
                <Form-item label="页面标题：" prop="title">
                    <Input v-model="infoForm.title" placeholder="请输入页面标题"/>
                </Form-item>
                <Form-item label="是否显示标题：" prop="showTitle">
                    <Radio-group v-model="infoForm.showTitle">
                            <Radio :label="1">是</Radio>
                            <Radio :label="0">否</Radio>
                        </Radio-group>
                </Form-item>
                <Form-item label="关键词：">
                    <Tag v-for="(item, index) in infoForm.metaKeywords" :key="index" :name="item" closable @on-close="removeKeyword(index)">{{ item }}</Tag>
                    <Button icon="ios-add" type="dashed" size="small" @click="kwModelVisible(true)">添加关键词</Button>
                </Form-item>
                <Form-item label="页面描述：">
                    <Input v-model="infoForm.metaDescription" type="textarea" :rows="3" :maxlength="200" placeholder="请输入页面描述（不超过200个字符）"/>
                </Form-item>
                <Form-item label="页面内容：">
                    <!-- 组件-富文本编辑器 -->
                    <Tinymce v-model="infoForm.content" placeholder="请输入页面内容" height="500" />
                </Form-item>
                <!-- 操作按钮 -->
                <div class="m-operation">
                    <Button class="fr" type="primary" @click="submit('infoForm')">确认修改</Button>
                    <Button class="fr" type="ghost" @click="$router.go(-1)">返回</Button>
                    <div class="clearfix"></div>
                </div>
            </Form>
        </div>
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
    import ImageCropper from 'components/Image/ImageCropper'
    import Tinymce from 'components/Common/Tinymce'
    // 通用JS
    import { GetUrlQuery, StrToArr, ArrToStr } from 'common/important.js'
    // 关键词设置
    import KeywordModel from 'mixins/keyword_model.js'
    // Api方法
    import Api from 'api/pagecont_manage.js'
    
    export default {
        components: { Loading, ImageCropper, Tinymce },
        mixins: [  KeywordModel ],
        data() {
            return {
                // 加载页面
                pageLoading: true,
                // 地址配置
                website: '',
                // 页面id
                articleId: '',
                // 表单信息
                infoForm: {
                    // 页面名称
                    name: '',
                    // 标题
                    title: '',
                    // 关键词
                    metaKeywords: [],
                    // 页面描述
                    metaDescription: '',
                    // 内容
                    content: '',
                },
                // 验证规则
                validate: {
                    title: [{ required: true, message: '标题不能为空', trigger: 'blur'}],
                    keyword: [{ required: true, message: '关键词不能为空', trigger: 'blur'}],
                    showTitle: [{ required: true, 
                        validator: (rule, value, callback) => {
                            if(this.infoForm.showTitle === '' || this.infoForm.showTitle === null || this.infoForm.showTitle === undefined) callback('请选择是否显示标题');
                            else callback();
                        },
                    trigger: 'change'}]
                }
            }
        },
        created() {
            let id = GetUrlQuery('id');
            // 获取用户编号
            this.articleId = id;
            this.$store.commit('SET_BREADCRUMB', [
                { name: '单页面管理', path: '/admin/PageContManage/List' },
                { name: '页面内容', path: '' }
            ]);
            // 获取页面详情
            this.getDetail();

            // 地址配置
            const debug = process.env.NODE_ENV !== 'production';
            // 测试环境
            if (debug) {
                this.website = 'http://127.0.0.1:6060';
            }
        },
        methods: {
            // 保存页面
            submit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        // 页面加载
                        this.pageLoading = true;

                        this.infoForm.metaKeywords = ArrToStr(this.infoForm.metaKeywords, ',');
                        
                        // 修改
                        Api.EditPageCont(this.infoForm, this.articleId)
                        .then(res => {
                            // 取消页面加载
                            this.pageLoading = false;
                            if(res.code == 200){
                                this.$Message.success('修改成功');
                                this.getDetail();
                            }
                            else this.$Message.warning(res.msg);
                        })
                        .catch(err => console.log(err));
                    }
                    else this.$Message.error('提交失败！填写有误');
                })    
            },
            // 获取页面详情
            getDetail(){
                Api.GetDetail(this.articleId)
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

    .hint{
        margin-top: 20px;
    }
</style>