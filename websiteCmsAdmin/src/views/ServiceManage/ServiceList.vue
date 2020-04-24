<template>
    <div class="g-content">
        <!-- 操作按钮 -->
        <div class="m-operation">
            <Button class="operation-btn" type="primary" @click="storeModalVisible(true, 'add')">新增</Button>
            <Button class="operation-btn" :disabled="selectList.length == 0" type="warning" @click="deleteData">删除</Button>
            <Button class="operation-btn" :disabled="selectList.length == 0" type="primary" @click="enableOrDisable(1)">启用</Button>
            <Button class="operation-btn" :disabled="selectList.length == 0" type="warning" @click="enableOrDisable(-1)">禁用</Button>
            <a :href="website + '/icon'" target="_blank" class="operation-btn ivu-btn ivu-btn-primary">查看可用的图标类名</a>
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
        <Modal v-model="storeModel.show" width="800" :title="storeModel.title" @on-cancel="storeModalVisible(false)">
            <div>
                <Form ref="modelForm" :model="modelForm" :rules="validate" :label-width="150">
                    <Form-item label="标题：" prop="title">
                        <Input v-model="modelForm.title" placeholder="请输入标题"/>
                    </Form-item>
                    <Form-item label="简介（用于首页）：" prop="summary">
                        <Input v-model="modelForm.summary" type="textarea" :rows="4" :maxlength="50" placeholder="请输入服务简介（不超过50个字符）"/>
                    </Form-item>
                    <Form-item label="内容：" prop="content">
                        <Input v-model="modelForm.content" type="textarea" :rows="4" placeholder="请输入服务内容"/>
                    </Form-item>
                    <Form-item label="图标类名：" prop="iconClass">
                        <Input v-model="modelForm.iconClass" placeholder="请输入图标类名"/>
                    </Form-item>
                    <Form-item label="显示在首页：" prop="showIndex">
                        <Radio-group v-model="modelForm.showIndex">
                            <Radio :label="1">是</Radio>
                            <Radio :label="0">否</Radio>
                        </Radio-group>
                    </Form-item>
                    <Form-item label="案例链接：" prop="caseUrl">
                        <Input v-model="modelForm.caseUrl" placeholder="请输入案例链接"/>
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
    // Api方法
    import Api from '@/api/product_service.js'
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
                return () => Api.GetServiceList({
                    pageNo: this.page.pageNo,
                    pageSize: this.page.pageSize
                });
            },
            // 删除操作接口
            apiDelete(){
                return () => Api.DelService(this.selectList);
            },
            // 启用操作接口
            apiEnable(){
                return () => Api.SetEnableService(1, this.selectList);
            },
            // 禁用操作接口
            apiDisable(){
                return () => Api.SetEnableService(2, this.selectList);
            },
            // 新增操作接口
            apiAdd(){
                return () => Api.AddService(this.modelForm);
            },
            // 编辑操作接口
            apiEdit(){
                return () => Api.EditService(this.modelForm, this.editId);
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
                        title: '服务名称',
                        key: 'title',
                        align: 'center',
                    },
                    {
                        title: '图标类名',
                        key: 'iconClass',
                        align: 'center',
                    },
                    {
                        title: '案例链接',
                        key: 'caseUrl',
                        align: 'center',
                        render:(h,params)=>{
                        return h('a',{
                                attrs: {
                                    href: this.website + params.row.caseUrl,
                                    target: '_blank'
                                }
                            }, params.row.caseUrl)
                        }
                    },
                    {
                        title: '显示在首页',
                        key: 'showIndex',
                        align: 'center',
                        width: 100,
                        render: (h,params) => {
                            return tableSetting.commonSwitch(h, params, this, 'setShowIndex', 'showIndex');
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
                validate: {
                    title: [{ required: true, message: '标题不能为空', trigger: 'blur'}],
                    summary: [{ required: true, message: '简介不能为空', trigger: 'blur'}],
                    content: [{ required: true, message: '内容不能为空', trigger: 'blur'}],
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
                this.$store.commit('common/SET_BREADCRUMB', [{ name: '产品服务', path: null }]);
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
                    title: row.title,
                    summary:row.summary,
                    content: row.content,
                    iconClass: row.iconClass,
                    showIndex: row.showIndex,
                    caseUrl: row.caseUrl
                };
            },
            // 在首页显示
			setShowIndex(params){
                if(params.row.iconClass == ''){
                    this.$Message.error('图标类名为空不能显示于首页');
                    // 更新列表
                    this.updateList();
                    return false;
                }

				this.selectList.push(params.row.id);
				let isHome = params.row.showIndex == 1 ? 'false': 'true';

				Api.SetShowIndex(isHome, [params.row.id]).then(res => {
					if(res.code == 200){
                        this.$Message.success('操作成功');
                        // 更新列表
                        this.updateList();
                    }
                    else this.$Message.warning(res.msg);
				}).catch(() => this.$Message.error('操作失败'))
            },
            // 存储数据
            storeData(form){
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        if(this.modelForm.showIndex && !this.modelForm.iconClass){
                            this.$Message.error('若需显示在首页，图标类名不能为空');
                            return false;
                        }
                        // 页面加载
                        this.pageLoading = true;
                
                        if(this.storeType == 'add') this.addData(); 
                        else this.editData();
                    }
                    else this.$Message.error('提交失败！填写有误');
                })
            }
        },
    }
</script>

<style lang="less" scoped>
    @import "../../assets/less/table_list";
</style>
