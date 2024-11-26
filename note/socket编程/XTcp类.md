## 创建XTcp类接口

头文件放在cpp文件里，不要放在.h里，可能会产生交叉冲突,不易调试

XTcp.cpp

```cpp
#include "XTcp.h"
#include <cstring>
#include<iostream>
#include <thread>
#ifndef WIN32
#include<Windows.h>
#define socklen_t int
#endif
using namespace std;
```

构造函数

```cpp
XTcp::XTcp()
{
#ifdef WIN32
    static bool first = true;
    if (first)
    {
        first = false;
        WSADATA ws;
        WSAStartup(MAKEWORD(2, 2), &ws);
    }
#endif // WIN32
}
```

创建socket

```cpp
int XTcp::CreateSocket() 
{
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock == -1) {
        std::cout << "create failed\n";
    }
    return sock;
}
```

绑定端口

```cpp
bool XTcp::Bind(unsigned short port) 
{
  
    sockaddr_in saddr;
    saddr.sin_family = AF_INET;
    saddr.sin_port = htons(port);
    saddr.sin_addr.s_addr = htonl(INADDR_ANY);//绑定ip地址
    //绑定内部ip就只能内部访问，绑定外部就只能外部访问
    //绑定0，就内外都能访问


    if (bind(sock, (sockaddr*)&saddr, sizeof(saddr)) != 0)
    {
        cout << "bind port: " << port << " failed\n";
        return -2;
    }
    // cout << "bind port: " << port << " success!";
    cout << "bind port: " << port << " success!\n";


    listen(sock, 10);// 开始监听
}
```

接受连接

```cpp
XTcp XTcp::Accept() {
    XTcp tcp;
    sockaddr_in caddr;//结构体
    socklen_t len = sizeof(caddr);

    int client = accept(sock, (sockaddr*)&caddr, &len);
    if (client <= 0)return tcp;
    printf("accept client %d \n", client);

    tcp.ip = inet_ntoa(caddr.sin_addr);
    tcp.port = ntohs(caddr.sin_port);
    tcp.sock = client;
    printf("client ip is %s ,port is %d \n", tcp.ip.c_str(), tcp.port);

    return tcp;
}
```

接收信息

```cpp
int XTcp::Recv(char* buf, int bufsize)
{
    return recv(sock, buf, bufsize, 0);
}
```

发送信息

```cpp
int XTcp::Send(const char* buf, int sendsize)
{
    int sendedSize = 0;

    while(sendedSize != sendsize)
    {
        int len = send(sock, buf + sendedSize, sendsize - sendedSize, 0);
        if (len <= 0)break;
        sendedSize += len;
    }

    return sendedSize;
}
```

关闭连接

```cpp
void XTcp::Close()
{
    if (sock <= 0)return;
    closesocket(sock);
}
```





## main.cpp

```cpp
#include <cstring>
#include<iostream>
#include <thread>
#include "XTcp.h"
#include<string.h>
class TcpTheard {
public:
    void Main()
    {
        char buf[1024] = { 0 };
        for (;;)
        {
            int recvlen = client.Recv(buf, sizeof(buf) - 1);
            if (recvlen <= 0)break;

            buf[recvlen] = '\0';

            if (strstr(buf, "quit") != NULL)
            {
                char re[] = "quit success!\n";
                client.Send(re, strlen(re) + 1);
                break;

            }
            int sendlen = client.Send("ok\n", 4);
            std::cout << "recv " << buf << '\n';
        }
        client.Close();
        delete this;
    }
    XTcp client;
};

int main(int argc, char* argv[]) {
    
    //cout << "sock = " << sock << '\n';
    unsigned short port = 9080;
    if (argc > 1)port = atoi(argv[1]);

    XTcp server;
    server.CreateSocket();
     while(!server.Bind(port))//如果绑定失败，绑定下一个端口，直到绑定成功为止
  {
      port++;
  }

    for (;;)
    {
        XTcp client = server.Accept();//阻塞的
        TcpTheard* th = new TcpTheard();//如何清理对象,主线程操作子线程危险
        th->client = client;
        std::thread sth(&TcpTheard::Main, th);
        sth.detach();
    }
    server.Close();
    getchar();
}
```

