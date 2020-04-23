<template>
    <div class="g-content">
        <!-- 按条件查询 -->
        <div class="m-query-form">
            <Form ref="queryForm" :model="queryForm" :rules="validate">
                <Form-item class="query-item">
                    <Input v-model="queryForm.id" placeholder="编号"/>
                </Form-item>
                <Form-item class="query-item" prop="name">
                    <Input v-model="queryForm.name" placeholder="链接名称"/>
                </Form-item>
                <Form-item class="fl" prop="date">
                    <Date-picker class="query-item" type="date" v-model="queryForm.sTime" placement="bottom-end" placeholder="创建日期-起始" @on-change="getStartDate"></Date-picker>
                    <Date-picker class="query-item" type="date" v-model="queryForm.eTime" placement="bottom-end" placeholder="创建日期-结束" @on-change="getEndDate"></Date-picker>
                    <div class="clearfix"></div>
                </Form-item>
                <Form-item class="query-item">
                    <Select v-model="queryForm.target" placeholder="跳转类型">
                        <Option value="">全部</Option>
                        <Option value="1">当前页打开</Option>
                        <Option value="2">新页面跳转</Option>
                    </Select>
                </Form-item>
                <Form-item class="query-item">
                    <Select v-model="queryForm.enabledState" placeholder="链接状态">
                        <Option value="">全部</Option>
                        <Option value="1">启用</Option>
                        <Option value="2">禁用</Option>
                    </Select>
                </Form-item>
                <Form-item class="fl">
                    <Button class="query-button" type="primary" @click="query('queryForm', 'valid')">查询</Button>
                    <Button class="query-button" type="default" @click="resetQuery('queryForm')">重置</Button>
                </Form-item>
            </Form>
            <div class="clearfix"></div>
        </div>
        <!-- 操作按钮 -->
        <div class="m-operation">
            <Button class="operation-btn" type="primary" @click="storeModalVisible(true, 'add')">新增</Button>
            <Button class="operation-btn" :disabled="selectList.length == 0" type="warning" @click="deleteData">删除</Button>
            <Button class="operation-btn" :disabled="selectList.length == 0" type="primary" @click="enableOrDisable(1)">启用</Button>
            <Button class="operation-btn" :disabled="selectList.length == 0" type="warning" @click="enableOrDisable(-1)">禁用</Button>
            <div class="clearfix"></div>
        </div>
        <!--  加载判断 -->
        <Loading v-if="pageLoading"></Loading>
        <div v-else>            
            <!-- 信息列表 -->
            <Table
                :row-class-name="rowClassName"
                class="m-table-list"
                border
                :columns="dataList"
                :data="listData"
                @on-selection-change="setSelectList"
            ></Table>
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
        </div>
        <!-- 存储弹窗 -->
        <Modal v-model="storeModel.show" :title="storeModel.title" @on-cancel="storeModalVisible(false)">
            <div>
                <Form ref="modelForm" :model="modelForm" :rules="modelValidate" :label-width="100">
                    <Form-item label="链接名称：" prop="name">
                        <Input v-model="modelForm.name" placeholder="请输入链接名称"/>
                    </Form-item>
                    <Form-item label="地址：" prop="linkUrl">
                        <Input v-model="modelForm.linkUrl" placeholder="请输入链接地址"/>
                    </Form-item>
                    <Form-item label="链接描述：" prop="title">
                        <Input v-model="modelForm.title" placeholder="请输入链接描述（鼠标移至链接位置时显示）"/>
                    </Form-item>
                    <Form-item label="跳转类型：" prop="target">
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
    import Loading from '@/components/Common/Loading'
    // 通用JS
    import Common from 'common/common.js'
    // 验证方法
    import Validate from 'utils/validate.js'
    // Api方法
    import Api from '@/api/site_manage.js'
    // 表格设置
    import tableSetting from 'utils/table_setting.js'
    // 表格查询
    import TableQuery from 'mixins/table_query.js'
    // 表格操作
    import TableOperate from 'mixins/table_operate.js'
    // 存储弹窗
    import StoreModel from 'mixins/store_model.js'
    // 页码设置
    import Page from 'mixins/page.js'

    export default {
        components: { Loading },
        mixins: [ TableQuery, TableOperate, Page, StoreModel ],
        computed: {
            // 获取所有列表
            apiGetList(){
                return () => Api.GetFLinkList(this.queryForm);
            },
            // 删除操作接口
            apiDelete(){
                return () => Api.DelFLink(this.selectList);
            },
            // 启用操作接口
            apiEnable(){
                return () => Api.SetEnableFLink(1, this.selectList);
            },
            // 禁用操作接口
            apiDisable(){
                return () => Api.SetEnableFLink(2, this.selectList);
            },
            // 新增操作接口
            apiAdd(){
                return () => Api.AddFLink(this.modelForm);
            },
            // 编辑操作接口
            apiEdit(){
                return () => Api.EditFLink(this.modelForm, this.editId);
            }
        },
        data(){
            return{
                // 加载页面
                pageLoading: false,
                // 查询表单
                queryForm: {
                    // 编号
                    id: '',
                    // 链接名称
                    title: '',
                    // 起始时间
                    sTime: '',
                    // 结束时间
                    eTime: '',
                    // 状态
                    enabledState: '',
                    // 跳转类型
                    target: ''
                },
                // 验证规则
                validate: {
                    date:[{
                        validator: (rule, value, callback) => {
                            Validate.ValidRangeDate(this.queryForm.sTime, this.queryForm.eTime, callback, false);
                        },
                        trigger: 'change',
                    }]
                },
                // 数据列表
                dataList:[
                    {
                        title: '全选',
                        type: 'selection',
                        key: 'selectAll',
                        align: 'center',
                        width: 60
                    },
                    {
                        title: '编号',
                        key: 'id',
                        align: 'center',
                        width: 90,
                    },
                    {
                        title: '链接名称',
                        key: 'name',
                        align: 'center',
                    },
                    {
                        title: '地址',
                        key: 'linkUrl',
                        align: 'center',
                        render:(h,params)=>{
                        return h('a',{
                                attrs: {
                                    href: params.row.linkUrl,
                                    target: '_blank'
                                }
                            }, params.row.linkUrl)
                        }
                    },
                    {
                        title: '跳转类型',
                        key: 'target',
                        align: 'center',
                        render: (h,params) => {
                            return h('span', {}, params.row.target == 1 ? '当前页打开' : '新页面跳转');
                        }
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        align: 'center',
                    },
                    {
                        title: '状态',
                        key: 'enabledState',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', {
								attrs: {
									class: params.row.isDisable ? 'status-fail' : 'status-success',
								}
							}, params.row.isDisable ? '禁用' : '启用');
                        }
                    },
                    {
                        title: '操作',
                        width: 120,
                        key: 'operation',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                tableSetting.popUp(h, params, this, '编辑'),
                            ]);                          
                        }
                    }
                ],
                //表格信息
                listData:[],
                // 验证规则
                modelValidate: {
                    name: [{ required: true, message: '链接名称不能为空', trigger: 'blur'}],
                    linkUrl: [
                        { required: true, message: '链接地址不能为空', trigger: 'blur'},
                        { pattern: Common.regWebsite, message: "地址格式不正确", trigger: "blur" }
                    ],
                    content: [{ required: true, message: '内容不能为空', trigger: 'blur'}],
                    target:[{ required: true, validator: (rule, value, callback) => callback() }]
                },
                // 弹窗表单
                modelForm: {
                    // 默认新页面跳转
                    target: 2
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
                this.$store.commit('common/SET_BREADCRUMB', [
                    { name: '站点管理', path: null },
                    { name: '友情链接', path: null }
                ]);
                this.getTableList();
            },
            // 打开弹窗
            openModel(row){
                this.storeModalVisible(true, 'edit');
                this.editId = row.id;
                this.modelForm = {
                    name: row.name,
                    linkUrl: row.linkUrl,
                    title: row.title,
                    target: row.target
                }
            }
        },
    }
</script>

<style lang="less" scoped>
    @import "../../assets/less/table_list";
</style>
