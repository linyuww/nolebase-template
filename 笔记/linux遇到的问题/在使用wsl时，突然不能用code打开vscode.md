## 在使用wsl时，突然不能用`code`打开`vscode`

加一行配置环境变量可以解决

```bash
export PATH="$PATH:/mnt/c/Users/86147/AppData/Local/Programs/Microsoft VS Code/bin"
```

但是不够优雅

在 `/etc/wsl.conf` 中明确追加 PATH 配置

```
[interop]
appendWindowsPath = true
```

设置完以上方法后，发现还是一样因为本来就默认共享环境变量



发现vscode文件路径名称**有空格**

wsl执行

```bash
echo $PATH
```

出现

```bash
/mnt/c/Users/86147/AppData/Local/Programs/Microsoft:VS:Code/bin
```

空格被识别成分割

所以可能是更新后路径名出现了这个bug导致无法正常识别环境变量

### 解决方案是用短路径

Windows 文件系统有短路径名（8.3 格式）支持，通常无空格，可以兼容在 WSL 和 Windows 下使用。你可以先找到短路径名，然后将其添加到环境变量中。

1. **获取短路径名**： 打开 Windows 命令提示符（cmd），输入以下命令以获取 `Microsoft VS Code` 文件夹的短路径名：

   ```bash
   cmd
   
   dir "C:\Users\86147\AppData\Local\Programs\" /x
   ```

   你可能会看到一行输出类似：

   ```bash
   03/12/2024  09:00 AM    <DIR>          MICRO~1    Microsoft VS Code
   ```

   `MICRO~1` 就是此文件夹的短路径名。用这个名字可以避免空格问题。

2. **将短路径名添加到 PATH**： 在 Windows 的环境变量设置中，将 VS Code 的路径设置为短路径格式。例如，将路径设置为：

   ```bash
   C:\Users\86147\AppData\Local\Programs\MICRO~1\bin
   ```

   在 WSL 中，这个路径会自动被映射到 `/mnt/c/Users/86147/AppData/Local/Programs/MICRO~1/bin`，WSL 能正确解析。