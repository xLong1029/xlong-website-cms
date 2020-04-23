<template>
    <div class="g-content">
        <!-- 操作按钮 -->
        <div class="m-operation">
            <Button class="operation-btn" type="primary" @click="storeModalVisible(true, 'add')">新增</Button>
            <Button class="operation-btn" :disabled="selectList.length == 0" type="warning" @click="deleteData">删除</Button>
            <Button class="operation-btn" :disabled="selectList.length == 0" type="primary" @click="enableOrDisable(1)">启用</Button>
            <Button class="operation-btn" :disabled="selectList.length == 0" type="warning" @click="enableOrDisable(-1)">禁用</Button>
            <Button v-if="isSecond" class="operation-btn" type="default" @click="$router.go(-1)">返回</Button>
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
                    <Form-item label="标题：" prop="name">
                        <Input v-model="modelForm.name" placeholder="请输入导航名称"/>
                    </Form-item>
                    <Form-item label="链接：" prop="url">
                        <Input v-model="modelForm.url" placeholder="请输入链接地址"/>
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
    // Api方法
    import Api from '@/api/nav_manage.js'
    // 表格设置
    import tableSetting from 'utils/table_setting.js'
    // 表格查询
    import TableQuery from 'mixins/table_query.js'
    // 表格操作
    import TableOperate from 'mixins/table_operate.js'
    // 存储弹窗
    import StoreModel from 'mixins/store_model.js'

    export default {
        components: { Loading },
        mixins: [ TableQuery, TableOperate, StoreModel ],
        // 获取父级传值
        props: {
            // 是否为二级导航
            isSecond:{
                type: Boolean,
                default: false
            },
            // 父级Id
            parentId:{
                type: Number,
                default: 0
            }
        },
        computed: {
            // 获取所有列表
            apiGetList(){
                return () => Api.GetNavList({ parentId: this.parentId });
            },
            // 删除操作接口
            apiDelete(){
                return () => Api.DelNav(this.selectList);
            },
            // 启用操作接口
            apiEnable(){
                return () => Api.SetEnableNav(1, this.selectList);
            },
            // 禁用操作接口
            apiDisable(){
                return () => Api.SetEnableNav(2, this.selectList);
            },
            // 新增操作接口
            apiAdd(){
                return () => Api.AddNav(this.modelForm);
            },
            // 编辑操作接口
            apiEdit(){
                return () => Api.EditNav(this.modelForm, this.editId);
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
                        title: '导航名称',
                        key: 'name',
                        align: 'center',
                    },
                    {
                        title: '链接',
                        key: 'url',
                        align: 'center',
                        render:(h,params)=>{
                            if(!params.row.children.length){
                                return h('a',{
                                    attrs: {
                                        href: this.website + params.row.url,
                                        target: '_blank'
                                    }
                                }, params.row.url)
                            }
                            else{
                                return h('span',{}, params.row.url)
                            }
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
                        width: 180,
                        key: 'operation',
                        align: 'center',
                        render: (h, params) => {
                            if(this.isSecond){
                                return h('div', [ tableSetting.popUp(h, params, this, '编辑', '10px') ]); 
                            }
                            else{
                                return h('div', [
                                    tableSetting.popUp(h, params, this, '编辑', '10px'),
                                    tableSetting.gotoDetail(h, params, this, '查看下级', 'SecondNav'),
                                ]);
                            }                    
                        }
                    }
                ],
                //表格信息
                listData:[],
                // 验证规则
                validate: {
                    name: [{ required: true, message: '导航名称不能为空', trigger: 'blur'}],
                    url: [{ required: true, message: '链接不能为空', trigger: 'blur'}],
                    target:[{ required: true, validator: (rule, value, callback) => callback() }]
                },
                // 弹窗表单
                modelForm: {
                    // 默认当前页打开
                    target: 1
                }
            }
        },
        created(){
            this.init();
        },
        methods: {
            // 初始化页面
            init(){
                // 地址配置
                const debug = process.env.NODE_ENV !== 'production';
                // 测试环境
                if (debug) {
                    this.website = 'http://127.0.0.1:6060';
                }

                this.updateList();
            },
            // 打开弹窗
            openModel(row){
                this.storeModalVisible(true, 'edit');
                console.log(row);
                this.editId = row.id;
                this.modelForm = {
                    name: row.name,
                    url: row.url,
                    target: row.target
                }
            },
            // 获取表格内容
            getTableList(id){
                this.apiGetList(id).then(res => {
                    this.pageLoading = false;
                    if(res.code == 200){
                        // 设置数据
                        this.setListData(res.data);
                        if(this.page){
                            // 设置页码
                            this.setPage(res.page);
                        }
                    }
                    else this.$Message.error('数据获取失败');
                })
                .catch(err => console.log(err))
            },
            // 新增数据
            addData(){
                if(this.parentId > 0){
                    this.modelForm.parentId = this.parentId;
                }

                this.apiAdd().then(res => {
                    this.pageLoading = false;
                    if(res.code == 200){
                        this.$Message.success('新增成功');
                        // 更新列表
                        this.updateList();
                        // 清空选项列表
                        this.clearSelect();
                        // 关闭存储弹窗
                        this.storeModalVisible(false);
                    }
                    else this.$Message.warning(res.msg);
                }).catch(() => this.$Message.error('新增失败'))
            },
            // 更新列表信息
            updateList(){
                this.getTableList();
            }
        },
    }
</script>

<style lang="less" scoped>
    @import "../../assets/less/table_list";
</style>