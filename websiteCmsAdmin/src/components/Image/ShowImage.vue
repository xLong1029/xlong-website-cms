<template>
    <div id="showImg">
        <div class="m-show-img" v-for="(item, index) in imageUrlArr" :key="index">
            <div class="img-show"><img :src="item" @error="notFoundPic" /></div>
            <!-- 可预览遮罩 -->
            <div class="img-mask">
                <Icon type="eye" @click.native="viewImage(item)"></Icon>
            </div>
        </div>
        <div class="clearfix"></div>
        <!-- 查看图片 -->
        <Modal title="查看图片" v-model="showModal" class="m-pop-img" width="900">
            <img :src="showImgUrl" @error="notFoundPic"/>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
    import Common from 'common/common.js'

    export default {
        name: 'showImg',
        // 获取父级传值，图片显示链接imageUrlArr
        props: {
            // 设置默认值
            imageUrlArr:{
                type: Array,
                default: []
            }
        },
        data() {
            return {
                // 显示查看图片
                showModal: false,
                // 显示图片的地址
                showImgUrl: '',
            }
        },
        methods: {
            // 查看图片
            viewImage(url){
                this.showModal = true;
                this.showImgUrl = url;
            },
            // 无法显示图片
            notFoundPic(event) {
                Common.SetDefaultPic(event, 2);
            }
        }
    }
</script>
<style lang="less" scoped>
    .m-show-img {
        float: left;
        position: relative;
        height: 150px;
        width: 150px;
        margin: 0 10px 10px 0;
        border: 1px solid #eee;
        border-radius: 4px;
        padding: 10px;
        &:hover{
            .img-mask{
                display: block;
            }
        }
    }

    .img-show{
        height: 128px;
        width: 128px;
        display: table-cell;
        text-align: center;
        vertical-align: middle;
        background: #fff;
        img{
            max-height: 128px;
            max-width: 128px;
            vertical-align: middle;
            display: inline-block;
        }
    }

    .img-mask{
        display: none;
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        background: rgba(0,0,0,0.8);
        border-radius: 4px;
        text-align: center;
        .ivu-icon{
            cursor: pointer;
            color:#fff;
            position: absolute;
            top: 50%;
            margin-top: -13px;
            margin-left: -13px;
            font-size: 26px;
        }
    }

    .m-pop-img{
        img{
            display:block;
            margin: auto;
            max-width: 100%;
        }
    }
</style>
