// 'use strict';

const Controller = require('egg').Controller;

// 文件操作对象
const fs = require('fs');
// 路径操作对象
const path = require('path');

const sendToWormhole = require('stream-wormhole');
const crypto = require('crypto');

class StorageServiceController extends Controller {

    /**
     * 读取路径信息
     * 判断路径是否存在，不存在返回false
     * 
     * @param {*} path 路径地址
     */
    async getStat(path){
        return new Promise((resolve, reject) => {
            fs.stat(path, (err, stats) => {
                if(err) resolve(false); 
                else resolve(stats);
            })
        })
    }

    /**
     * 根据dir创建路径
     * 
     * @param {*} dir 路径地址
     */
    async mkdir(dir){
        return new Promise((resolve, reject) => {
            fs.mkdir(dir, err => {
                if(err) resolve(false); 
                else resolve(true); 
            })
        })
    }

    /**
     * 根据路径地址，判断路径是否存在，不存在则创建
     * 
     * @param {*} dir 路径地址
     */
    async dirExists(dir){
        let isExist = await this.getStat(dir);
        // 如果该路径且不是文件，返回true
        if(isExist && isExist.isDirectory()){
            return true;
        }
        // 如果该路径存在但是文件，返回false
        else if(isExist){
            return false;
        }
        // 如果该路径不存在
        let tempDir = path.parse(dir).dir;// 拿到上级路径
        // 递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
        let status = await this.dirExists(tempDir);
        let mkdirStatus;
        if(status){
            mkdirStatus = await this.mkdir(dir);
        }
        return mkdirStatus;
    }

    /**
     * 根据配置的dir返回文件存储路径
     * 
     * @param {*} dir 路径地址
     */
    async fileExists(path) {
        return new Promise((resolve, reject) => {
            // 判断文件是否存在
            fs.exists(path, (exists) => {
                if(exists) resolve(true);
                else resolve(false);
            });
        });
    }
    
    /**
     * 上传功能，写入文件
     * 
     * @param {*} stream 文件流
     * @param {*} dir 路径地址
     */
	async upload(stream, dir) {
        // 获取存储路径
        let currentPath;

        if(dir){
            await this.dirExists(`app/public/upload/${dir}`);
            currentPath = path.join(this.config.baseDir, `app/public/upload/${dir}`);
        }
        else{
            currentPath = path.join(this.config.baseDir, `app/public/upload/`);
        }

        return new Promise((resolve, reject) => {
            // 获取文件扩展名
            const suffixName = path.extname(stream.filename).toLocaleLowerCase();            
            // 获取文件名（包含后缀的）
            let getFileName = stream.filename;
            // 去除后缀名，保留原始文件名称
            getFileName = getFileName.substr(0, getFileName.length - suffixName.length);

            // 临时文件名: 时间戳 + 原文件名MD5值 + 扩展名
            const tempFileName = new Date().getTime() + crypto.createHash('md5').update(getFileName).digest('hex') + suffixName;

            //生成一个文件写入 文件流
            const writeStream = fs.createWriteStream(`${currentPath}${tempFileName}`);
            stream.pipe(writeStream);

            const md5Hash = crypto.createHash('md5');
            let errFlag = false;

            // 文件获取中，拿到buffer
            stream.on('data', function(chunk) {
                md5Hash.update(chunk);
            });
            // 文件获取失败
            stream.on('error', function(err) {
                errFlag = true;
                sendToWormhole(stream);
                reject(err);
            });

            // 文件写入完成
            writeStream.on('finish', function() {
                if(errFlag){
                    // 删除写入的文件
                    fs.rmdir(`${currentPath}${tempFileName}`, err => {
                        if(err) console.log(err);
                    });
                    return false;
                }

                const fileName = md5Hash.digest('hex').toUpperCase() + suffixName;
                // 重命名文件
                fs.rename(`${currentPath}${tempFileName}`,`${currentPath}${fileName}`, err => {
                    if(err) console.log(err);
                });
                if(dir){
                    resolve({ file: fileName, name: getFileName });
                }
            });
            // 文件写入失败
            writeStream.on('error', function(err){
                sendToWormhole(stream);
                reject(err);
            });
        })
    }

    /**
     * 上传图片，上传成功返回url和文件名
     */
    async uploadImg() {
        let res = {};
        // 获取文件流
        const stream = await this.ctx.getFileStream();
        let dir = stream.fields.dir ? stream.fields.dir : 'img/';

        await this.upload(stream, dir).then(data => {
            res = {
                code: 200,
                data: {
                    url: `/public/upload/${dir}${data.file}`,
                    name: data.name
                },
                msg: ''
            }
        }).catch(() => {
            res = {
                code: 404,
                data: [],
                msg: '图片上传失败'
            }
        });
		this.ctx.body = res;
    }
    
    // 获取图片文件并返回给客户端
    // 旧版读取文件流显示图片，IE中请求获取图片流失效，已改成相对路径方法
	// async getImgFile() {
    //     const fileName = this.ctx.query.img;
    //     // 找到图片存放的位置
    //     const target = path.join(this.config.baseDir, 'app/public/upload/img/', fileName);
    //     let res = { code: 404, data: [], msg: '文件不存在' };
    //     let isExist = await this.fileExists(target).then(res => { return res }).catch(err => { return err });
    //     // 文件存在则读取文件流
    //     if(isExist){
    //         //读取文件流
    //         res = fs.createReadStream(target);
    //     }
    //     // 返回绝对路径
    //     this.ctx.body = res;
    // }
}

module.exports = StorageServiceController;