<template>
    <div :class="['g-layout', sidebarSpan < 3 ? 'layout-mini' : '']">
        <div class="layout-left">
            <div class="sidebar-title">
                <img v-show="sidebarSpan < 3" class="sidebar-logo" :src="logo"/>
                <span v-show="sidebarSpan === 3" class="sidebar-title-text">企业后台管理系统</span>
            </div>
        	<!-- 侧边栏 -->
            <Sidebar :menu-list="sidebarMenu"></Sidebar>
        </div>
        <div class="layout-right">
        	<!-- 顶部菜单 -->
            <MenuTop></MenuTop>
            <div class="g-container">
                <!-- 页面视图 -->
                <Breadcrumb></Breadcrumb>
                <transition name="fade" mode="out-in">
                    <router-view></router-view>
                </transition>
                <!-- 项目版权 -->
                <div class="copyright">
                    Copyright &copy; 2019 <a href="/">{{ siteInfo.companyName }}</a> 版权所有 {{ siteInfo.webRecordInfo }}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
	// 组件
	import MenuTop from 'components/Common/MenuTop'
  	import Sidebar from 'components/Common/Sidebar'
    import Breadcrumb from 'components/Common/Breadcrumb'
    // 路由
    import { routerMap } from 'router';
    // 通用方法
    import { CopyArr } from 'common/important.js';
    // Vuex
    import { mapGetters } from 'vuex'

    export default {
    	components:{ MenuTop, Sidebar, Breadcrumb },
        computed: {
            ...mapGetters([ 'sidebarSpan', 'sidebarMenu', 'siteInfo' ])
        },
        data () {
            return {
                // LOGO
                logo: require('assets/images/icon-logo.png')
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "../assets/less/color";
    .g-layout{
        position: relative;
        min-width: 1200px;

        .layout-left{
            height: 100%;
            width: 200px;
            position:absolute;
            left:0;
            background: #4d5256;
            transition: width .2s ease-in-out;
            transition: width .2s ease-in-out; 
            -moz-transition: width .2s ease-in-out; /* Firefox 4 */ 
            -webkit-transition: width .2s ease-in-out; /* Safari and Chrome */ 
            -o-transition: width .2s ease-in-out; /* Opera */ 
        }

        .layout-right{
            width: 100%;
            padding-left: 200px;
            transition: padding-left .2s ease-in-out;
            -moz-transition: padding-left .2s ease-in-out; /* Firefox 4 */ 
            -webkit-transition: padding-left .2s ease-in-out; /* Safari and Chrome */ 
            -o-transition: padding-left .2s ease-in-out; /* Opera */ 
        }

        &.layout-mini{
            .layout-left{
                width: 68px;
            }
            .layout-right{
                padding-left: 68px;
            }
        }
    }

    .sidebar{
        &-title{
            height: 50px;
            color: lighten(@base_color, 30%);
            text-align:center;
            border-bottom: 1px solid #3a3d44;

            &-text{                
                line-height: 50px;
            }
        }

        &-logo{
            margin-top: 10px;
        }
    }

    .g-container{
        min-height: 100vh;
        background: #fff;
        margin-top: -50px;
        padding-top: 50px;
        padding-bottom: 40px;
        position: relative;
    }

    .g-content{
        padding: 15px;
    }

    .copyright{
        position:absolute;
        bottom: 0;
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        padding: 0 15px;
        color: #9ea7b4;
        background: #eee;
        font-size: 12px;
    }
</style>
