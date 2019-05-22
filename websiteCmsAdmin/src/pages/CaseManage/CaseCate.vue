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
        <Modal v-model="storeModel.show" :title="storeModel.title" @on-cancel="storeModalVisible(false)">
            <div>
                <Form ref="modelForm" :model="modelForm" :rules="validate" :label-width="120">
                    <Form-item label="分类名称：" prop="categoryName">
                        <Input v-model="modelForm.categoryName" placeholder="请输入标题"/>
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
    import Api from '@/api/product_service.js'
    // 表格设置
    import tableSetting from 'common/table_setting.js'
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
                return () => Api.GetCateList({
                    pageNo: this.page.pageNo,
                    pageSize: this.page.pageSize
                });
            },
            // 删除操作接口
            apiDelete(){
                return () => Api.DelCate(this.selectList);
            },
            // 启用操作接口
            apiEnable(){
                return () => Api.SetEnableCate(1, this.selectList);
            },
            // 禁用操作接口
            apiDisable(){
                return () => Api.SetEnableCate(2, this.selectList);
            },
            // 新增操作接口
            apiAdd(){
                return () => Api.AddCate(this.modelForm);
            },
            // 编辑操作接口
            apiEdit(){
                return () => Api.EditCate(this.modelForm, this.editId);
            }
        },
        data(){
            return{
                // 加载页面
                pageLoading: false,
                // 地址配置
                website: '',
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
                        title: '分类名称',
                        key: 'categoryName',
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
                        width: 180,
                        key: 'operation',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                tableSetting.popUp(h, params, this, '编辑', '10px'),
                                tableSetting.commonBtn(h, params, this, 'gotoCaseList', '查看案例')
                            ]);                          
                        }
                    }
                ],
                //表格信息
                listData:[],
                // 验证规则
                validate: {
                    categoryName: [{ required: true, message: '分类名称不能为空', trigger: 'blur'}],
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
                    { name: '案例管理', path: null },
                    { name: '案例分类', path: null }
                ]);
                this.getTableList();

                // 地址配置
                const debug = process.env.NODE_ENV !== 'production';
                // 测试环境
                if (debug) {
                    this.website = 'http://127.0.0.1:6060';
                }
            },
            // 打开弹窗
            openModel(row){
                this.storeModalVisible(true, 'edit');
                this.editId = row.id;
                this.modelForm = {
                    categoryName: row.categoryName
                };
            },
            // 跳转案例列表页
            gotoCaseList(params){
                this.$router.push({ name : 'CaseList', query : { cid : params.row.id } });
            }
        },
    }
</script>

<style lang="less" scoped>
    @import "../../assets/less/table_list";
</style>
