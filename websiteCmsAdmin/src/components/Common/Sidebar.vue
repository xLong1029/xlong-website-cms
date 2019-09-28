<template>
  <ul class="m-xl-menu-list" :class="{'sidebar-hide-text': sidebarSpan < spanWidth && spanWidth > 0 }">
    <li
      ref="menuItem"
      v-for="(menu, i) in menuList"
      class="xl-menu-item"
      :key="i"
      :class="{'xl-submenu': menu.children, 'xl-menu-active': activeName == menu.name, 'xl-submenu-expand': !accordion}"
    >
      <!-- 一级菜单列表-含二级菜单 -->
      <template v-if="menu.children">
        <div class="xl-menu-title" @click="selectMenu(i)">
          <Icon v-show="!menu.meta.isTitle" class="xl-submenu-title__icon" :type="menu.meta.icon" :size="iconSize"></Icon>
          <span class="xl-submenu-title__text sidebar-text">{{ menu.meta.title }}</span>
          <Icon class="xl-submenu-title__arrow" type="ios-arrow-down"></Icon>
        </div>
        <!-- 二级子菜单列表 -->
        <ul class="m-xl-submenu-list">
          <li ref="submenuMenuItem" class="xl-submenu-item" v-for="(item, index) in menu.children" :key="index">
            <div class="xl-submenu-title" @click="selectSubmenu(i, index)">
              <router-link :to="{ name: item.name }">{{ item.meta.title }}</router-link>
            </div>
          </li>
        </ul>
      </template>
      <!-- 一级菜单列表-无二级菜单 -->
      <div v-else class="xl-menu-title" :class="{'title-menu': menu.meta.isTitle }" @click="selectMenu(i)">
        <router-link :to="{ name: menu.name }">
          <!-- 不是标题才显示 -->
          <Icon v-show="!menu.meta.isTitle" class="xl-menu-title__icon" :type="menu.meta.icon" :size="iconSize"></Icon>
          <!-- 若是标题只在跨距变小时才显示 -->
          <Icon v-show="menu.meta.isTitle && sidebarSpan < spanWidth" class="xl-menu-title__icon" :type="menu.meta.icon" :size="iconSize"></Icon>
          <span class="xl-menu-title__text sidebar-text">{{ menu.meta.title }}</span>
        </router-link>
      </div>
    </li>
  </ul>
</template>
<script>
  import { SiblingsNode, HasClass, AddClass, RemoveClass, ToggleClass, SlideUp, SlideDown } from 'utils'
  // Vuex
  import { mapGetters } from 'vuex'

  export default {
    // js版本的侧边栏组件，与路由配置相关联动
    name: 'sidebar-router',
    computed: {
        ...mapGetters([ 'sidebarSpan' ]),
        iconSize () {
            return this.sidebarSpan === this.spanWidth && this.spanWidth > 0 ? 14 : 20;
        }
    },
    // 获取父级传值
    props: {
        // 侧边栏跨距大小，-1表示无跨距，正值表示跨距大小
        spanWidth: {
          type: Number,
          default: -1
        },
        // 是否开启手风琴模式，开启后至多展开一个子菜单
        accordion: {
            type: Boolean,
            default: false
        },
        // 第一次加载激活的一级菜单对应路由name
        activeName: {
            type: String,
            default: ''
        },
        // 菜单列表
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
                            // 是否为标题菜单，标题菜单则不显示Icon
                          isTitle: false,
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
                            },
                        ]
                    }
                ];
            }
        }
    },
    data () {
        return {
            // 保留激活状态
            active: {
              name: '',
              mIndex: 0,
              subIndex: 0,
            },
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
                            if(this.$route.meta.sidebarName === activeName){
                                this.active = { name: activeName, mIndex: i, subIndex: j };
                                // 激活当前菜单
                                this.setActive(i, j);
                                stop = true;
                                break;
                            }
                            else{
                                this.active = { name: 'Home', mIndex: 0, subIndex: 0 };
                                // 激活当前菜单
                                this.setActive(0, 0);
                            }
                        }
                    }
                    else{
                        // 获取一级菜单路由name
                        activeName = menu[i].name;
                        if(this.$route.meta.sidebarName === activeName){
                            this.active = { name: activeName, mIndex: i, subIndex: 0 };
                            // 激活当前菜单
                            this.setActive(i, 0);
                            stop = true;
                            break;
                        }
                        else{
                            this.active = { name: 'Home', mIndex: 0, subIndex: 0 };
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
            let menuItem = this.$refs.menuItem[mIndex];
            this.activeMenu(menuItem);

            let siblings = SiblingsNode(menuItem);

            let submenuList = menuItem.querySelector('.m-xl-submenu-list');
            if(submenuList){
                let activeItem = submenuList.querySelectorAll('.xl-submenu-title')[subIndex];
                if(HasClass(activeItem, 'xl-submenu-active')) return;

                AddClass(activeItem, 'xl-submenu-active');

                let submenuItems = submenuList.children;
                SlideDown(submenuList, submenuItems[0].offsetHeight * submenuItems.length, 350);

                siblings.forEach(e => this.inActiveMenu(e));
            }
            else{
                siblings.forEach(e => {
                  let submenuList = e.querySelector('.m-xl-submenu-list');
                  if(submenuList && this.accordion){
                    submenuList.style.height = 0;
                  }

                  let submenuItems = e.querySelectorAll('.xl-submenu-title');
                  this.inActiveSubmenu(e);
                });
            }
        },
        // 选中一级菜单
        selectMenu(index){
            let menuItem = this.$refs.menuItem[index];
            this.active.mIndex = index;

            let siblings = SiblingsNode(menuItem);

            let submenuList = menuItem.querySelector('.m-xl-submenu-list');
            // 判断是否有子菜单
            if(submenuList){
                let submenuItems = submenuList.children;

                if(!this.accordion){

                  submenuList.offsetHeight > 0 ? SlideUp(submenuList, submenuItems[0].offsetHeight * submenuItems.length, 350) : SlideDown(submenuList, submenuItems[0].offsetHeight * submenuItems.length, 350);

                  ToggleClass(menuItem, 'xl-submenu-expand');
                  return;
                }

                if(HasClass(menuItem, 'xl-menu-active')){
                    RemoveClass(menuItem, 'xl-menu-active');
                    submenuList.style.height = 0;
                }
                else{
                    this.activeMenu(menuItem);

                    SlideDown(submenuList, submenuItems[0].offsetHeight * submenuItems.length, 350);

                    siblings.forEach(e => this.inActiveMenu(e));
                }
            }
            else{
                this.activeMenu(menuItem);
                siblings.forEach(e => this.inActiveMenu(e));
            }
        },
        // 取消一级菜单的激活状态
        inActiveMenu(menu){
            RemoveClass(menu, 'xl-menu-active');

            let submenuList = menu.querySelector('.m-xl-submenu-list');
            if(submenuList && this.accordion){
              submenuList.style.height = 0;
            }

            // 若为当前激活的一级菜单不修改其二级菜单状态
            let activeMenuItem = this.$refs.menuItem[this.active.mIndex];
            if(activeMenuItem == menu) return;

            let submenuItems = menu.querySelectorAll('.xl-submenu-title');
            this.inActiveSubmenu(submenuItems);
        },
        // 激活当前一级菜单
        activeMenu(menu){
            let siblings = SiblingsNode(menu);
            siblings.forEach(e => {
              RemoveClass(e, 'xl-menu-active');
            });
            AddClass(menu, 'xl-menu-active');

            let submenuList = menu.querySelector('.m-xl-submenu-list');
            if(submenuList){
              let submenuItems = submenuList.children;
              SlideDown(submenuList, submenuItems[0].offsetHeight * submenuItems.length, 350);
            }
        },
        // 选中二级菜单并激活
        selectSubmenu(mIndex, subIndex){
          this.active.mIndex = mIndex;
          this.active.subIndex = subIndex;

          let menuItem = this.$refs.menuItem[mIndex];
          this.activeMenu(menuItem);

          let siblings = SiblingsNode(menuItem);
          siblings.forEach(e => {
            this.inActiveMenu(e)
          });

          let submenuItems = menuItem.querySelectorAll('.xl-submenu-title');
          this.inActiveSubmenu(submenuItems);

          AddClass(submenuItems[subIndex], 'xl-submenu-active');
        },
        // 取消二级菜单的激活状态
        inActiveSubmenu(submenuItems){
          if(!submenuItems || !submenuItems.length) return;
          submenuItems.forEach(e => {
            RemoveClass(e, 'xl-submenu-active');
          });
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
.m-xl-menu-list {
  width: 100%;
  font-size: 14px;
  position: relative;
  z-index: 900;
  margin: 0;
  padding: 0;
  outline: none;
  list-style: none;
  background: #4d5256;
  color: rgba(255, 255, 255, 0.7);
  a {
    color: rgba(255, 255, 255, 0.7);
  }
}
.xl-menu-item,
.xl-submenu {
  cursor: pointer;
  border-bottom: 1px solid #596065;
  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #45484e;
    color: #fff;
  }
}

.xl-menu-item:hover .xl-menu-title a {
  color: #fff;
}

.xl-menu-title{
  padding: 14px 24px;

  a{
    display: block;
  }
}
.xl-menu-active {
  &.xl-menu-item {
    border-right: 2px solid @base_color;
    .xl-menu-title a {
      color: @base_color;
    }
  }
  &.xl-submenu {
    color: #fff;
    border-right: none;
    &.xl-submenu-active {
      color: #fff;
    }
    .xl-submenu-title__arrow {
      transform: rotate(180deg);
    }
  }
}

.xl-submenu-expand {
  .xl-submenu-title__arrow {
    transform: rotate(180deg);
  }
}

.xl-submenu-title {
  display: block;
  // padding: 14px 24px;

  &__arrow {
    float: right;
    margin-top: 4px;
    transition: transform 0.2s ease-in-out;
    -o-transition: transform 0.2s ease-in-out;
    -webkit-transition: transform 0.2s ease-in-out;
    -ms-transition: transform 0.2s ease-in-out;
    -moz-transition: transform 0.2s ease-in-out;
  }
}

.xl-submenu-title,
.xl-menu-title{
  &__icon {
    margin-right: 8px;
  }
}

.m-xl-submenu-list {
  width: 100%;
  background: #3a3d44;
  overflow: hidden;
  // transition: height 0.35s;
  // -o-transition: height 0.35s;
  // -webkit-transition: height 0.35s;
  // -ms-transition: height 0.35s;
  // -moz-transition: height 0.35s;
}
.xl-submenu-item {
  a:hover {
    color: #fff;
  }
}
.xl-submenu-title {
  a {
    padding: 14px 10px 14px 45px;
    display: block;
    &:hover {
      color: #fff;
    }
  }
  &.xl-submenu-active {
    a {
      color: #fff;
      background: @base_color !important;
    }
  }
}

.title-menu{
  .xl-menu-title__icon,
  .xl-menu-title__text{
    color: @base_color;
  }
}

// 侧边栏隐藏时
.sidebar-hide-text{
  .sidebar-text{
    display: none;
  }

  .xl-menu-title{
    text-align: center;
    padding: 14px 20px;
  }

  .xl-submenu-title,
  .xl-menu-title{
    &__icon {
      margin-right: 0;
    }
  }

  .xl-submenu-title{
    text-align: center;

    &__arrow{
      float: inherit;
    }

    a{
      padding: 14px 10px;
      font-size: 12px;
    }
  }
}
</style>
