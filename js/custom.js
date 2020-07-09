// baidu 站点推送 
(function(){
var canonicalURL, curProtocol;
//Get the <link> tag
var x=document.getElementsByTagName("link");
//Find the last canonical URL
if(x.length > 0){
    for (i=0;i<x.length;i++){
        if(x[i].rel.toLowerCase() == 'canonical' && x[i].href){
            canonicalURL=x[i].href;
        }
    }
}
//Get protocol
if (!canonicalURL){
    curProtocol = window.location.protocol.split(':')[0];
} else {
    curProtocol = canonicalURL.split(':')[0];
}
//Get current URL if the canonical URL does not exist
if (!canonicalURL) canonicalURL = window.location.href;
//Assign script content. Replace current URL with the canonical URL
!function(){var e=/([http|https]:\/\/[a-zA-Z0-9\_\.]+\.baidu\.com)/gi,r=canonicalURL,t=document.referrer;if(!e.test(r)){var n=(String(curProtocol).toLowerCase() === 'https')?"https://sp0.baidu.com/9_Q4simg2RQJ8t7jm9iCKT-xh_/s.gif":"//api.share.baidu.com/s.gif";t?(n+="?r="+encodeURIComponent(document.referrer),r&&(n+="&l="+r)):r&&(n+="?l="+r);var i=new Image;i.src=n}}(window);
})();

// 图片懒加载
// onload是等所有的资源文件加载完毕以后再绑定事件
window.onload = function(){
	// 获取图片列表，即img标签列表
	var imgs = document.querySelectorAll('img');

	// 获取到浏览器顶部的距离
	function getTop(e){
		return e.offsetTop;
	}

	// 懒加载实现
	function lazyload(imgs){
		// 可视区域高度
		var h = window.innerHeight;
		//滚动区域高度
		var s = document.documentElement.scrollTop || document.body.scrollTop;
		for(var i=0;i<imgs.length;i++){
			//图片距离顶部的距离大于可视区域和滚动区域之和时懒加载
			if ((h+s)>getTop(imgs[i])) {
				// 真实情况是页面开始有2秒空白，所以使用setTimeout定时2s
				(function(i){
					setTimeout(function(){
						// 不加立即执行函数i会等于9
						// 隐形加载图片或其他资源，
						//创建一个临时图片，这个图片在内存中不会到页面上去。实现隐形加载
						var temp = new Image();
						temp.src = imgs[i].getAttribute('data-src');//只会请求一次
						// onload判断图片加载完毕，真是图片加载完毕，再赋值给dom节点
						temp.onload = function(){
							// 获取自定义属性data-src，用真图片替换假图片
							imgs[i].src = imgs[i].getAttribute('data-src')
						}
					},2000)
				})(i)
			}
		}
	}
	lazyload(imgs);

	// 滚屏函数
	window.onscroll =function(){
		lazyload(imgs);
	}
}