<template>
  <div class="m-tinymce">
	<textarea :id="id"></textarea>
	<!-- 图片上传进度 -->
	<Upload
		ref="upload"
		action="/api/WebsiteCms/StorageService/Img/Upload"
		:headers="headers"
		:on-success="handleSuccess"
		:on-error="handleError"
		:on-format-error="handleFormatError"
		:format="['jpg','jpeg','png']"
		style="visible: hidden"
	>
		<div ref="uploadBtn"></div>
	</Upload>
  </div>
</template>

<script type="text/ecmascript-6">
/* eslint-disable */
import { GetCookie } from 'utils'
import "tinymce/tinymce";
import "../../assets/js/tinymce-langs/zh_CN";
import '../../assets/js/tinymce-plugins/placeholder/plugin.js'
import "tinymce/themes/modern/theme";
//import 'tinymce/skins/lightgray/skin.min.css'
//import 'tinymce/skins/lightgray/content.min.css'
import "tinymce/plugins/advlist/plugin.js";
import "tinymce/plugins/autolink/plugin.js";
import "tinymce/plugins/lists/plugin.js";
import "tinymce/plugins/link/plugin.js";
import "tinymce/plugins/image/plugin.js";
import "tinymce/plugins/charmap/plugin.js";
import "tinymce/plugins/print/plugin.js";
import "tinymce/plugins/preview/plugin.js";
import "tinymce/plugins/anchor/plugin.js";
import "tinymce/plugins/searchreplace/plugin.js";
import "tinymce/plugins/visualblocks/plugin.js";
import "tinymce/plugins/code/plugin.js";
import "tinymce/plugins/fullscreen/plugin.js";
import "tinymce/plugins/insertdatetime/plugin.js";
import "tinymce/plugins/table/plugin.js";
import "tinymce/plugins/contextmenu/plugin.js";
import "tinymce/plugins/paste/plugin.js";
import "tinymce/plugins/textcolor/plugin.js";
import "tinymce/plugins/colorpicker/plugin.js";

export default {
	data() {
		return {
			id: "tinymce__" + Date.now(),
			// 获取上图片节点
			imgUrlId: "",
			headers: {
				token: GetCookie('xlong_token')
			}
		};
	},
	props: ["value", "width", "height", "menubar", "toolbar", "placeholder"],
	watch: {
		value(val) {
			// 当传入值变化时更新富文本内容
			tinymce.get(this.id).setContent(val);
		}
	},
	mounted() {
		tinymce.init({
			selector: `#${this.id}`,
			height: this.height || 300,
			width: this.width || "100%",
			valid_children: "+body[style]",
			skin_url: "https://cdn.bootcss.com/tinymce/4.5.8/skins/lightgray",
			menubar: this.menubar === undefined ? true : this.menubar,
			// 使用插件
			plugins: [
				"advlist autolink lists link image charmap print preview anchor",
				"searchreplace visualblocks code fullscreen",
				"insertdatetime table contextmenu paste code textcolor colorpicker",
				"placeholder"
			],
			// 占位符设置
			placeholder: this.placeholder || '',
			placeholder_attrs: { style: {position: 'absolute', top:'5px', left:0, color: '#bbbec8', padding: '1%', width:'98%', overflow: 'hidden', 'white-space': 'pre-wrap'} },
			// 工具栏设置
			toolbar: this.toolbar || "insertfile undo redo | styleselect | fontsizeselect | bold italic | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image link | code | preview fullscreen ",
			// 上传设置
			file_browser_callback: (field_name, url, type, win) => {
				if (type == "file") {
					this.$Message.warning('功能暂未开放');
				}
				if (type == "image") {
					this.$refs.uploadBtn.click();
					this.imgUrlId = field_name;
				}
			},
			//TinyMCE 会将所有的 font 元素转换成 span 元素
			convert_fonts_to_spans: true,
			//换行符会被转换成 br 元素
			convert_newlines_to_brs: false,
			//在换行处 TinyMCE 会用 BR 元素而不是插入段落
			force_br_newlines: false,
			//当返回或进入 Mozilla/Firefox 时，这个选项可以打开/关闭段落的建立
			//force_p_newlines: false,
			//这个选项控制是否将换行符从输出的 HTML 中去除。选项默认打开，因为许多服务端系统将换行转换成，因为文本是在无格式的 textarea 中输入的。使用这个选项可以让所有内容在同一行。
			//remove_linebreaks: false,
			//不能把这个设置去掉，不然图片路径会出错
			relative_urls: false,
			//允许拖动大小
			resize: true,
			//font_formats: "微软雅黑=微软雅黑;宋体=宋体;黑体=黑体;仿宋=仿宋;楷体=楷体;隶书=隶书;幼圆=幼圆;Arial=arial,helvetica,sans-serif;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Tahoma=tahoma,arial,helvetica,sans-serif;Times New Roman=times new roman,times;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats",
			fontsize_formats: "8px 10px 12px 14px 18px 24px 36px",
			setup: editor => {
				// 初次化编辑器
				editor.on("init", () => {
					// 设置默认值
					editor.setContent(this.value || "");
					// 注册事件
					editor.on("blur undo redo", () => {
						// 获得编辑结果
						//this.setCon=editor.getContent();
						this.$emit("input", editor.getContent());
					});
					editor.on("blur", () => {
						this.$emit("blur");
					});
				});
			}
		});
	},
	methods: {
		//结束时的处理
		handleOver() {
			this.$refs.upload.clearFiles();
		},
		//图片上传成功
		handleSuccess(res, file) {
			if (res.code == 200) {
				let inputImgUrl = document.getElementById(this.imgUrlId);
				inputImgUrl.value = this.GLOBAL.BASE_URL + res.data.url;
				//触发change事件
				if (document.createEventObject) {
					// IE浏览器支持fireEvent方法
					let evt = document.createEventObject();
					inputImgUrl.fireEvent("onchange", evt);
				}
				else {
					// 其他标准浏览器使用dispatchEvent方法
					let evt = document.createEvent("HTMLEvents");
					evt.initEvent("change", true, true);
					inputImgUrl.dispatchEvent(evt);
				}
				this.$Notice.success({ title: '图片上传成功!' });
			}
			else  this.$Notice.error(res.msg);
			this.handleOver();
		},
		//错误
		handleError(error, file) {
			this.$Notice.success({ title: '图片上传失败!' });
			this.handleOver();
		},
		handleFormatError(file) {
			this.$Notice.error({
				title: "格式不正确",
				desc: "文件" + file.name + "格式不正确，请上传 jpg 或 png 格式的图片。"
			});
			this.handleOver();
		}
	},
	beforeDestroy() {
		tinymce.remove(this.id);
	}
};
</script>
<style lang="less">
.m-tinymce > div {
	box-sizing: border-box;
}
.mce-window {
	z-index: 1001 !important;
}
#mce-modal-block {
	z-index: 1000 !important;
}
.tinymce__modalProgress {
	.ivu-modal-mask,
	.ivu-modal-wrap {
		z-index: 1010;
	}
}
.mce-fullscreen {
	.header,
	.side-bar {
		visibility: hidden;
	}
}
.ivu-form-item-error .mce-tinymce {
	border-color: #ed3f14;
}
.mce-branding {
	display: none !important;
}
</style>
