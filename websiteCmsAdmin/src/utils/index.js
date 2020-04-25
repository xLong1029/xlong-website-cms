/* eslint-disable */
/*
 * 功能 : 封装一些主要工具方法
 * 作者 : 罗永梅（381612175@qq.com）
 * 日期 : 2019-9-25
 * 版本 : version 3.0
 */

/**
 * 设置cookie
 *
 * @param {*} cname key名
 * @param {*} cvalue 值
 * @param {*} exdays 过期时间，以毫秒计
 */
export function SetCookie(cname, cvalue, exdays) {
  if (exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
  } else {
    document.cookie = cname + "=" + cvalue + "; ";
  }
}

/**
 * 获取cookie
 *
 * @param {*} cname key名
 */
export function GetCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
}

/**
 * 删除cookie
 *
 * @param {*} cname  key名
 * @param {*} path  path
 */
export function DelCookie(cname, path = '/') {
  document.cookie = `${cname}=''; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
}

/**
 * localstorage写入本地缓存
 *
 * @param {*} key key名
 * @param {*} value 值
 */
export function SetLocalS(key, value) {
  localStorage.setItem(key, value);
}

/**
 * localstorage获取本地缓存
 *
 * @param {*} key key名
 */
export function GetLocalS(key) {
  let res = localStorage.getItem(key);
  if (res && res != 'null') return res;
  else return false;
}

/**
 * localstorage删除本地储存
 *
 * @param {*} key key名
 */
export function DelLocalS(key) {
  localStorage.removeItem(key);
}

/**
 * localstorage清空所有本地储存
 */
export function ClearLocalS() {
  localStorage.clear();
}

/**
 * 获取url传值参数
 *
 * @param {*} name 参数名
 * @param {*} thisUrl url地址，若不传则获取当前地址
 */
export function GetUrlQuery(name, thisUrl) {
  let reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i"),
    url = thisUrl || location.href;
  if (reg.test(url)) return decodeURI(RegExp.$2.replace(/\+/g, " "));
  else return false;
}

/**
 * 获取参数值
 *
 * @param {*} params 参数对象
 */
export function GetParams(params) {
  return {
    key: Object.keys(params),
    value: Object.values(params)
  };
}

/**
 * 删除对象指定属性
 *
 * @param {*} obj 对象
 * @param {*} uselessKeys 不需要的属性序列
 */
export function ObjOmit(obj, uselessKeys) {
  uselessKeys.forEach(key => delete obj[key]);
  return obj;
}

/**
 * 加密（简单模拟）
 *
 * @param {*} value 值
 */
export function Encrypt(value) {
  let code = '';
  for (let i = 0; i < value.length; i++) {
    let r = value.charCodeAt(i);
    code += String.fromCharCode(r + 2);
  }
  // 对字符串进行特殊字符编码，分号（;）、逗号（,）、等号（=）以及空格问题
  return escape(code);
}

/**
 * 解密（简单模拟）
 *
 * @param {*} value 值
 */
export function Decrypt(value) {
  // 对字符串进行特殊字符解码，分号（;）、逗号（,）、等号（=）以及空格问题
  value = unescape(value);
  let correct = '';
  for (let i = 0; i < value.length; i++) {
    let r = value.charCodeAt(i);
    correct += String.fromCharCode(r - 2);
  }
  return correct;
}

/**
 * 判断指定节点是否包含某个class类名
 *
 * @param {*} node 节点
 * @param {*} className 类名
 */
export function HasClass(node, className) {
  var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
  return node.className.match(reg);
}

/**
 * 给指定节点添加class类名
 *
 * @param {*} node 节点
 * @param {*} className 类名
 */
export function AddClass(node, className) {
  if (!HasClass(node, className)) {
    node.className += ' ' + className;
  }
}

/**
 * 给指定节点移除class类名
 *
 * @param {*} node 节点
 * @param {*} className 类名
 */
export function RemoveClass(node, className) {
  if (HasClass(node, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
    node.className = node.className.replace(reg, ' ');
  }
}

/**
 * 给指定节点切换class类名，若存在则移除，若不存在则添加
 *
 * @param {*} node 节点
 * @param {*} className 类名
 */
export function ToggleClass(node, className) {
  if (HasClass(node, className)) {
    RemoveClass(node, className);
  } else {
    AddClass(node, className);
  }
}

/**
 * 返回某个节点的所有兄弟节点
 *
 * @param {*} node 节点
 */
export function SiblingsNode(node) {
  let a = [];
  let p = node.parentNode.children;
  for (let i = 0, pl = p.length; i < pl; i++) {
    if (p[i] !== node) a.push(p[i]);
  }
  return a;
}

/**
 * 让节点向上滑行
 *
 * @param {*} node 节点
 * @param {*} height 原始高度
 * @param {*} duration 持续时间，以毫秒计
 */
export function SlideUp(node, height, duration) {
  // 解决slideUp闪现问题
  node.setAttribute('style', `height: ${height}px`);
  setTimeout(() => {
    const time = duration / 1000;
    const style = `height: 0; transition: height ${time}s; -o-transition: height ${time}s; -webkit-transition: height ${time}s; -ms-transition: height ${time}s; -moz-transition: height ${time}s;`;
    node.setAttribute('style', style);
  }, 0);
}

/**
 * 让节点向下滑行
 *
 * @param {*} node 节点
 * @param {*} height 高度
 * @param {*} duration 持续时间，以毫秒计
 */
export function SlideDown(node, height, duration) {
  const time = duration / 1000;
  const style = `height: ${height}px; transition: height ${time}s; -o-transition: height ${time}s; -webkit-transition: height ${time}s; -ms-transition: height ${time}s; -moz-transition: height ${time}s;`;
  node.setAttribute('style', style);
}

/**
 * 数组深克隆
 *
 * @param {*} arr 操作数组
 */
export function CopyArr(arr) {
  let copy = JSON.stringify(arr);
  return JSON.parse(copy);
}

/**
 * 数组转字符串
 *
 * @param {*} arr 数组
 * @param {*} l 拼接符
 */
export function ArrToStr(arr, l) {
  return arr.join(l);
}

/**
 * 字符串转数组
 *
 * @param {*} string 字符串
 * @param {*} s 分隔符
 */
export function StrToArr(string, s) {
  return string.split(s);
}

/**
 * 数组去重
 *
 * @param {*} arr 数组
 */
export function UniqueArr(arr) {
  const res = new Map();
  return arr.filter(a => !res.has(a) && res.set(a, 1))
}

/**
 * 数组去空
 *
 * @param {*} arr 数组
 */
export function ArrRemovEmpty(arr) {
  return arr.filter(a => {
    if (a != '' && a != null || a != undefined) return a;
  });
}

/**
 * 比较日期大小
 *
 * @param {*} dateOne 第一个日期
 * @param {*} dateTwo 第二个日期
 */
export function CompareDate(dateOne, dateTwo) {
  // 字符串
  if (typeof (dateOne) == 'string' && typeof (dateTwo) == 'string') {
    return ((new Date(dateOne.replace(/-/g, "\/"))) <= (new Date(dateTwo.replace(/-/g, "\/"))));
  }
  // DATE对象
  else if (typeof (dateOne) == 'object' && typeof (dateTwo) == 'object') return (dateOne <= dateTwo);
  else {
    console.log('日期比较格式不统一');
    return false;
  }
}
/**
 * 日期设置--用于iView的DatePicker的daterange类型数据配置，和Vue版本冲突，Vue2.4版本以上不可用
 *
 * @param {*} type 1 最近一周，2 最近一个月，3 最近三个月
 */
export function SetDate(type) {
  const end = new Date();
  const start = new Date();
  switch (type) {
    case 1: {
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    }
    case 2: {
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    }
    case 3: {
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    }
    default: console.log('get pic error'); return false;
  }
}

/**
 * 日期格式化
 *
 * @param {*} date 日期
 */
export function FormatDate(date) {
  if (!date) return;
  if (typeof date == 'string' && date.indexOf('-') != -1) return date;
  else {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
    let minute = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
    let second = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
    return year + "-" + month + "-" + day + ' ' + hour + ':' + minute + ':' + second;
  }
}

/**
 * 设置默认图片
 *
 * @param {*} event 当前对象
 * @param {*} type 1 显示默认头像，2 显示暂无图片
 */
export function SetDefaultPic(event, type) {
  switch (type) {
    case 1: event.currentTarget.src = require('assets/images/default-face.jpg'); break;
    case 2: event.currentTarget.src = require('assets/images/no-found-pic.jpg'); break;
    default: console.log('get pic error'); return false;
  }
  //控制不要一直跳动
  event.currentTarget.onerror = null;
}

/**
 * 启动全屏
 *
 * @param {*} element 当前对象
 */
export function LaunchFullScreen(element) {
  if (element.requestFullscreen) element.requestFullscreen();
  else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
  else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
  else if (element.msRequestFullscreen) element.msRequestFullscreen();
}

/**
 * 退出全屏
 */
export function ExitFullscreen() {
  if (document.exitFullscreen) document.exitFullscreen();
  else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
  else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
}

// 删除数组指定某个元素
Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
