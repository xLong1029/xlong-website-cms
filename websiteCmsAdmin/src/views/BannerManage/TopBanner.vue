<template>
    <div class="g-content">
        <!-- 操作按钮 -->
        <div class="m-operation">
            <Button class="operation-btn" :disabled="selectList.length == 0" type="primary" @click="enableOrDisable(1)">启用</Button>
            <Button class="operation-btn" :disabled="selectList.length == 0" type="warning" @click="enableOrDisable(-1)">禁用</Button>
        </div>
        <!-- 内容列表 -->
        <EditableTable
          :title="title"
          :data="listData"
          @on-save="saveThis"
          @on-select="getSelectRowData"
          @on-all-select="getSelectRowData"
        />
        <div class="clearfix"></div>
    </div>
</template>

<script>
    // 组件
    import EditableTable from 'components/Table/EditableTable'
    // 通用JS
    import { SetDefaultPic } from "utils/index.js";
    // Api方法
    import Api from 'api/banner_manage.js'
    // 表格查询
    import TableQuery from 'mixins/table_query.js'
    // 表格操作
    import TableOperate from 'mixins/table_operate.js'
    // Vuex
    import { mapGetters } from 'vuex'

    export default {
        components: { EditableTable },
        mixins: [ TableQuery, TableOperate ],
        computed: {
            ...mapGetters([ 'getImageUrl' ]),
            // 获取所有列表
            apiGetList(){
                return () => Api.GetBannerList({ type: 2 });
            },
            // 编辑操作接口
            apiEdit(){
                return () => Api.EditBanner(this.paramsForm, this.editId);
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
                        title: '板块名称',
                        key: 'sectionName',
                        align: 'center',
                        type: 'Text',
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
                        equired: true,
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
                        button: [
                          {
                            type: "primary",
                            size: "small",
                            minWidth: "64",
                            text: "保存",
                            click: "save"
                          }
                        ],
                        width: 100,
                    },
                ],
                // 表格信息
                listData: [],
                // 参数表单
                paramsForm: {
                    // 顶部Banner
                    type: 2,
                    // 默认新页面跳转
                    target: 2
                },
                // 编辑id
                editId: 0,
                // 验证规则
                modelValidate: {
                    imgUrl:[{ required: true, validator: (rule, value, callback) => callback() }],
                    target:[{ required: true, validator: (rule, value, callback) => callback() }],
                },
            }
        },
        created(){
            // 设置面包屑路径
            this.$store.commit('common/SET_BREADCRUMB', [
                { name: 'Banner管理', path: null },
                { name: '页面顶部Banner', path: null }
            ]);
            // 获取内容列表
            this.getTableList();
            // 初始化表格内容
            this.initData(this.listData);
        },
        methods: {
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
            saveThis(row){
                if(row.imgUrl){
                    this.editId = row.id;
                    this.paramsForm.type = row.type;
                    this.paramsForm.sectionType = row.sectionType;
                    this.paramsForm.title = row.title;
                    this.paramsForm.linkUrl = row.linkUrl;
                    this.paramsForm.target = row.target;
                    // 编辑数据
                    this.editData();
                }
                else{
                    this.$Message.error('提交失败！请上传Banner图片');
                }
            },
            // 获取选中行数据
            getSelectRowData(list){
              list.forEach(e => this.selectList.push(e.id));
            },
            // 编辑数据
            editData(){
                this.apiEdit().then(res => {
                    this.pageLoading = false;
                    if(res.code == 200){
                        this.$Message.success('编辑成功');
                        // 更新列表
                        this.updateList();
                        // 清空选项列表
                        this.clearSelect();
                    }
                    else this.$Message.warning(res.msg);
                }).catch(() => this.$Message.error('编辑失败'))
            },
            // 无法显示图片
            notFoundPic(event){
                SetDefaultPic(event, 2);
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../../assets/less/table_list";
    @import "../../assets/less/edit_table";
</style>
