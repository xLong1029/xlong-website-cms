<template>
    <ul class="m-xl-menu-list">
        <li v-for="(menu, i) in menuList" :key="i" :class="['xl-menu-item', menu.children ? 'xl-menu-submenu' : '', activeName == menu.name ? 'xl-menu-active' : '']">
            <!-- 一级菜单列表-含二级菜单 -->
            <div v-if="menu.children">
                <div v-if="menu.meta" class="xl-menu-submenu-title" @click="selectMenu(i)">
                    <Icon :type="menu.meta.icon"></Icon>
                    <span class="xl-menu-submenu-title__text">{{ menu.meta.title }}</span>
                    <Icon class="xl-menu-submenu-title-icon" type="ios-arrow-down"></Icon>
                </div>
                <!-- 二级子菜单列表 -->
                <ul class="m-xl-submenu-list">
                    <li v-for="(item, index) in menu.children" :key="index" class="xl-submenu-item">
                        <div v-if="item.meta" class="xl-submenu-title" @click="selectSubmenu(i, index)">
                            <!-- {{ item }} -->
                            <router-link :to="{ name: item.name }" >{{ item.meta.title }}</router-link>
                        </div>
                    </li>
                </ul>
            </div>
            <!-- 一级菜单列表-无二级菜单 -->
            <div v-else class="xl-menu-title" @click="selectMenu(i)">
                <router-link v-if="menu.meta" :to="{ name: menu.name }" >
                    <Icon :type="menu.meta.icon"></Icon>
                    <span class="xl-menu-title__text">{{ menu.meta.title }}</span>
                </router-link>
            </div>
        </li>
    </ul>
</template>
<script>
  import $ from 'jquery'
  export default {
    // 获取父级传值
    // activeName: 第一次加载激活的一级菜单对应路由name
    // Menu：菜单列表
    props: {
        userType:{
            type: Number,
            default: 0
        },
        activeName:{
            type: String,
            default: ''
        },
        menuList:{
            type: Array,
            // 警告提示数组/对象默认值应当以一个函数返回 Object/Array must use a factory function to return the default value.
            default: function(){
                return [
                    {
                        // menu-item对应的路由name
                        name: 'Home',
                        meta:{
                            // iView的Icon图标的type属性
                            icon: 'navicon-round',
                            // menu-title显示文本
                            title: '一级菜单',
                        },
                        // submenu列表
                        children: [
                            {
                                // submenu-item对应的路由name
                                name: 'Home',
                                meta:{
                                    // submenu-title显示文本
                                    title: '二级菜单',
                                }
                            }
                        ]
                    }
                ];
            }
        }
    },
    data () {
        return {
            nowActive: '',
        }
    },
    mounted(){        
        this.setSideBar();
    },
    methods:{
        // 设置侧边栏
        setSideBar(){
            let stop = false;
            let activeName = '';
            const menu = this.menuList;
            // 遍历menu
            for(let i = 0 ; i < menu.length ; i ++){
                if(!stop){
                    
                    if(menu[i].children){
                        // 遍历menu下的menu-item
                        for(let j = 0 ; j < menu[i].children.length; j ++){
                            // 获取二级菜单路由name        			
                            activeName = menu[i].children[j].name;
                            if(window.location.href.indexOf(activeName) != -1){                            
                                this.nowActive = activeName;
                                // 激活当前菜单
                                this.setActive(i, j);
                                stop = true;
                                break;
                            }
                            else{
                                this.nowActive = 'Home';
                                // 激活当前菜单
                                this.setActive(0, 0);
                            }
                        }
                    }
                    else{
                        // 获取一级菜单路由name
                        activeName = menu[i].name;
                        if(window.location.href.indexOf(activeName) != -1){                      
                            this.nowActive = activeName;                            
                            // 激活当前菜单
                            this.setActive(i, 0);
                            stop = true;
                            break;
                        }
                        else{
                            this.nowActive = 'Home';
                            // 激活当前菜单
                            this.setActive(0, 0);
                        }
                    }
                }
                else break;
            }
        },
        // 激活当前菜单
        setActive(mIndex, subIndex){
            let item = $('.xl-menu-item').eq(mIndex);
            this.activeMenu(item);

            let child = item.find('.m-xl-submenu-list');
            if(child.length){
                let activeItem = child.find('.xl-submenu-title').eq(subIndex);
                if(activeItem.hasClass('xl-submenu-active')) return;
                child.css('display','block');
                activeItem.addClass('xl-submenu-active');     
                item.siblings().find('.m-xl-submenu-list').css('display','none');
                item.siblings().find('.xl-submenu-title').removeClass('xl-submenu-active');
            }
            else{
                item.siblings().find('.m-xl-submenu-list').css('display','none');
                item.siblings().find('.xl-submenu-title').removeClass('xl-submenu-active');
            }
        },
        // 选中一级菜单
        selectMenu(index){
            let item = $('.xl-menu-item').eq(index);
            let child = item.find('.m-xl-submenu-list');
            // 判断是否有子菜单
            if(child.length){
                if(item.hasClass('xl-menu-active')){
                    item.removeClass('xl-menu-active');
                    child.slideUp(250);
                }
                else{
                    this.activeMenu(item);
                    child.slideDown(250);
                    this.removeActive(item.siblings());
                }
            }
            else{
                this.activeMenu(item);
                this.removeActive(item.siblings());
            }            
        },
        // 取消一级菜单的激活状态
        removeActive(item){
            item.find('.m-xl-submenu-list').slideUp(250);
            item.find('.xl-submenu-title').removeClass('xl-submenu-active');
        },
        // 激活当前一级菜单
        activeMenu(item){
            
            item.addClass('xl-menu-active').siblings().removeClass('xl-menu-active');
        },
        // 激活二级菜单
        selectSubmenu(mIndex, subIndex){
            let parent = $('.xl-menu-item').eq(mIndex);
            let item = parent.find('.xl-submenu-title');
            item.removeClass('xl-submenu-active').eq(subIndex).addClass('xl-submenu-active');
            parent.siblings().find('.xl-submenu-title').removeClass('xl-submenu-active');
        }
    },
    watch:{
        '$route' (to, from) {
            // 对路由变化作出响应...
            this.setSideBar();
        }
    }
  }
</script>
<style lang="less" scoped>
    @import "../../assets/less/color";
    
    .m-xl-menu-list{
        width: 100%;
        font-size: 14px;
        position: relative;
        z-index: 9;
        margin: 0;
        padding: 0;
        outline: none;
        list-style: none;
        background: #4d5256;
        color:rgba(255, 255, 255, 0.7);
        a{
            color:rgba(255, 255, 255, 0.7);
        }
    }
    .xl-menu-item, .xl-menu-submenu{
        cursor: pointer;
        border-bottom: 1px solid #596065;
        // &:last-child{
        //     border-bottom: none;
        // }

        &:hover{
            background: #45484e;
            color: #fff;
        }
        i{
            margin-right: 8px;
        }
    }

    .xl-menu-item:hover .xl-menu-title a{
        color: #fff;
    }

    .xl-menu-title a{
        display: block;
        padding: 14px 24px;
    }
    .xl-menu-active{        
        &.xl-menu-item{
            // border-right: 2px solid @base_color;
            // background: #45484e;
            background: @base_color;
            .xl-menu-title a{
                // color: lighten(@base_color, 10%);
                color: #fff;
            }
        }
        &.xl-menu-submenu{
            color: #fff;
            border-right: none;
            background: transparent;
            &.xl-submenu-active{
                color: #fff;
            }
            .xl-menu-submenu-title-icon{
                transform: rotate(180deg);
            }
        }
    }
    .xl-menu-submenu-title{
        display: block;
        padding: 14px 24px;
    }
    .xl-menu-submenu-title-icon{
        float: right;
        margin-top: 4px;
        transition: transform 0.2s ease-in-out;
        -o-transition: transform 0.2s ease-in-out;
        -webkit-transition: transform 0.2s ease-in-out;
        -ms-transition: transform 0.2s ease-in-out;
        -moz-transition: transform 0.2s ease-in-out;
    }

    .m-xl-submenu-list{
        background: #3a3d44;
        display: none;
    }
    .xl-submenu-item{
        a:hover{
            color:#fff;
        }
    }
    .xl-submenu-title{
        a{
            padding: 14px 0 14px 45px;
            display: block;
            &:hover{
                color: #fff;
            }
        }
        &.xl-submenu-active{
            a{
                color: #fff;
                background: @base_color !important;
            }            
        }
    }

    .g-layout.layout-mini{
        .xl-menu-title__text,
        .xl-menu-submenu-title__text{
            display: none;
        }

        .xl-menu-submenu-title,
        .xl-menu-title{
            text-align: center;

            .ivu-icon{
                text-align: center;
                font-size: 20px;
                margin-right: 0;
            }
        }

        .xl-menu-submenu-title-icon{
            float: none;
        }

        .xl-submenu-title a{
            padding: 14px 18px;
        }
        }
</style>
