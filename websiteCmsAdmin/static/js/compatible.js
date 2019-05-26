/*
 * 功能 : 解决部分兼容性问题
 * 日期 : 2019-5-26
 * 版本 : version 1.0
 */

var isIE9 = function(){
    return (window.navigator.userAgent.indexOf("MSIE 9.0")>=1);
}

// 修复IE9不支持performance.now()，导致tranfer无效
if (isIE9() && window.performance) {
    window.performance.now = function() {
        return ((+new Date()) - performance.timing.navigationStart);
    }
}

// 解决ie11以下不支持dataset属性
if (window.HTMLElement) {
    if (Object.getOwnPropertyNames(HTMLElement.prototype).indexOf('dataset') === -1) {
        Object.defineProperty(HTMLElement.prototype, 'dataset', {
            get: function () {
                var attributes = this.attributes; //获取节点的所有属性
                var name = [],
                    value = []; //定义两个数组保存属性名和属性值
                var obj = {}; //定义一个空对象
                for (var i = 0; i < attributes.length; i++) { //遍历节点的所有属性
                    if (attributes[i].nodeName.slice(0, 5) == 'data-') { //如果属性名的前面5个字符符合"data-"
                        // 取出属性名的"data-"的后面的字符串放入name数组中
                        name.push(attributes[i].nodeName.slice(5));
                        //取出对应的属性值放入value数组中
                        value.push(attributes[i].nodeValue);
                    }
                }
                for (var j = 0; j < name.length; j++) { //遍历name和value数组
                    obj[name[j]] = value[j]; //将属性名和属性值保存到obj中
                }
                return obj; //返回对象
            }
        });
    }
}