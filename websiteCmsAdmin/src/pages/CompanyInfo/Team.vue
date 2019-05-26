<template>
    <div class="g-content">
        <!--  加载判断 -->
        <Loading v-if="pageLoading"></Loading>
        <Form v-else ref="infoForm" :model="infoForm" :rules="validate" :label-width="120">
            <!-- 团队介绍 -->
            <h2 class="m-title">团队信息</h2>
            <div class="m-content">
                <Row>
                    <Col span="12">
                        <Form-item label="团队图片：" prop="teamImg">
                            <!-- 组件-图片上传-单图片显示 -->
                            <SingleImage :src="GLOBAL.ShowImg(infoForm.teamImg)" upload-dir="img/company/" :preview="true" size-hint="100*100px" :fileSize="180" @get-img-url="setPic"></SingleImage>
                        </Form-item>
                        <Form-item label="团队介绍：" prop="teamIntro">
                            <Input v-model="infoForm.teamIntro" type="textarea" :rows="4" placeholder="请输入团队介绍"/>
                        </Form-item>
                    </Col>
                </Row>
            </div>
            <!-- 团队技能 -->
            <h2 class="m-title">团队技能</h2>
            <div class="m-content">
                <Row v-for="(item, index) in infoForm.teamSkills" :key="index">
                    <Col span="10">
                        <FormItem :label="'技能' + (index + 1) + '名称：'" :prop="'teamSkills.' + index + '.name'" :rules="validate.skillName">
                            <Input v-model="item.name" placeholder="请输入技能名称"></Input>
                        </FormItem>
                        <FormItem label="技能占比：" :prop="'teamSkills.' + index + '.percent'" :rules="validate.skillPercent">
                            <Input v-model="item.percent" placeholder="请输入技能占比" style="width: 50%"></Input>&nbsp;&nbsp;%
                        </FormItem>
                    </Col>
                    <Col span="4">
                        <Button type="ghost" style="margin-left:15px;" @click="removeSkill(index)">删除该技能</Button>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem>
                            <Button type="dashed" long @click="addSkill" icon="plus-round">添加技能</Button>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem>
                            <Button type="primary" @click="submit('infoForm')">确认修改</Button>
                        </FormItem>
                    </Col>
                </Row>
            </div>
        </Form>
    </div>
</template>

<script>
    // 组件
    import Loading from 'components/Common/Loading'
    import SingleImage from 'components/Image/UploadImage/SingleImage'
    // Api方法
    import Api from 'api/company_info.js'

    export default {
        components: {  Loading, SingleImage },
        data(){
            return{
                // 加载页面
                pageLoading: true,
                // 表单信息
                infoForm: {
                    // 封面地址
                    teamImg: '',
                    // 介绍
                    teamIntro: '',
                    // 能力
                    teamSkills: [{
                        name: '技能名称',
                        percent: 0
                    }]
                },
                // 验证规则
                validate: {
                    teamIntro: [{ required: true, message: '团队介绍不能为空', trigger: 'blur'}],
                    teamImg: [{ required: true, validator: (rule, value, callback) => callback() }],
                    skillName: [{ required: true, message: '技能名称不能为空', trigger: 'blur'}],
                    skillPercent: [{ required: true, message: '技能占比不能为空', trigger: 'blur'}]
                },
                // 技能数量
				linkManNum: 1,   
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
                    { name: '团队介绍', path: null }
                ]);
                this.getDetail();
            },
            // 保存
            submit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        if(this.infoForm.teamImg == ''){
                            this.$Message.error('请上传公司图片');
                            return false;
                        }
                        // 页面加载
                        this.pageLoading = true;
                        
                        // 修改
                        Api.EditTeamContent(this.infoForm)
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
                Api.GetTeamContent()
                .then(res => {                    
                    // 取消页面加载
                    this.pageLoading = false;                                       
                    if(res.code == 200){
                        // 设置数据
                        this.infoForm = res.data;
                    }
                    else this.$Message.warning(res.msg);
                })
                .catch(err => console.log(err))
            },
            // 设置图片
            setPic(url){
                this.infoForm.teamImg = url;
            },
            // 添加技能
			addSkill() {
				this.SkillNum++;
				this.infoForm.teamSkills.push({
                    name: '',
                    percent: ''
                });
			},
			// 删除技能
			removeSkill(index) {
				if (this.SkillNum <= 1) {
					this.$Message.error("不可删除!至少要有1个技能信息");
					return false;
				}
				this.infoForm.teamSkills.splice(index, 1);
				this.SkillNum--;
			},
        },
    }
</script>
