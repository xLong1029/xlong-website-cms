<template>
    <div id='multipleImage' class="m-Upload">
        <!-- 图片显示 -->
        <div :ref="'upload-img-'+index" v-for="(item, index) in getImageUrlArr" :key="index" class="upload-show">
            <div class="upload-img-wrap"><img class="upload-image" :src="GLOBAL.ShowImg(item)" alt="图片加载失败" @error="notFoundPic"/></div>
            <!-- 遮罩 -->
            <div class="upload-mask">
                <Icon v-if="preview" type="ios-eye" style="margin-right:15px;" @click.native="viewImage(item)" />
                <Icon type="md-create" @click.native="removeImage('upload-img-'+index, index)" size="22" />
            </div>
        </div>
        <!-- 上传按钮 -->
        <div v-show="showUploadBtn" class="upload-btn" @click="uploadClick">
            <Icon type="ios-camera" size="20"/>
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
        <Modal title="查看图片" class="m-view-img" v-model="showModal" width="900">
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
        name: 'multipleImage',
        mixins: [ UploadImg ],
        // 获取父级传值
        props: {
            // 默认图片显示路径
            imgList:{
                type: Array,
                default: () => []
            },
            // 是否可预览
            preview:{
                type: Boolean,
                default: false
            },
            // 是否显示提示
            showHint:{
                type: Boolean,
                default: true
            },
            // 上传按钮尺寸提示文本
            sizeHint:{
                type: String,
                default: ''
            },
            // 图片文件大小限制，单位KB
            fileSize:{
              type: Number,
              default: 150
            },
            // 最大上传个数
            maxNum: {
                type: Number,
                default: 5
            },
            // 上传路径： XX/XX/XX/
            uploadDir: {
                type: String,
                default: 'img/'
            }
        },
        watch: {
			imgList(val) {
				this.getImageUrlArr = val;
			}
        },
        data () {
            return {
                // 获取图片显示路径
                getImageUrlArr: [],
                // 保存url的数组
                urlArr: [],
                // 显示图片地址
                showImgUrl: ''
            }
        },
        methods: {
            // 查看图片
            viewImage(url){
                this.showImgUrl = url;
                this.showModal = true;
            },
            // 移除图片
            removeImage(img, index){
                // 移除对应索引位置的图片
                this.urlArr.splice(index, 1);
                // 传给父组件url
                this.$emit('get-img-list', this.urlArr);
            },
            // 上传文件
            uploadFile(file){
                // 判断图片上传个数
                const check = this.getImageUrlArr.length < this.maxNum;
                if(!check){
                    this.$Notice.warning({
                        title: '超出文件个数限制',
                        desc: '最多只能上传' + this.maxNum + '张图片'
                    });
                    // 停止加载和隐藏进度条
                    this.progressHide();
                    return check;
                }

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
                        this.urlArr.push(res.data.url);
                        // 传给父组件url
                        this.$emit('get-img-list', this.urlArr);

                        // 停止加载和隐藏进度
                        this.progressHide();
                        this.percentage = 100;
                        clearInterval(progress);

                        this.$Notice.success({ title: '图片上传成功!' });
                    }
                    else this.errorTip(progress);
                })
                .catch(err => this.errorTip(progress))
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../../../assets/less/upload_img";
</style>
