System has not been booted with systemd as init system (PID 1). Can't operate.
Failed to connect to bus: Host is down



翻译过来就是：“[系统](https://so.csdn.net/so/search?q=系统&spm=1001.2101.3001.7020)尚未以systemd作为初始系统启动”。

### 问题分析：

1）当你尝试使用 systemd 命令来管理 Linux 系统上的服务的时候，之所以会报错，可能因为系统中根本就没有使用 systemd，而是使用的 SysV init (sysvinit)。

2）如果你是在 windows 中通过 [WSL](https://so.csdn.net/so/search?q=WSL&spm=1001.2101.3001.7020) 使用的 Ubuntu 或者 Dibian 系统，默认情况下系统使用的是 SysV 而不是 systemd。