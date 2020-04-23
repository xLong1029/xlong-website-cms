/*
 * 功能 : 响应式配置
 * 作者 : 罗永梅（381612175@qq.com）
 * 日期 : 2018-12-6
 * 版本 : version 1.0
 */
(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth,
                clientHeight = docEl.clientHeight;
            if (!clientWidth) return;
            if(clientWidth > 768){
                docEl.style.fontSize = '37.5px';
            }
            else{
                docEl.style.fontSize = clientWidth / 10 + 'px';

                // 文章内的图片宽度设置为100%
                var articleCont = document.getElementById('articleCont');
                if(articleCont){
                    var getArticleImg = articleCont.getElementsByTagName('img');
                    for(let i = 0; i < getArticleImg.length; i ++){
                        getArticleImg[i].style.width = '100%';
                    }
                }
            }
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);