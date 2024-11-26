wsl的代理如何与主机共享

需要拉取docker镜像，但是curl无效

设置配置文件.wslconfig后仍然ping不通

ping，ping的是ip，用的是icmp协议，在osi七层模型中用的是第三层（网络层）



其实是curl google.com

直接得到的就是

```xml
<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
<TITLE>301 Moved</TITLE></HEAD><BODY>
<H1>301 Moved</H1>
The document has moved
<A HREF="http://www.google.com/">here</A>.
</BODY></HTML>
```

用浏览器访问一下就知道了

```bash
 curl https://www.google.com.hk/  
```

这个才是正确的

