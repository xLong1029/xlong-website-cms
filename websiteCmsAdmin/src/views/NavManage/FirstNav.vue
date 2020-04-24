<template>
    <div class="g-content">
        <NavTemplate/>
    </div>
</template>

<script>
    // 组件
    import NavTemplate from './NavTemplate'

    export default {
        components: { NavTemplate },
        data(){
            return{
            }
        },
        created(){
            this.init();
        },
        methods: {
            // 初始化页面
            init(){
                this.$store.commit('common/SET_BREADCRUMB', [
                    { name: '导航管理', path: null },
                    { name: '一级导航列表', path: null }
                ]);
            },
        },
    }
</script>