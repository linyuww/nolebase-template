





## 创建socket

```cpp
#include <sys/types.h>          /* See NOTES */
#include <sys/socket.h>
#include<unistd.h>
#include<iostream>
using namespace std;

int main() {
	
   /* WSADATA ws;
	WSAStartup(MAKEWORD(2, 2), &ws);
    */
    for(int i = 0;i < 2000;i++){

    
	int sock = socket(AF_INET, SOCK_STREAM, 0);
	cout <<"["<< sock << "]";

    close(sock);
    }


}
```

**缺头文件就man相应的函数，看看在哪个头文件里**

```bash
man socket//查看相应头文件
```

```bash
man close
```

注意linux最大到1023，之后创建会失败，所以要在使用完后关闭

从[3]开始,因为0,1,2被占用，标准输入输出，错误输出

```bash
ulimit -n
```

看数量限制 

如果就想要2000个

```bash
ulimit -n 3000
```



server端

## 绑定端口

```cpp
unsigned short port = 8080;
	sockaddr_in saddr;
	saddr.sin_family = AF_INET;
	saddr.sin_port = htons(port);//主机字节序转换为网络字节序
//大端，小端，即高位是从最大开始，还是从最低开始
```

[Windows下使用Visual Studio + WSL2开发Linux项目之环境部署](https://www.cnblogs.com/leebri/p/17136064.html)

有空可以搞搞，但是有点没必要

```cpp
saddr.sin_addr.s_addr = htonl(0);//绑定ip地址
//绑定内部ip就只能内部访问，绑定外部就只能外部访问
//绑定0，就内外都能访问
```

```cpp
if(bind(sock,(sockaddr*)&saddr,sizeof(saddr))!= 0)
{
        cout << "bind port: " << port << " failed";
        return -2;
}
cout << "bind port: " << port << " success!\n";
```

### **这里换行符刷新缓冲区**

`在C++中，标准输出流`（std::cout）是缓冲的，这意味着输出的数据会先放到一个缓冲区中，等到缓冲区满了或者遇到特定的刷新条件时，才会真正输出到屏幕上。以下是几种导致缓冲区刷新的情况：

1. **遇到换行符**（`\n`）：输出包含换行符时，缓冲区会被刷新。
2. **显式刷新**：调用 `std::cout.flush()` 来显式刷新缓冲区。
3. **程序正常结束**：程序结束时，缓冲区会被自动刷新。
4. **使用 `std::endl`**：`std::endl` 不仅输出换行符，还会刷新缓冲区。

在你的例子中，如果你在输出中加上换行符，缓冲区会立即被刷新，输出会立即显示在屏幕上。如果没有换行符，输出可能会被缓存在缓冲区中，直到缓冲区被显式刷新或程序结束。

## 监听

```cpp
while(listen(sock, 10) == 0);// 开始监听
```

`listen` 函数是用来使一个套接字进入监听状态的，这样可以接受来自客户端的连接请求。它的函数原型如下：

```cpp
int listen(int sockfd, int backlog);
```

- **sockfd**: 要监听的套接字描述符。
- **backlog**: 未完成连接队列的最大长度。

### `backlog` 参数

`backlog` 参数指定了内核应该为套接字维护的未完成连接队列的最大长度。这是指那些已经到达的连接请求但还没有被服务器进程通过 `accept` 接受的连接数量。

具体来说：

- **未完成连接队列**：包含那些已经通过三次握手建立连接，但还没有被服务器进程调用 `accept` 处理的连接。
- **半连接队列**：包含那些已经发送了 SYN 包但还没有完成三次握手的连接（这些连接还没有真正建立）。



打开另一个终端，用telnet连接服务器

```bash
telnet localhost 8080
Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.
```

## 接收连接，读取连接信息

```cpp
int client = accept(sock,0,0);
printf("accept client %d \n",client);
```

按道理这里client应该是4，标准输入输出加上错误输出占了文件描述符0，1，2

3是之前的sock,这里accept又创建了一个sock所以是4

但是事实上输出了`5`,推测和wsl有关

**不读取要关掉**

```cpp
close(client);
```

## 获取连接者的ip地址和端口号

```cpp
sockaddr_in caddr;//结构体，存客户端信息
socklen_t len = 0;//长度
int client = accept(sock,(sockaddr*)&caddr , &len);//传入长度，长度可能会变长，所以传指针，地址存进caddr里
```

```cpp
char *ip = inet_ntoa(caddr.sin_addr);//转成字符串
unsigned short cport = ntohs(caddr.sin_port);//这个函数在多线程中可能有问题，实际工程中不使用
printf("client ip is %s ,port is %d \n",ip cport);
```

## 接受用户数据

第一个sock专门用来建立连接，所以recv传入client，而不是sock

```cpp
char buf[1024] = {0};
int len = recv(client,buf,sizeof(buf) - 1,0);//最后flag 和系统有关
```

### `recv` 函数

`recv` 函数用于从套接字接收数据，并将数据存储在指定的缓冲区中。它的函数原型如下：

```cpp
size_t recv(int sockfd, void *buf, size_t len, int flags);
```

- **sockfd**: 要从中接收数据的套接字描述符。
- **buf**: 指向接收数据的缓冲区的指针。
- **len**: 缓冲区的长度。
- **flags**: 接收选项（通常设置为0）。

```cpp
 char buf[1024] = {0};
    for(;;)//持续，当输入quit或者空白时退出
{
    int recvlen = recv(client,buf,sizeof(buf) - 1,0);
    if(recvlen <= 0)break;

    buf[recvlen] = '\0';
    if(strstr(buf,"quit") != NULL)break;
    cout << "recv " << buf << '\n';
}
```

## 服务端回应客户端数据send

```cpp
for循环内
if(strstr(buf,"quit") != NULL)
    {    
        char re[] = "quit success!\n";
        send(client,re,strlen(re) + 1,0);
        break;
    
    }
cout << "recv " << buf << '\n';

int sendlen = send (client,"ok\n",4,0);
```

send和recv用法基本一样，recv的len是发送的最大长度，send则是发送的具体长度









