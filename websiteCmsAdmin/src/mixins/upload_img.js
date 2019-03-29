/*
 * 模块 : 图片上传相关配置
 * 作者 : 罗永梅（381612175@qq.com）
 * 日期 : 2017-9-7
 * 版本 : version 1.0
 */
import Common from 'common/common.js'

export default {
	data() {
		return{
            // 可接受的图片上传格式
            format: ['image/jpg', 'image/jpeg', 'image/png'],
            // 上传状态，上传成功完成为finished
            uploadStatus: '',
            // 上传状态，上传成功完成为finished
            uploadStatus: '',
            // 是否显示进度条
            showProgress: false,
            // 上传加载
            loading: false,
            // 是否显示弹窗
            showModal: false,
            // 显示遮罩
            showMask: false,
            // 上传进度
            percentage: 0,
            // 获取显示的图片Url
            getImageUrl: ''
        }
    },
    created(){},
	methods: {
		// 查看图片
        viewImage(){
            this.showModal = true;
        },
        // 上传按钮点击事件
        uploadClick(){
            // 触发上传按钮点击事件
            this.$refs.imgFile.click();
        },
        // 选择文件
        selectFile(){
            // 获取上传文件列表
            const fileList = this.$refs.imgFile.files;
            if(fileList.length > 0){
                let fileName = fileList[0].name;
                // 将文件大小字节转成kb
                let fileSize = Math.floor(fileList[0].size / 1024);

                let maxSize = this.fileSize;                
                let overHint = maxSize + 'kb';
                // 控制文件大小
                if(fileSize > maxSize){
                    if(maxSize > 1024) overHint = Math.floor(maxSize/1024) + 'M';
                    this.$Notice.warning({
                        title: '超出文件大小限制',
                        desc: '文件 ' + fileName + ' 太大，不能超过 ' + overHint
                    });
                    this.progressHide();
                    return false;
                }
                this.uploadFile(fileList[0]);
            }
            else console.log('获取不到文件列表');
        },
        // 显示进度条
        progressShow(){
            this.loading = true;
            this.uploadStatus = '';
            this.percentage = 0;
            this.showProgress = true;
        },
        // 隐藏进度条
        progressHide(){
            this.loading = false;
            this.uploadStatus = 'finished';
            this.showProgress = false;
        },
        // 无法显示图片
        notFoundPic(event){
            Common.SetDefaultPic(event, 2);
        },
        // 错误提示
        errorTip(progress){
            // 停止加载和隐藏进度条
            this.progressHide();                 
            clearInterval(progress);
            this.$Notice.error({ title: '图片上传失败，请重试！' });
        }
	}
}