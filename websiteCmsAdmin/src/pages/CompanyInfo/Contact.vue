<template>
    <div class="g-content">
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
            <div class="clearfix"></div>
        </div>
        <Modal v-model="storeModel.show" :title="storeModel.title" @on-cancel="storeModalVisible(false)">
            <div>
                <Form ref="modelForm" :model="modelForm" :rules="validate" :label-width="100">
                    <Form-item label="标题：" prop="title">
                        <Input v-model="modelForm.title" placeholder="请输入标题"/>
                    </Form-item>
                    <Form-item label="内容：" prop="content">
                        <Input v-model="modelForm.content" type="textarea" placeholder="请输入内容"/>
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
    // Api方法
    import Api from '@/api/company_info.js'
    // 表格设置
    import tableSetting from 'common/table_setting.js'
    // 表格查询
    import TableQuery from 'mixins/table_query.js'
    // 表格操作
    import TableOperate from 'mixins/table_operate.js'
    // 存储弹窗
    import StoreModel from 'mixins/store_model.js'

    export default {
        components: { Loading },
        mixins: [ TableQuery, TableOperate, StoreModel ],
        computed: {
            // 获取所有列表
            apiGetList(){
                return () => Api.GetContactList();
            },
            // 删除操作接口
            apiDelete(){
                return () => Api.DelContactInfo(this.selectList);
            },
            // 启用操作接口
            apiEnable(){
                return () => Api.SetEnableContact(1, this.selectList);
            },
            // 禁用操作接口
            apiDisable(){
                return () => Api.SetEnableContact(2, this.selectList);
            },
            // 新增操作接口
            apiAdd(){
                return () => Api.AddContactInfo(this.modelForm);
            },
            // 编辑操作接口
            apiEdit(){
                return () => Api.EditContactInfo(this.modelForm, this.editId);
            }
        },
        data(){
            return{
                // 加载页面
                pageLoading: false,
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
                        title: '标题',
                        key: 'title',
                        align: 'center',
                    },
                    {
                        title: '内容',
                        key: 'content',
                        align: 'center',
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
                validate: {
                    title: [{ required: true, message: '标题不能为空', trigger: 'blur'}],
                    content: [{ required: true, message: '内容不能为空', trigger: 'blur'}]
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
                this.$store.commit('SET_BREADCRUMB', [
                    { name: '公司信息', path: null },
                    { name: '联系我们', path: null }
                ]);
                this.getTableList();
            },
            // 打开弹窗
            openModel(row){
                this.storeModalVisible(true, 'edit');
                this.editId = row.id;
                this.modelForm = {
                    title: row.title,
                    content: row.content
                }
                
            }
        },
    }
</script>

<style lang="less" scoped>
    @import "../../assets/less/table_list";
</style>
