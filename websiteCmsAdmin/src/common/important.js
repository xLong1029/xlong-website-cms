/*
 * 功能 : 封装一些重要函数
 * 作者 : 罗永梅（381612175@qq.com）
 * 日期 : 2017-8-31
 * 版本 : version 1.0
 */
// 设置cookie
export function SetCookie(cname, cvalue, exdays){
    if(exdays){
        let d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/;";
    }else{
        document.cookie = cname + "=" + cvalue + "; " + "; path=/;";
    }
}
// 获取cookie
export function GetCookie(cname){
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i ++) {
        let c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}
// 删除cookie
export function DelCookie(cname){
    document.cookie = `${cname} = null; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}
// localstorage写入本地缓存
export function SetLocalS(key,value){
    localStorage.setItem(key, value);
}
// localstorage获取本地缓存
export function GetLocalS(key,value){
    let res = localStorage.getItem(key);
    if(res && res!='null') return res;
    else return false;
}
// localstorage删除本地储存
export function DelLocalS(key){
    localStorage.removeItem(key);
}
// localstorage清空本地储存
export function ClearLocalS(){
    localStorage.clear();
}
// 获取url传值参数
export function GetUrlQuery(name, thisUrl){
    let reg = new RegExp("(^|\\?|&)"+ name +"=([^&]*)(\\s|&|$)", "i"), url = thisUrl || location.href;
　　if (reg.test(url)) return decodeURI(RegExp.$2.replace(/\+/g, " "));
　　else return false;
}
// 获取参数值
export function GetParams(params){
    let obj = { key : [], value: [] };
    for(let i in params){
        obj.key.push(i);
        obj.value.push(params[i]);
    }
    return obj;
}
// 加密（简单模拟）
export function Encrypt(value){
    let code = '';
    for (let i = 0; i < value.length; i++) {
        let r = value.charCodeAt(i);
        code += String.fromCharCode(r + 2);
    }
    // 对字符串进行特殊字符编码，分号（;）、逗号（,）、等号（=）以及空格问题
    return escape(code);
}
// 解密（简单模拟）
export function Decrypt(value){
    // 对字符串进行特殊字符解码，分号（;）、逗号（,）、等号（=）以及空格问题
    value = unescape(value);
    let correct = '';
    for (let i = 0; i < value.length; i++) {
        let r = value.charCodeAt(i);
        correct += String.fromCharCode(r - 2);
    }
    return correct;
}
// 数组深克隆
export function CopyArr(arr){
    let copy = JSON.stringify(arr);
    return JSON.parse(copy);
}
// 数组转字符串：arr 字符串，l 拼接符
export function ArrToStr(arr, l){
    return arr.join(l);
}
// 字符串转数组：string 字符串，s 分隔符
export function StrToArr(string, s){
    return string.split(s);
}
// 数组去重
export function UniqueArr(arr){
    const res = new Map();
    return arr.filter(a => !res.has(a) && res.set(a, 1))
}
// 数组去空
export function ArrRemovEmpty(arr){
    return arr.filter(a => {
        if(a != '' && a != null || a != undefined) return a;
    });
}

// 删除数组指定某个元素
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};