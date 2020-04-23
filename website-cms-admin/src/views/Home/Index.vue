<template>
    <div class="g-content">
        <p>欢迎使用 企业后台管理系统.</p><br/>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                breadcrumb:[]
            }
        },
        created(){
            this.init();
        },
        methods: {
            // 初始化页面
            init(){
                // 设置面包屑路径
                this.$store.commit('common/SET_BREADCRUMB', this.breadcrumb);
            }
        },
    }
</script>
