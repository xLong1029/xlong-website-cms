<template>
    <div class="g-content">
        <NavTemplate :isSecond="true" :parent-id="id"/>
    </div>
</template>

<script>
    // 组件
    import NavTemplate from './NavTemplate'
    // Api方法
    import Api from '@/api/nav_manage.js'
    // 通用JS
    import { GetUrlQuery } from 'common/important.js'

    export default {
        components: { NavTemplate },
        data(){
            return{
                id: false,
            }
        },
        created(){
            this.init();
        },
        methods: {
            // 初始化页面
            init(){
                this.id = parseInt(GetUrlQuery('id'));

                Api.GetNavList({id: this.id}).then(res => {
                    if(res.code == 200){
                        // 设置面包屑路径
                        this.$store.commit('SET_BREADCRUMB', [
                            { name: '导航管理', path: null },
                            { name: `一级导航-${res.data[0].name}`, path: '/admin/NavManage/FirstNav' },
                            { name: '二级导航列表', path: null }
                        ]);
                    }
                    else{
                        // 设置面包屑路径
                        this.$store.commit('SET_BREADCRUMB', [
                            { name: '导航管理', path: null },
                            { name: '一级导航列表', path: '/admin/NavManage/FirstNav' },
                            { name: '二级导航列表', path: null }
                        ]);
                    }
                })
                .catch(err => console.log(err))
            },
        },
    }
</script>