<template>
  <div id="imgCropper" class="m-Upload">
    <!-- 图片显示 -->
    <div v-if="getImageUrl != ''" class="upload-show">
      <div class="upload-img-wrap">
        <img
          class="upload-image"
          :src="GLOBAL.ShowImg(getImageUrl)"
          alt="图片加载失败"
          @error="notFoundPic"
        />
      </div>
      <!-- 遮罩 -->
      <div class="upload-mask">
        <Icon v-if="preview" type="eye" @click.native="viewImage" style="margin-right:15px;"></Icon>
        <Icon type="edit" @click.native="uploadClick"></Icon>
      </div>
    </div>
    <!-- <div class="clearfix"></div> -->
    <!-- 上传按钮 -->
    <div v-show="showUploadBtn" class="upload-btn" @click="uploadClick">
      <Icon type="camera" size="20"></Icon>
      <input ref="imgFile" type="file" :accept="format" hidden @change="selectFile" />
    </div>
    <!-- <div class="clearfix"></div> -->
    <!-- 上传进度条  -->
    <template v-if="uploadStatus != 'finished'">
      <Progress
        v-if="showProgress"
        :percent="percentage"
        hide-info
        :stroke-width="3"
        style="width:340px;"
      ></Progress>
    </template>
    <!-- 图片格式提示 -->
    <span v-show="showFormatHint" class="hint">
      * 图片格式要求：jpg、jpeg、png，
      <span v-if="sizeHint">建议尺寸： {{ sizeHint }}，</span>
      文件大小为
      <span v-if="fileSize < 1024">{{ fileSize }}kb</span>
      <span v-else>{{ Math.floor(fileSize/1024) }}M</span>
      以内。
    </span>
    <!-- 裁剪图片弹窗 -->
    <Modal
      :title="cropImgModel.title"
      class="m-cropper-img"
      v-model="cropImgModel.show"
      width="900"
      @on-cancel="hideCropModel"
    >
      <!-- 图片裁剪区域 -->
      <div class="img-cropper-area">
        <vueCropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.size"
          :outputType="option.outputType"
          :info="true"
          :canScale="option.canScale"
          :autoCrop="option.autoCrop"
          :autoCropWidth="autoCropWidth"
          :autoCropHeight="autoCropHeight"
          :fixed="fixed"
          :fixedNumber="fixedNumber"
          @realTime="realTime"
        ></vueCropper>
      </div>
      <!-- 裁剪预览区域 -->
      <div class="img-preview-area">
        <div class="preview" :style="previewStyle">
          <div v-if="previews" :style="previews.div">
            <img :src="previews.url" :style="previews.img" />
          </div>
          <span v-else>裁剪预览区域</span>
        </div>
      </div>
      <div class="clearfix"></div>
      <!-- 操作区域 -->
      <div class="img-button-area">
        <Button type="primary" @click="changeScale(1)">
          <Icon type="plus"></Icon>
        </Button>
        <Button type="primary" @click="changeScale(-1)">
          <Icon type="minus"></Icon>
        </Button>
        <Button type="primary" @click="rotateRight">
          <Icon type="refresh"></Icon>
        </Button>
      </div>
      <!-- 图片格式提示 -->
      <div style="margin-top:10px">
        <span class="hint">
          * 图片格式要求：jpg、jpeg、png，
          <span v-if="sizeHint">建议尺寸： {{ sizeHint }}，</span>
          文件大小为
          <span v-if="fileSize < 1024">{{ fileSize }}kb</span>
          <span v-else>{{ Math.floor(fileSize/1024) }}M</span>
          以内。
        </span>
      </div>
      <!-- 底部按钮 -->
      <div slot="footer">
        <Button type="ghost" @click="hideCropModel">取消</Button>
        <Button type="primary" @click="comfirCropper">确认裁剪</Button>
      </div>
    </Modal>
    <!-- 查看图片弹窗 -->
    <Modal title="查看图片" class="m-view-img" v-model="showModal" width="900">
      <img :src="GLOBAL.ShowImg(getImageUrl)" @error="notFoundPic" />
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
// 组件
import vueCropper from "vue-cropper";
// 图片上传设置
import UploadImg from "mixins/upload_img.js";
// Api
import Api from "api/common.js";

export default {
  name: "imgCropper",
  mixins: [UploadImg],
  components: { vueCropper },
  // 获取父级传值
  props: {
    // 图片Url
    src: {
      type: String,
      default: ""
    },
    // 是否可预览
    preview: {
      type: Boolean,
      default: false
    },
    // 是否显示格式提示
    showFormatHint: {
      type: Boolean,
      default: true
    },
    // 上传按钮尺寸提示文本
    sizeHint: {
      type: String,
      default: "100*100px"
    },
    // 图片文件大小限制，单位KB
    fileSize: {
      type: Number,
      default: 150
    },
    // 固定裁剪宽度
    autoCropWidth: {
      type: Number,
      default: 100
    },
    // 固定裁剪高度
    autoCropHeight: {
      type: Number,
      default: 100
    },
    // 是否限制高宽比例
    fixed: {
      type: Boolean,
      default: false
    },
    // 高宽比例值
    fixedNumber: {
      type: Array,
      default: () => [4, 3]
    },
    // 上传路径： XX/XX/XX/
    uploadDir: {
      type: String,
      default: "img/"
    }
  },
  data() {
    return {
      // 是否显示上传按钮
      showUploadBtn: true,
      // 裁剪图片弹窗
      cropImgModel: {
        title: "裁剪图片",
        show: false
      },
      // 图片配置，参数地址：https://github.com/xyxiao001/vue-cropper
      option: {
        img: "",
        size: 1,
        outputType: "jpg",
        canScale: false,
        autoCrop: true
      },
      // 实时图片预览
      previews: {},
      // 预览样式
      previewStyle: {},
      // 获取图片显示路径
      getImageUrl: ""
    };
  },
  watch: {
    src(val) {
      if (val) {
        this.showUploadBtn = false;
        this.getImageUrl = this.src;
      }
    }
  },
  created() {
    if (this.src) {
      this.showUploadBtn = false;
      this.getImageUrl = this.src;
    }
  },
  methods: {
    // 确认裁剪
    comfirCropper() {
      const fileList = this.$refs.imgFile.files;

      // 上传裁剪图片
      this.$refs.cropper.getCropBlob(data => {
        this.progressShow();

        // 设置定时器累增进度条百分比
        let progress = setInterval(() => {
          if (this.percentage == 90) clearInterval(progress);
          this.percentage += 10;
        }, 100);

        // 将blob转成file
        let file = new window.File([data], fileList[0].name, {
          type: fileList[0].name.type
        });

        // 创建formData对象
        let params = new FormData();
        params.append("dir", this.uploadDir);
        params.append("file", file);

        Api.UploadImg(params)
          .then(res => {
            if (res.code == 200) {
              this.getImageUrl = res.data.url;
              // 传给父组件url
              this.$emit("get-img-url", this.getImageUrl);

              // 停止加载和隐藏进度
              this.progressHide();
              this.hideCropModel();
              this.percentage = 100;
              clearInterval(progress);

              this.$Notice.success({ title: "图片上传成功!" });
            } else {
              this.errorTip(progress);
              this.hideCropModel();
            }
          })
          .catch(err => {
            this.errorTip(progress);
            this.hideCropModel();
          });
      });
    },
    // 取消上传
    hideCropModel() {
      this.cropImgModel.show = false;
      this.$refs.cropper.clearCrop();
      this.option.img = "";
    },
    // 选择文件
    selectFile() {
      // 获取上传文件列表
      const fileList = this.$refs.imgFile.files;

      if (fileList.length > 0) {
        let fileName = fileList[0].name;
        // 将文件大小字节转成kb
        let fileSize = Math.floor(fileList[0].size / 1024);

        let maxSize = this.fileSize;
        let overHint = maxSize + "kb";
        // 控制文件大小
        if (fileSize > maxSize) {
          if (maxSize > 1024) overHint = Math.floor(maxSize / 1024) + "M";
          this.$Notice.warning({
            title: "超出文件大小限制",
            desc: "文件 " + fileName + " 太大，不能超过 " + overHint
          });
          this.progressHide();
          return false;
        }

        // 显示裁剪弹窗
        this.cropImgModel.show = true;

        let file = fileList[0];
        // FileReader API ：获取图片的base64 代码 并预览
        let reader = new FileReader();
        reader.onload = e => {
          let data;
          if (typeof e.target.result === "object") {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]));
          } else {
            data = e.target.result;
          }

          this.option.img = data;

          // 设置高度显示图片裁剪区域
          const imgCropperArea = document.getElementsByClassName(
            "img-cropper-area"
          );

          if (imgCropperArea.length) {
            imgCropperArea[0].style.height = "500px";
          }
        };
        // 转化为base64
        // reader.readAsDataURL(file);
        // 转化为blob
        reader.readAsArrayBuffer(file);
      } else console.log("获取不到文件列表");
    },
    // 图片缩放
    changeScale(num) {
      this.$refs.cropper.changeScale(num);
    },
    // 图片旋转
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    // 实时预览函数
    realTime(data) {
      this.previews = data;
      // 设置预览样式，缩放显示
      this.previewStyle = {
        width: data.w + "px",
        height: data.h + "px",
        overflow: "hidden",
        margin: "0 auto",
        zoom: 0.6
      };
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/upload_img";

.img-cropper-area {
  width: 500px;
  float: left;
  margin-right: 35px;
}

.img-preview-area {
  min-width: 100px;
  min-height: 50px;
  line-height: 50px;
  text-align: center;
  border: 1px dashed #ddd;
  overflow: hidden;
  float: left;

  img {
    width: 100%;
  }

  .preview {
    width: 100%;
    overflow: hidden;
  }
}

.img-button-area {
  margin-top: 10px;

  button {
    margin-right: 10px;
  }
}

.upload-show {
  margin-bottom: 0;
}

/deep/.cropper-modal {
  background: rgba(0, 0, 0, 0.8);
}
</style>
