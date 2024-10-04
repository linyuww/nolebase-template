### 配置zsh遇到的问题

今天打开wsl，发现外观莫名其妙全变了，修改powershell的外观设置后，发现zsh的命令行颜色怎么改还是舒服，文件夹是蓝底白字的，想修改成蓝底黑字，网上搜索之后发现并没有关于配置文件的教程

我就又去查找了我安装的主题p10k,找到了这篇博客，[powerlevel10k 颜色和图标的自定义设置-CSDN博客](https://blog.csdn.net/qq_36835255/article/details/128101588#:~:text=DIR是段的名称，B)

打开`~/.p10k.zsh`搜索关键词`DIR`

```bash
############################[ dir: 当前目录 ]###########################
# 当前目录的背景色。
typeset -g POWERLEVEL9K_DIR_BACKGROUND=4

# 当前目录的默认前景色。
typeset -g POWERLEVEL9K_DIR_FOREGROUND=232

# 如果目录过长，缩短其中一些段为最短的唯一前缀。缩短后的目录仍可通过 Tab 键补全为原来的完整路径。
typeset -g POWERLEVEL9K_SHORTEN_STRATEGY=truncate_to_unique

# 用此符号替换被移除的目录段后缀。
typeset -g POWERLEVEL9K_SHORTEN_DELIMITER=

# 缩短后的目录段的颜色。
typeset -g POWERLEVEL9K_DIR_SHORTENED_FOREGROUND=232

# 锚点目录段的颜色。锚点段永远不会被缩短。第一个段始终是锚点。
typeset -g POWERLEVEL9K_DIR_ANCHOR_FOREGROUND=232

# 将锚点目录段以加粗方式显示。
typeset -g POWERLEVEL9K_DIR_ANCHOR_BOLD=true
```

注释交给gpt翻译了一下，修改即可

按照上面教程的方法，颜色代码可以输入以下命令查看

```bash
for code ({000..255}) print -P -- "$code: %F{$code}最左侧三位数字即颜色值Text Color%f"
```

**每次修改配置后一定要输入**

```bash
source ~/.p10k.zsh
```



修改之后遇到问题，发现缩短后的锚点文件夹不能加粗显示，修改配置文件也不行。

经检查发现是powershell外观配置问题，把`外观->文本格式`强调文本格式部分设置成加粗字体即可



还有一个意外发现就是在复制上面配置文件时，发现vim不能和windows共享剪贴板

于是搜索得到以下解决方案

[clipboard - How to copy/paste from Vim in WSL - Stack Overflow](https://stackoverflow.com/questions/61550552/how-to-copy-paste-from-vim-in-wsl)

1.按`v`进入可视模式，滑动鼠标或者输入行数选中

2.按`:`，输入以下命令即可

```bash
w !clip.exe
```

如果要复制全部文本则直接输入该命令

```bash
:w !clip.exe
```



