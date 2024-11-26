# 清理wsl磁盘空间

### 先以管理员身份运行powershell

```cmd
diskpart
```

### 查看wsl发行版本

```powershell
 wsl -l  -v
```

 ```bash
  NAME              STATE           VERSION
 
 * Ubuntu-22.04      Stopped         2
   docker-desktop    Stopped         2
 ```

### 查找 Linux 发行版的 *.vhdx* 文件和目录路径，

请打开 PowerShell 并使用以下脚本，将 `<distribution-name>` 替换为实际的发行版名称：

```powershell
(Get-ChildItem -Path HKCU:\Software\Microsoft\Windows\CurrentVersion\Lxss | Where-Object { $_.GetValue("DistributionName") -eq '<distribution-name>' }).GetValue("BasePath") + "\ext4.vhdx"
```

结果将显示类似于 `%LOCALAPPDATA%\Packages\<PackageFamilyName>\LocalState\<disk>.vhdx` 的路径。 例如：

```powershell
C:\Users\User\AppData\Local\Packages\CanonicalGroupLimited.UbuntuonWindows_79rhkp1fndgsc\LocalState\ext4.vhdx
```

这是与你列出的 Linux 发行版关联的 `ext4.vhdx` 文件的路径。



先关掉

```powershell
wsl --shutdown
```

### 压缩磁盘文件

```powershell
//4-3 依次输入下列命令
//选择目标磁盘文件
select vdisk file="C:\Users\JIACHENGER\AppData\Local\Docker\wsl\data\DockerDesktopWSL\data\ext4.vhdx"

select vdisk file="C:\Users\JIACHENGER\AppData\Local\Packages\CanonicalGroupLimited.Ubuntu22.04LTS_79rhkp1fndgsc\LocalState\ext4.vhdx"
//以只读模式连接虚拟磁盘文件
attach vdisk readonly

//开始压缩虚拟磁盘文件
compact vdisk

//分离虚拟磁盘文件
detach vdisk

//退出diskpart工具
exit
```





显示与此虚拟磁盘关联的详细信息，包括**虚拟大小**，表示当前分配给 VHD 的大小上限

```cmd
detail vdisk
```



扩展空间

[如何管理 WSL 磁盘空间 | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/disk-space#how-to-locate-the-vhdx-file-and-disk-path-for-your-linux-distribution)

# 清理docker

[Windows WSL2 占用磁盘空间清理释放_wsl占用空间太大-CSDN博客](https://blog.csdn.net/arvinrong/article/details/135723290)

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

