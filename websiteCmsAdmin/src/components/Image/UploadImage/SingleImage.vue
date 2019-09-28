<template>
    <div id="singleImage" class="m-Upload">
        <!-- 图片显示 -->
        <div v-if="getImageUrl != ''" class="upload-show">
            <div class="upload-img-wrap"><img class="upload-image" :src="GLOBAL.ShowImg(getImageUrl)" alt="图片加载失败" @error="notFoundPic"/></div>
            <!-- 遮罩 -->
            <div class="upload-mask">
                <Icon v-if="preview" type="eye" @click.native="viewImage" style="margin-right:15px;"></Icon>
                <Icon type="edit" @click.native="uploadClick"></Icon>
            </div>
        </div>
        <!-- 上传按钮 -->
        <div v-show="showUploadBtn" class="upload-btn" @click="uploadClick">
            <Icon type="camera" size="20"></Icon>
            <input ref="imgFile" type="file" :accept="format" hidden @change="selectFile"/>
        </div>
        <!-- 上传进度条  -->
        <template v-if="uploadStatus != 'finished'">
            <Progress v-if="showProgress" :percent="percentage" hide-info :stroke-width="3" style="width:340px;"></Progress>
        </template>
        <!-- 图片格式提示 -->
        <span v-show="showHint" class="hint">
            * 图片格式要求：jpg、jpeg、png，
            <span v-if="sizeHint">建议尺寸： {{ sizeHint }}，</span>
            文件大小为
            <span v-if="fileSize < 1024">{{ fileSize }}kb</span>
            <span v-else>{{ Math.floor(fileSize/1024) }}M</span>
            以内。
        </span>
        <div class="clearfix"></div>
        <!-- 查看图片 -->
        <Modal title="查看图片" class="m-view-img" v-model="showModal" width="900" style="z-index:9999">
            <img :src="GLOBAL.ShowImg(getImageUrl)" @error="notFoundPic"/>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
    // 图片上传设置
    import UploadImg from 'mixins/upload_img.js'
    // Api
    import Api from 'api/common.js'

    export default {
        name: 'singleImage',
        mixins: [ UploadImg ],
        // 获取父级传值
        props: {
            // 图片路径
            src:{
                type: String,
                default: ''
            },
            // 是否可预览
            preview:{
                type: Boolean,
                default: false
            },
            // 是否显示格式提示
            showHint:{
                type: Boolean,
                default: true
            },
            // 上传按钮尺寸提示文本
            sizeHint:{
                type: String,
                default: '100*100px'
            },
            // 图片文件大小限制，单位KB
            fileSize:{
              type: Number,
              default: 150
            },
            // 上传路径： XX/XX/XX/
            uploadDir: {
                type: String,
                default: 'img/'
            },
            // 组件索引值
            index: {
                type: Number,
                default: -1
            }
        },
        data () {
            return {
                // 是否显示上传按钮
                showUploadBtn: true,
                // 获取图片显示路径
                getImageUrl: ''
            }
        },
        watch: {
			src(val) {
                if(val){
                    this.showUploadBtn = false;
                    this.getImageUrl = val;
                }
                else{
                    this.showUploadBtn = true;
                    this.getImageUrl = '';
                }
			}
        },
        created() {
            if(this.src){
                this.showUploadBtn = false;
                this.getImageUrl = this.src;
            }
        },
        methods: {
            // 上传文件
            uploadFile(file){
                this.progressShow();

                // 设置定时器累增进度条百分比
                let progress = setInterval(() => {
                    if(this.percentage == 90) clearInterval(progress);
                    this.percentage += 10;
                },100);

                // 创建formData对象
                let params = new FormData();
                params.append('dir', this.uploadDir);
                params.append('file', file);

                Api.UploadImg(params).then(res => {
                    if(res.code == 200){
                        this.getImageUrl = res.data.url;
                        // 传给父组件url
                        this.index < 0 ? this.$emit('get-img-url', this.getImageUrl) : this.$emit('get-img-url', this.getImageUrl, this.index);

                        // 停止加载和隐藏进度
                        this.progressHide();
                        this.percentage = 100;
                        clearInterval(progress);
                        this.showUploadBtn = false;

                        this.$Notice.success({ title: '图片上传成功!' });
                    }
                    else this.errorTip(progress);
                })
                .catch(err => this.errorTip(progress))
            },
        }
    }
</script>

<style lang="less" scoped>
    @import "../../../assets/less/upload_img";
</style>
