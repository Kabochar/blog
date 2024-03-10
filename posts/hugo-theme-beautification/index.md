# Hugo Maupassant 主题美化


博客来源于飞雪老大的 Maupassant 主题。虽然原 Maupassant 模板已经很强大了，但是个人觉得一些小的体验内容稍有欠缺，所以为此找了不少文章进行美化。下面将会列出本博客在 Maupassant 主题上添加的一些美化操作，希望能从中找到你需要的。 

## 文章加密

```html
{{ $password := .Params.Password | default "" }}
{{ if ne $password "" }}
	<script>
		(function(){
			if({{ $password }}){
				if (prompt('请输入文章密码') != {{ $password }}){
					alert('密码错误！');
					if (history.length === 1) {
						window.opener = null;
						window.open('', '_self');
						window.close();
					} else {
						history.back();
					}
				}
			}
		})();
	</script>
{{ end }}
```

参考地址：

https://lewky.cn/posts/hugo-3.html/#%E6%B7%BB%E5%8A%A0%E6%96%87%E7%AB%A0%E5%8A%A0%E5%AF%86%E5%8A%9F%E8%83%BD

## 代码段添加 复制Copy 按钮

```html
<style>
    .highlight {
        position: relative;
    }
    .highlight pre {
        padding-right: 75px;
    }
    .highlight-copy-btn {
        position: absolute;
        bottom: 7px;
        right: 7px;
        border: 0;
        border-radius: 4px;
        padding: 1px;
        font-size: 0.8em;
        line-height: 1.8;
        color: #fff;
        min-width: 55px;
        text-align: center;
        background-color: #607d8b99;
    }
</style>
<script defer>
    (function() {
        'use strict';
      
        if(!document.queryCommandSupported('copy')) {
          return;
        }
      
        function flashCopyMessage(el, msg) {
          el.textContent = msg;
          setTimeout(function() {
            el.textContent = "Copy";
          }, 1000);
        }
      
        function selectText(node) {
          var selection = window.getSelection();
          var range = document.createRange();
          range.selectNodeContents(node);
          selection.removeAllRanges();
          selection.addRange(range);
          return selection;
        }
      
        function addCopyButton(containerEl) {
          var copyBtn = document.createElement("button");
          copyBtn.className = "highlight-copy-btn";
          copyBtn.textContent = "Copy";
      
          var codeEl = containerEl.firstElementChild;
          copyBtn.addEventListener('click', function() {
            try {
              var selection = selectText(codeEl);
              document.execCommand('copy');
              selection.removeAllRanges();
      
              flashCopyMessage(copyBtn, 'Copied!')
            } catch(e) {
              console && console.log(e);
              flashCopyMessage(copyBtn, 'Failed :\'(')
            }
          });
      
          containerEl.appendChild(copyBtn);
        }
      
        // Add copy button to code blocks
        var highlightBlocks = document.getElementsByClassName('highlight');
        Array.prototype.forEach.call(highlightBlocks, addCopyButton);
      })();
</script>
```

参考地址

https://huangzhongde.cn/post/2020-02-21-hugo-code-copy-to-clipboard/

## 站内滚动公告栏

themes\maupassant\layouts\partials\footer.html

```html
{{partial "site_board" . }}

<div class="site-board">
    <div class="station-msg" id="msg">
      <ul>
        <li id="msg-content">欢迎来到卡布茶博客</li>
        <li>愿客官从中发现精彩~~~~</li>
      </ul>
  </div>
  <style type="text/css">
  	.site-board {
		  height: 25px;
	  }
    .site-board .station-msg {
      float: left;
      width: 5%;
      height: 25px;
    }
    .site-board .station-msg img {
      width: 20px;
      height: 20px;
      float: right;
      margin-top: 5px;
    }
    .site-board .station-msg {
      float: left;
      width: 93%;
      height: 25px;
      text-indent: 1em;
      overflow: hidden;
    }

    #msg ul {
      width: 100%;
      height: auto;
      list-style: none;
      padding: 0;
      margin: 0;
    }
    #msg ul li {
      width: 100%;
      height: 25px;
      font-size: 16px;
      line-height: 30px;
      color: #575757;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  </style>
  <script type="text/javascript">
    var area = document.getElementById("msg");
    var iliHeight = document.getElementById("msg-content").clientHeight; //单行滚动的高度
	var speed = 50; //滚动的速度
	var wait = 1500; // 等待时间
    area.scrollTop = 0;
    area.innerHTML += area.innerHTML; //克隆一份一样的内容
    var timer = null;
    function startMove() {
      area.scrollTop++;
      if (parseInt(area.scrollTop) % iliHeight == 0) {
        clearInterval(timer);
        setTimeout("startMove()", wait);
      } else {
        if (area.scrollTop >= area.scrollHeight / 2) {
          area.scrollTop = 0;
        }
        setTimeout("startMove()", speed);
      }
    }
    startMove();
  </script>
</div>
```

参考地址

[https://www.cnblogs.com/adelina-blog/p/5717120.html](https://www.cnblogs.com/adelina-blog/p/5717120.html)

## 二级导航

config.toml

```toml
[[menu.main]]
    parent="categories"
    name="英语"
    url = "/categories/英语"
    weight=2
	[[menu.main]]
		parent="categories"
		name="地基"
		url = "/categories/地基"
		weight=1
	[[menu.main]]
		parent="categories"
		name="养成"
		url = "/categories/养成"
		weight=3
```

themes\maupassant\layouts\partials\header.html

```html
	<nav class="nav-list">
            <ul>
                <li><a class="{{ if or (.IsHome) (eq .Type "post") }}current{{ end }}" href="{{ .Site.BaseURL | absURL }}">首页</a></li>
                {{ range .Site.Menus.main }}
                    <li>
                        <a {{ if eq .URL $.RelPermalink }}class="current"{{ end }} href="{{ .URL | absURL }}" title="{{ .Name }}">{{ .Name }}</a>
                        <!-- 二级导航 -->
                        {{if .HasChildren}}
                        <ul>
                            {{ range .Children }}
                            <li>
                                <a href="{{ .URL }}">{{ .Name }}</a>
                            </li>
                            {{ end }}
                        </ul>
                        {{ end }}
                        <!-- 二级导航结束 -->
                    </li>
                {{ end }}
            </ul>
      </nav>
```

参考地址

[https://hugo.aiaide.com/post/%E8%87%AA%E5%AE%9A%E4%B9%89hugo%E4%B8%BB%E9%A2%98-%E5%AF%BC%E8%88%AA%E8%8F%9C%E5%8D%95/](https://hugo.aiaide.com/post/%E8%87%AA%E5%AE%9A%E4%B9%89hugo%E4%B8%BB%E9%A2%98-%E5%AF%BC%E8%88%AA%E8%8F%9C%E5%8D%95/)

[https://blog.csdn.net/tina_dl/article/details/88976800](https://blog.csdn.net/tina_dl/article/details/88976800)

[https://www.cnblogs.com/xcxc/p/4531846.html](https://www.cnblogs.com/xcxc/p/4531846.html)

------

## 永久链接

config.toml 配置

```toml
[params]
  # 永久链接
  post = "/post/:slug"
```

MD8短链接形式。文章模板设置  archetypes/default.md

```markdown
------
slug: {{ substr (md5 (printf "%s%s" .Date (replace .TranslationBaseName "-" " " | title))) 4 8 }}
------

效果
http://localhost:1313/post/35d98e9f/
```

参考地址

[Ramen's Box](https://blog.lxdlam.com/)，[https://blog.lxdlam.com/post/9cc3283b/](https://blog.lxdlam.com/post/9cc3283b/)

[Shuzang's Blog](https://shuzang.github.io/)，[https://shuzang.github.io/2019/07/hugo-blog-advanced-setup/#4-%E8%8B%B1%E6%96%87url](<https://shuzang.github.io/2019/07/hugo-blog-advanced-setup/#4-%E8%8B%B1%E6%96%87url>)

## SEO 优化

config.toml 配置

```toml
[params]
  author = "xxx"
  subtitle = "xxx"
  keywords = "xxx"
  description = "xxx"
```

layouts/partials/head.html 配置

```html
{{ if .IsHome -}}
<title>{{ .Site.Title }} | {{ .Site.Params.subtitle}}</title>
<meta property="og:site_name" content="{{ .Site.Author.name }}" />
<meta property="og:title" content="{{ .Site.Title }} | {{ .Site.Params.subtitle}}">
<meta property="og:type" content="website">
<meta property="og:description" content="{{ $.Site.Params.Description }}" />
<meta property="og:locale" content="zh_CN" />
<meta property="og:url" content="{{ .Permalink }}">
<meta name="keywords" content="{{.Site.Params.keywords}}">
<meta name="description" content="{{ with .Params.Description }}{{ . }}{{ else }}{{ $.Site.Params.Description }}{{ end }}">
{{- else -}}
<!-- Titles -->
<title>{{ if .IsHome -}}{{ .Site.Title }} {{ $.Site.Params.strapline }} {{- else -}}{{ .Title }} | {{ .Site.Title }}  {{ $.Site.Params.strapline }} {{- end }}</title>
<meta name="title" content="{{ if .IsHome -}}{{ .Site.Title }} {{ $.Site.Params.strapline }}{{- else -}}{{ .Title }} | {{ .Site.Title }} {{ $.Site.Params.strapline }} {{- end }}">
<!-- Descriptions -->
<meta property="og:site_name" content="{{ .Site.Author.name }}" />
<meta name="description" content="{{ with .Params.Description }}{{ . }}{{ else }}{{ $.Site.Params.Description }}{{ end }}">
<meta itemprop="description" content="{{ .Params.description }}" />
<meta property="og:description" content="{{ .Params.description }}" />
<meta property="og:locale" content="zh_CN" />
{{ with .Site.Params.keywords }}<meta name="keywords" content="{{ . }}">{{ end }}
{{ with .Site.LanguageCode }}<meta http-equiv="content-language" content="{{ . }}" />{{ end }}
<meta property="og:title" content="{{ .Title }} - {{ .Site.Title }}">
<meta property="og:type" content="article">
{{ with .Params.date }}
<meta property="article:published_time" content='{{ .Format "2006-01-02T15:04:05+08:00" }}'>
{{ end }}
{{ with .Params.lastmod }}
<meta property="article:modified_time" content='{{ .Format "2006-01-02T15:04:05+08:00" }}'>
{{ end }}
<meta name="keywords" content="{{ if .Keywords }}{{ .Keywords }}{{ else }}{{ .Site.Params.keywords }}{{ end }}">
{{ if .Params.author -}}
<meta name="author" content="{{ .Params.author }}">
{{ else }}
<meta name="author" content="{{ .Site.Author.name }}">
{{- end }}
{{- end }}

<!-- Link Tags -->
<base href="{{ .Permalink }}">
<link rel="canonical" href="{{ .Permalink }}" itemprop="url" /> 
<meta name="url" content="{{ .Permalink }}" />
<!-- Search Engine Crawler Tags -->
<meta name="robots" content="index,follow" /> 
<meta name="googlebot" content="index,follow" />
```

content/post/postpage.md

```markdown
-------
title: "xxx"
description: xxx
keywords: [xx,xx]
-------
```

参考地址

[https://wefox.me/docs/hugo_seo/](<https://wefox.me/docs/hugo_seo/>)

[https://blog.el-chavez.me/2015/11/26/go-hugo-seo/](<https://blog.el-chavez.me/2015/11/26/go-hugo-seo/>)

[https://www.skcript.com/svr/perfect-seo-meta-tags-with-hugo/](<https://www.skcript.com/svr/perfect-seo-meta-tags-with-hugo/>)

## 结构化数据

themes\maupassant\layouts\partials\seo_schema.html

```html
<script type="application/ld+json" class="aioseop-schema">
  {
      "@type": "BlogPosting",
      "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": {{ printf "%s" .Site.BaseURL }}
      },
      "articleSection": "{{ .Section }}",
      "name": "{{ .Title }}",
      "headline": "{{ .Title }}",
      "description": "{{ with .Params.Description }}{{ . }}{{ else }}{{ $.Site.Params.Description }}{{ end }}",
      "inLanguage": "zh_CN",
      "author": "{{ range .Site.Author }}{{ . }}{{ end }}",
      "creator": "{{ range .Site.Author }}{{ . }}{{ end }}",
      "publisher": "{{ range .Site.Author }}{{ . }}{{ end }}",
      "accountablePerson": "{{ range .Site.Author }}{{ . }}{{ end }}",
      "copyrightHolder": "{{ range .Site.Author }}{{ . }}{{ end }}",
      "copyrightYear": "{{ .Date.Format "2006" }}",
      "datePublished": "{{ .Date.Format "2006-01-02T15:04:05" }}+08:00",
      "dateModified": "{{if .Params.lastmod }}{{ .Params.lastmod.Format "2006-01-02T15:04:05" }}{{else}}{{ .Date.Format "2006-01-02T15:04:05"}}{{end}}+08:00",
      "url": {{ printf "%s" .Permalink }},
      "wordCount": "{{ .WordCount }}",
      "keywords": {{ if .Keywords }}{{ .Keywords }}{{ else }}{{ .Site.Params.keywords }}{{ end }}
  }
</script>
```

>   移除 "@context": "xxx"，gooogle search console 会报错。
>
>   标签来源，https://pc6a.com/1890.html

参考地址

[https://keithpblog.org/post/hugo-website-seo/](https://keithpblog.org/post/hugo-website-seo/)

## 统计字数

layouts/_default

```html
<span class="post-date">
     | 共 {{ .WordCount }} 字
</span>
```

参考地址

[木木木木木](https://immmmm.com/)，[https://immmmm.com/hugo-total-count/](<https://immmmm.com/hugo-total-count/>)

[零壹軒·笔记](https://note.qidong.name/)，[https://note.qidong.name/2017/06/24/hugo-word-count/](https://note.qidong.name/2017/06/24/hugo-word-count/)

## 面包屑导航

layouts/partials/breadcrumb.html

```html
<div  class="breadcrumb">
    {{ template "breadcrumbnav" (dict "p1" . "p2" .) }}
  </div>
  {{ define "breadcrumbnav" }}
  {{ if .p1.Parent }}
    {{ template "breadcrumbnav" (dict "p1" .p1.Parent "p2" .p2 )  }}
  {{ else if not .p1.IsHome }}
    {{ template "breadcrumbnav" (dict "p1" .p1.Site.Home "p2" .p2 )  }}
  {{ end }}
  <li{{ if eq .p1 .p2 }} class="active"{{ end }}>
    <a href="{{ .p1.Permalink }}">{{ .p1.Title }}</a>
  </li>
  {{ end }}
```

引入，layouts/_default/single.html

```html
{{ partial "breadcrumb.html" . }}
```

样式

```css
.breadcrumb {
  background: #fafafa;
  padding: 4px 15px;
  margin-bottom: 0px;
  list-style: none;
  border-radius: 5px;
}
.breadcrumb > li {
  display: inline-block;
  opacity: 0.7;
}
.breadcrumb > li + li:before {
  padding: 0 5px;
  color: #ccc;
  content: ">";
}
.breadcrumb li a {
  text-decoration: none;
}
.dark-theme .breadcrumb {
  background: #252627;
}

.page-photos figure {
  max-width: 80%;
  margin: 0 auto 3rem;
}
.page-photos figure img {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}
```

参考地址

[https://immmmm.com/hugo-add-breadcrumb/](https://immmmm.com/hugo-add-breadcrumb/)

## 阅读进度条

layouts/_default/single.html

```html
<div class="res-cons">
    {{ if (and .IsPage (not .Params.notsb)) }}
        <progress id="content_progress" value="0"></progress>
    {{ end }}
	{{ partial "breadcrumb.html" . }}
```

static/js

```js
document.addEventListener("DOMContentLoaded", function () {
    var winHeight = window.innerHeight;
    var docHeight = document.documentElement.scrollHeight;
    var progressBar = document.querySelector(".top-scroll-bar");
    progressBar.max = docHeight - winHeight;
    progressBar.value = window.scrollY;

    document.addEventListener("scroll", function () {
        progressBar.max =
            document.documentElement.scrollHeight - window.innerHeight;
        progressBar.value = window.scrollY;
    });
});
```

static/css

```css
/* 顶部阅读进度 */
.top-scroll-bar {
  /* Positioning */
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  width: 100%;
  height:3.5px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: none;
  background-color: transparent;
  color: #35a935;
}

.top-scroll-bar::-webkit-progress-bar {
  background-color: transparent;
}

.top-scroll-bar::-webkit-progress-value {
  background-color: #35a935;
}

.top-scroll-bar::-moz-progress-bar {
  background-color: #35a935;
}
/* 顶部阅读进度结束 */
```

参考地址

[https://cloud.tencent.com/developer/article/1197346](https://cloud.tencent.com/developer/article/1197346)

[https://shuzang.github.io/2019/09/hugo-blog-theme-beautify/](https://shuzang.github.io/2019/09/hugo-blog-theme-beautify/#3-%E6%B7%BB%E5%8A%A0%E9%98%85%E8%AF%BB%E8%BF%9B%E5%BA%A6%E6%9D%A1)

## 阅读时间统计

```html
<span class="more-meta">
     | 阅读约 {{ .ReadingTime }} 分钟
</span>
```

参考地址

[https://tihu.me/post/2020/2020-01-19-wordcount/](https://tihu.me/post/2020/2020-01-19-wordcount/  )

## 站点运行时间统计

```html
卡布茶出现时间 <span id="span_dt_dt" style="color: #4CAF50;"></span>
<script>
    function show_date_time(){
        window.setTimeout("show_date_time()", 1000);
        BirthDay=new Date("2020/6/1 00:00:00");//日期自己修改
        today=new Date();
        timeold=(today.getTime()-BirthDay.getTime());
        sectimeold=timeold/1000
        secondsold=Math.floor(sectimeold);
        msPerDay=24*60*60*1000
        e_daysold=timeold/msPerDay
        daysold=Math.floor(e_daysold);
        e_hrsold=(e_daysold-daysold)*24;
        hrsold=Math.floor(e_hrsold);
        e_minsold=(e_hrsold-hrsold)*60;
        minsold=Math.floor((e_hrsold-hrsold)*60);
        seconds=Math.floor((e_minsold-minsold)*60);
        span_dt_dt.innerHTML=""+daysold+"天"+hrsold+"小时"+minsold+"分"+seconds+"秒";
    }
    show_date_time();
</script>
```

参考地址

[https://10101.io/2018/09/16/Blog_2](https://10101.io/2018/09/16/Blog_2)

## Hugo 压缩命令HTML源码不带引号

>    Hugo --minify without quotes  

### 解决办法

config.toml 添加一下语句

```toml
[minify.tdewolff.html]
  keepDocumentTags = true
  keepQuotes = true
```

参考来源

@apoorvmote，[https://github.com/gohugoio/hugo/issues/6621](https://github.com/gohugoio/hugo/issues/6621)

## 最后修改时间

layouts/partial/copyright.html

```html
最后修改：{{ .Params.LastMod.Format "2006年01月02日" }}
```

post/demoartical.md

```toml
-----
lastmod: 2020-07-01
-----
```

参考来源

。

## 返回顶部

layouts/partials/footer.html

```html
<!-- 返回顶部 -->
<img loading="lazy" id="totop" src='{{ "images/site/top.png" | absURL }}' class="hidden-xs" style="display: none" />
<style>
    img#totop {
        position: fixed;
        bottom: 100px;
        width: 50px;
        cursor: pointer;
        z-index: 9999;
    }
</style>
<script>
    (function () {
        var goTop = document.getElementById('totop');
        var mainContainer = document.querySelector('.container');
        // 小屏幕不显示
        if(document.body.clientWidth < 1023){
            goTop.style.display == 'none'
            return
        }
        goTop.addEventListener('click', function () {
            window.scroll(0, 0);
        }, false);
        window.addEventListener('scroll', function () {
            var right = document.body.offsetWidth - mainContainer.getBoundingClientRect().right;
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            goTop.style.right = right + 10 + 'px'
            scrollTop > 100 && (goTop.style.display = "block");
            scrollTop <= 100 && (goTop.style.display = "none");
        });
    })();
</script>
```

参考来源

[https://geektutu.com/](https://geektutu.com/)

## 添加翻页功能

layouts\partials\related.html

```html
<div class="permalink">
  <ul class="post-paginator">
    {{with .PrevInSection}}
    <li class="previous">
      <a href="{{ .Permalink }}" title="{{ .Title }}">
        <div class="prevSlogan">Previous</div>
        <div class="prevTitle">{{ .Title }}</div>
      </a>
    </li>
    {{end}} {{with .NextInSection}}
    <li class="next">
      <a href="{{ .Permalink }}" title="{{ .Title }}">
        <div class="nextSlogan">Next</div>
        <div class="nextTitle">{{ .Title }}</div>
      </a>
    </li>
    {{end}}
  </ul>
</div>
<style>
  .post-paginator {
    display: flex;
    overflow: hidden;
    margin: 0;
    padding: 2.5rem 0 1rem 0;
    list-style: none;
    justify-content: space-between;
  }
  .post-paginator li {
    position: relative;
    max-width: 13rem;
  }
  .post-paginator li a:hover {
    color: #2ccf32;
  }
  .post-paginator .nextSlogan,
  .post-paginator .prevSlogan {
    color: #6e7173;
    font: bold 1.0rem "Oswald-Regular";
  }
  .post-paginator .nextSlogan::after {
    content: " >";
    font-size: 1.0rem;
  }
  .post-paginator .prevSlogan::before {
    content: "< ";
    font-size: 1.0rem;
  }
</style>
```

参考地址

[https://blog.lpflpf.cn/](https://blog.lpflpf.cn/)

## img  标签添加 alt 

操作

```html
![Your image title](http://your-image-url "Your img desc" class="img")

解析后
<img src="http://your-image-url" alt="Your image title" title="Your img desc" class="img">
```

参考地址

[https://discourse.gohugo.io/t/add-a-class-to-images/6724/2](https://discourse.gohugo.io/t/add-a-class-to-images/6724/2)

## 其他参考链接

[https://blog.olowolo.com/post/hugo-quick-start/](https://blog.olowolo.com/post/hugo-quick-start/)

[https://www.ariesme.com/post/2019/add_toc_for_hugo/](https://www.ariesme.com/post/2019/add_toc_for_hugo/)

[https://www.lanrenzhijia.com/others/6930.html](https://www.lanrenzhijia.com/others/6930.html)

## 主题地址

Github 地址点击这里： [https://github.com/flysnow-org/maupassant-hugo](https://github.com/flysnow-org/maupassant-hugo)。
