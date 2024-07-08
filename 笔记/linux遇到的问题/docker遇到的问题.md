拉取镜像失败是网络问题，先看网络





docker命令报错error during connect: Get http://2F2F.2Fpipe2Fdocker_engine/v1.36/containers/json: open//.

在清理docker时遇到

```powershell
 docker system prune
```

原因是docker无法挂载到wsl上

因为刚刚执行压缩命令占用了vhdx文件，不能把docker文件关联上

关机重启就好

```powershell
 docker system prune
WARNING! This will remove:
  - all stopped containers
  - all networks not used by at least one container
  - all dangling images
  - unused build cache

Are you sure you want to continue? [y/N] y
Total reclaimed space: 0B
```

[Win11 安装 Docker Desktop 和 WSL2 并进行安装位置迁移_windows 11 wsl 修改安装位置-CSDN博客](https://blog.csdn.net/cn_ljr/article/details/132047516)

迁移docker