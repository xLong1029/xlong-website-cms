<template>
    <div class="g-content">
        <!-- 操作按钮 -->
        <div class="m-operation">
            <Button class="operation-btn" type="primary" @click="storeModalVisible(true, 'add')">新增</Button>
            <Button class="operation-btn" type="warning" :disabled="selectList.length == 0" @click="deleteData">删除</Button>
            <Button class="operation-btn" :disabled="selectList.length == 0" type="primary" @click="enableOrDisable(1)">启用</Button>
            <Button class="operation-btn" :disabled="selectList.length == 0" type="warning" @click="enableOrDisable(-1)">禁用</Button>
        </div>
        <!-- 内容列表 -->
        <table ref="contTable" class="m-table" width="100%" cellpadding="0" cellspacing="0">
            <!-- 表头名称 -->
            <th v-for="(item, index) in title" :key="index" :align="item.align" :style="{ 'width' : item.width + 'px'}">
                <Checkbox v-if="item.type == 'CheckBox'" v-model="checkAll" @on-change="selectAll(checkAll)"></Checkbox>
                <div v-else>
                    <span v-if="item.required"><i class="required-hint">*</i>{{ item.title }}</span>
                    <span v-else>{{ item.title }}</span>            
                </div>
            </th>
            <!-- 表格内容 -->
            <tr v-for="(item, index) in listData" :key="index" :class="item.isDisable == 1 ? 'tr-disable' : ''">
                <td v-for="(th, i) in title" :key="i" :align="th.align">
                    <!-- 勾选框 -->
                    <Checkbox v-if="th.type == 'CheckBox'" v-model="item.isCheck" @on-change="selectRow(index, item.isCheck)"></Checkbox>
                    <!-- 显示文本 -->
                    <span v-if="th.type == 'Text'">
                        <span v-if="th.key == 'isDisable' && item[th.key] == 0" class="status-success">启用</span>
                        <span v-else-if="th.key == 'isDisable' && item[th.key] == 1" class="status-fail">禁用</span>
                        <span v-else-if="th.key == 'target' && item[th.key] == 1">当前页打开</span>
                        <span v-else-if="th.key == 'target' && item[th.key] == 2">新页面跳转</span>
                        <span v-else>{{ item[th.key] }}</span>
                    </span>
                    <!-- 输入框 -->
                    <Input v-if="th.type == 'Input'" v-model="item[th.key]" placeholder="清输入内容"/>
                    <!-- 图片上传 -->
                    <div v-if="th.type == 'UploadImg'">
                        <!-- 组件-图片上传-单图片显示 -->
                        <SingleImage :src="item[th.key]" upload-dir="img/banner/" :preview="true" :show-hint="false" :file-size="350" @get-img-url="setBanner"></SingleImage>
                    </div>
                    <!-- 操作按钮 -->
                    <div v-if="th.type == 'Button'">
                        <Button
                            :type="th.button.type"
                            :size="th.button.size"
                            :style="{ 'min-width' : th.button.minWidth + 'px' }"
                            @click="saveThis(index)"
                        >
                        {{ th.button.text }}
                        </Button>
                    </div>
                </td>
            </tr>
        </table>
        <!-- 分页 -->
        <Page
            class-name="m-page"
            show-elevator
            show-sizer
            show-total
            :total="page.dataCount"
            :page-size="page.pageSize"
            :current="page.pageNo"
            :page-size-opts="page.pageSizeOpts"
            @on-change="changePage"
            @on-page-size-change="changePageSize"
        >
        </Page>
        <div class="clearfix"></div>
        <!-- 存储弹窗 -->
        <Modal v-model="storeModel.show" :width="600" :title="storeModel.title" @on-cancel="storeModalVisible(false)">
            <div>
                <Form ref="modelForm" :model="modelForm" :rules="modelValidate" :label-width="100">
                    <Form-item label="图片标题：" prop="title">
                        <Input v-model="modelForm.title" placeholder="请输入图片标题（鼠标移至图片位置时显示）"/>
                    </Form-item>
                    <Form-item label="Banner：" prop="imgUrl">
                        <!-- 组件-图片上传-单图片显示 -->
                        <SingleImage :src="modelForm.imgUrl? modelForm.imgUrl : ''" upload-dir="img/banner/" size-hint="1905*680px" :file-size="350" @get-img-url="setBanner"></SingleImage>
                    </Form-item>
                    <Form-item label="跳转链接：">
                        <Input v-model="modelForm.linkUrl" placeholder="请输入跳转链接"/>
                    </Form-item>
                    <Form-item label="跳转类型：">
                        <Radio-group v-model="modelForm.target">
                            <Radio :label="1">当前页打开</Radio>
                            <Radio :label="2">新页面跳转</Radio>
                        </Radio-group>
                    </Form-item>
                </Form>
            </div>
            <div slot="footer">
                <Button type="text" @click="storeModalVisible(false)">取消</Button>
                <Button type="primary" @click="storeData('modelForm')">确认</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    // 组件
    import SingleImage from 'components/Image/UploadImage/SingleImage'
    // 通用JS
    import Common from 'common/common.js'
    import { GetUrlQuery } from 'common/important.js'
    // Api方法
    import Api from 'api/banner_manage.js'
    // 表格查询
    import TableQuery from 'mixins/table_query.js'
    // 表格操作
    import TableOperate from 'mixins/table_operate.js'
    // 存储弹窗
    import StoreModel from 'mixins/store_model.js'
    // 页码设置
    import Page from 'mixins/page.js'
      
    export default {
        components: { SingleImage },
        mixins: [ TableQuery, TableOperate, Page, StoreModel ],
        computed: {
            // 获取所有列表
            apiGetList(){
                return () => Api.GetBannerList({
                    type: 1,
                    pageNo: this.page.pageNo,
                    pageSize: this.page.pageSize
                });
            },
            // 新增操作接口
            apiAdd(){
                return () => Api.AddBanner(this.modelForm);
            },
            // 删除操作接口
            apiDelete(){
                return () => Api.DelBanner(this.selectList);
            },
            // 编辑操作接口
            apiEdit(){
                return () => Api.EditBanner(this.modelForm, this.editId);
            },
            // 启用操作接口
            apiEnable(){
                return () => Api.SetEnable(1, this.selectList);
            },
            // 禁用操作接口
            apiDisable(){
                return () => Api.SetEnable(2, this.selectList);
            }
        },
        data(){
            return{
                //选中所有项
                checkAll: false,
                // 表格表头
                title: [
                    {
                        title: '全选',
                        key: 'selecAll',
                        align: 'center',
                        type: 'CheckBox',
                        width: 60
                    },
                    {
                        title: '编号',
                        key: 'id',
                        align: 'center',
                        type: 'Text',
                        width: 60
                    },
                    {
                        title: '图片标题',
                        key: 'title',
                        align: 'center',
                        type: 'Input'
                    },
                    {
                        title: 'Banner图片',
                        key: 'imgUrl',
                        align: 'center',
                        type: 'UploadImg',
                        required: true,
                        width: 250
                    },
                    {
                        title: '跳转链接',
                        key: 'linkUrl',
                        align: 'center',
                        type: 'Input'
                    },
                    {
                        title: '跳转类型',
                        key: 'target',
                        align: 'center',
                        type: 'Text'
                    },
                    {
                        title: '状态',
                        key: 'isDisable',
                        align: 'center',
                        type: 'Text'
                    },
                    {
                        title: '操作',
                        key: 'operate',
                        align: 'center',
                        type: 'Button',
                        button: {
                            type: 'primary',
                            size: 'small',
                            minWidth: '64',
                            text: '保存'
                        },
                        width: 100,
                    },
                ],
                // 表格信息
                listData: [],
                // 弹窗表单
                modelForm: {
                    // 首页Banner
                    type: 1,
                    // 板块类型
                    sectionType: 1,
                    // 默认新页面跳转
                    target: 2
                },
                // 验证规则
                modelValidate: {
                    imgUrl:[{ required: true, validator: (rule, value, callback) => callback() }],
                    target:[{ required: true, validator: (rule, value, callback) => callback() }],
                },
            }
        },
        created(){
            // 设置面包屑路径
            this.$store.commit('SET_BREADCRUMB', [
                { name: 'Banner管理', path: null },
                { name: '首页Banner', path: null }
            ]);
            // 获取内容列表
            this.getTableList();
            // 初始化表格内容
            this.initData(this.listData);
        },
        methods: {
            // 全选
            selectAll(check){
                this.listData.forEach(item => {                    
                    if(check){
                        item.isCheck = true;
                        // 设置选项列表
                        this.selectList.push(item.id);
                    }
                    else{
                        item.isCheck = false;
                        // 清空选项列表
                        this.clearSelect();
                    }
                })
            },
            // 选中一行
            selectRow(index, check){
                if(check){
                    this.selectList.push(this.listData[index].id);
                }
                else{
                    this.selectList.forEach((item, i) => {           
                        if(item == this.listData[index].id) this.selectList.splice(i,1);
                    })
                }
            },
            // 初始化表格内容
            initData(data){
                // 初始化，给data添加isCheck属性，默认值为false
                if(data.length > 0){
                    data.forEach(item => {
                        item.isCheck = false;
                    })
                }
            },
            // 保存数据
            saveThis(index){
                if(this.modelForm.imgUrl){
                    const row = this.listData[index];
                    this.editId = row.id;
                    this.modelForm.type = row.type;
                    this.modelForm.sectionType = row.sectionType;
                    this.modelForm.title = row.title;
                    this.modelForm.linkUrl = row.linkUrl;
                    this.modelForm.target = row.target;
                    // 编辑数据
                    this.editData();
                }
                else{
                    this.$Message.error('提交失败！请上传Banner图片');
                }
            },
            // 设置新增Banner
            setBanner(url){
                this.modelForm.imgUrl = url;
            },
            // 弹窗可见性
            storeModalVisible(val, type){
                this.storeModel.show = val;
                this.storeType = type;
                if(type == 'add'){
                    this.storeModel.title = '新增内容';
                    this.$refs['modelForm'].resetFields();
                    // 重置表单
                    this.modelForm = {
                        type: 1,
                        sectionType: 1,
                        target: 2
                    }
                }
                else{
                    this.storeModel.title = '编辑内容';
                }
            },
            // 清空选项
            clearSelect(){
                this.selectList = [];
                this.checkAll = false;
            },
            // 无法显示图片
            notFoundPic(event){
                Common.SetDefaultPic(event, 2);
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../../assets/less/table_list";
    @import "../../assets/less/edit_table";
</style>